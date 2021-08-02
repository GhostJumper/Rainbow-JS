const express = require("express")
let router = express.Router()

let hash_handler = require("../hashing/handlers/create_hash_handler")

router.use(express.json())

router.get("/", async (req, res) => {
    try {
        res.send(await hash_handler.manageBatch(req.body))
    } catch (err) {
        res.status(400).send(err.message)
    }

})



module.exports = router