const express = require("express")
let router = express.Router()

let hash_handler = require("../hashing/hash_handler")

router.use(express.json())

router.get("/", async (req, res) => {

    try {
        res.send(await hash_handler.manageOne(req.query.plain_text, req.query.algorithm))
    } catch (err) {
        res.status(400).send(err.message)
    }

})

/* //TODO: implement
router.get("/batch", async (req, res) => {
    res.send(req.body)
})

 */

module.exports = router