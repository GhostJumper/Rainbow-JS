const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: "192.168.178.52",
    user: "rainbow-js",
    password: "7OdEHESE2o48z8ta5IyiBuc1LimO1u",
    database: "rainbowtable"
})

//Returns plain_text from hash
async function requestHashResult(algorithm, hash) {
    try {
        let conn = await pool.getConnection()
        let rows = await conn.query("SELECT plain_text FROM rainbowtable WHERE " + algorithm + " LIKE \"" + hash + "\"")
        return rows[0].input

    } catch (err) {
        console.log(err)
    }
}

//Return the whole row dependant on the text to prevent duplicate entries
async function getRainbowRow(plain_text) {
    try {
        let conn = await pool.getConnection()
        let rows = await conn.query("SELECT * FROM rainbowtable WHERE plain_text LIKE \"" + plain_text + "\"")
        return rows[0]

    } catch (err) {
        console.log(err)
    }
}

//Inserts whole Row into DB
async function insertAlreadyHashed(hashes) {
    try {
        let conn = await pool.getConnection()
        await conn.query("INSERT INTO rainbowtable (`plain_text`, `md5`, `sha1`, `sha256`, `sha512`) VALUES ('"+hashes.plain_text+"', '"+hashes.md5+"', '"+hashes.sha1+"', '"+hashes.sha256+"', '"+hashes.sha512+"')")

    } catch (err) {
        console.log(err)
    }
}

module.exports = {requestHashResult, getRainbowRow ,insertAlreadyHashed}