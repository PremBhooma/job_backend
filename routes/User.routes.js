
const express = require("express")
const router = express.Router()
const Controller = require("../controllers/User.controller")

router.post("/create", Controller.createUser)
router.post("/login", Controller.loginUser)

module.exports = router
