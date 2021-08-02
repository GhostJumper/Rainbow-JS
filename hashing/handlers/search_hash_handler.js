const db = require("../../db/maria_db")
const hash = require("../hashing")

async function manageBatch(req_body) {
    if (typeof req_body.req_list === 'undefined') throw Error(`couldn't find req_list`)
    let result = {"res_list": {"found": [], "not_found": []}, "err_list": []}

    for (const entry of req_body.req_list) {
        result = await manageOne(entry, result)
    }

    return result
}

async function manageOne(req_body_entry, result) {
    if (typeof req_body_entry.hash !== "undefined" && typeof req_body_entry.algorithm !== "undefined" && hash.known_algorithms[req_body_entry.algorithm] !== "undefined") {
        result = manage_db_result(await db.requestHashResult(req_body_entry.algorithm, req_body_entry.hash), req_body_entry, result)
    } else result.err_list.push(req_body_entry)

    return result
}

function manage_db_result(db_result, req_body_entry, result) {
    if (db_result === null) {
        result.res_list.not_found.push(req_body_entry)
    } else {
        req_body_entry.plain_text = db_result
        result.res_list.found.push(req_body_entry)
    }
    return result
}


module.exports = {manageBatch}