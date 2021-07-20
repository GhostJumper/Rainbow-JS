const db = require("../db/maria_db")
const hash = require("./hashing")

//Takes one String, hashes it, and returns the result of one or all algorithms
async function manageOne(plain_text, algorithm) {

    let hashes = await hashOneToDB(plain_text)

    if (typeof algorithm === 'undefined') {
        return hashes
    } else {
        return filterResultByAlgorithm(hashes, algorithm)
    }

}

//Takes a list of hashes and filters one by algorithm
async function filterResultByAlgorithm(hashes, algorithm) {
    if (!(algorithm in hash.known_algorithms)) throw Error(`the algorithm "${algorithm}" is unsupported`)
    return {[algorithm]: hashes[algorithm]}
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

module.exports = {manageOne}