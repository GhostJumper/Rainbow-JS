const db = require("../db/maria_db")
const hash = require("./hashing")
const e = require("express");

async function manageBatch(batch) {
    if (typeof batch.req_list === 'undefined') throw Error(`couldn't find req_list`)

    let result = {"res_list": [], "err_list": []}

    for (const entry of batch.req_list) {
        if (typeof entry.plain_text !== 'undefined' && typeof entry.algorithms !== 'undefined') {
            result.res_list.push(await createBatchEntry(entry.plain_text, entry.algorithms))
        } else
            result.err_list.push(entry)
    }

    return result

}

async function createBatchEntry(plain_text, algorithms) {
    return {
        "plain_text": plain_text,
        "res": filterResultByAlgorithms(await hashOneToDB(plain_text), algorithms)
    }
}

//Takes one String, hashes it, and returns the result of one or all algorithms
async function manageOne(plain_text, algorithm) {

    let hashes = await hashOneToDB(plain_text)

    if (typeof algorithm === 'undefined') {
        return hashes
    } else {
        return filterResultByAlgorithm(hashes, algorithm)
    }

}

//Takes a list of hashes and filters by one algorithm
function filterResultByAlgorithm(hashes, algorithm) {
    if (!(algorithm in hash.known_algorithms)) return {[algorithm]: null}
    return {[algorithm]: hashes[algorithm]}
}

//Takes a list of hashes and filters by multiple algorithms
function filterResultByAlgorithms(hashes, algorithms) {
    if (algorithms.length === 0) return removePlainText(hashes)

    let result = {}
    algorithms.forEach(algorithm => {
        result[algorithm] = filterResultByAlgorithm(hashes, algorithm)[algorithm]
    })

    return result
}

//Removes the "plain_text" from the hash object
function removePlainText(hashes) {
    let result = hashes
    delete result.plain_text
    return result
}

//Takes a String, looks up if already in db, if not hashes, inserts and returns all results
async function hashOneToDB(plain_text) {
    let result = await db.getRainbowRow(plain_text)
    if (typeof result === 'undefined') {
        result = hash.hashAll(plain_text)
        await db.insertAlreadyHashed(result)
    }
    return result
}

module.exports = {manageOne, manageBatch}