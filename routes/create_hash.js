const express = require("express")
let router = express.Router()

let hash_handler = require("../hashing/hash_handler")

router.get("/(:algorithm)?", async (req, res) => {

    try {
        res.send(await hash_handler.manageOne(req.query.plain_text, req.params.algorithm))
    } catch (err) {
        res.status(400).send(err.message)
    }

})

module.exports = router