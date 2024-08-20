
const express = require("express")
const router = express.Router()
const Controller = require("../controllers/Job.controller")

router.post("/create", Controller.createJob)
router.get("/get", Controller.getAllJob)
router.patch("/update", Controller.updateJob)
router.delete("/delete/:id", Controller.deleteJob)

module.exports = router
