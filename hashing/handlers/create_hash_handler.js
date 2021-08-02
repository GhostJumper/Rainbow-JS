const db = require("../../db/maria_db")
const hash = require("../hashing")

//Manages the request body of an http request to extract and manage found plain text and return wanted hashes
async function manageBatch(req_body) {
    if (typeof req_body.req_list === 'undefined') throw Error(`couldn't find req_list`)
    let result = {"res_list": [], "err_list": []}

    for (const entry of req_body.req_list) {
        result = await manageOne(entry, result)
    }

    return result
}

//Manages one entry to return thw wanted results
async function manageOne(req_body_entry, result) {

    if (typeof req_body_entry.plain_text !== "undefined" && typeof req_body_entry.algorithms !== "undefined") {
        result.res_list.push(hash.filterAlgorithms(await hashOneToDB(req_body_entry.plain_text), req_body_entry.algorithms))
    } else result.err_list.push(req_body_entry)

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

module.exports = {manageBatch}