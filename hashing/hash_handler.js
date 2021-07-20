const db = require("../db/maria_db")
const hash = require("./hashing")

async function manageOne(plain_text, algorithm) {

    let hashes = await hashOneToDB(plain_text)

    if (typeof algorithm === 'undefined') {
        return hashes
    } else {
        if (!(algorithm in hash.known_algorithms)) throw Error(`the algorithm "${algorithm}" is unsupported`)
        return {[algorithm]: hashes[algorithm]}
    }

}

async function hashOneToDB(plain_text) {
    let result = await db.getRainbowRow(plain_text)
    if (typeof result === 'undefined') {
        result = hash.hashAll(plain_text)
        await db.insertAlreadyHashed(result)
    }
    return result
}

module.exports = {manageOne}