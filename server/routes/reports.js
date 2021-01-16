const router = require("express").Router()
const { uploadImage } = require("../middlewares/uploadManager")
const store = require("../models/report")
router.get("/api/v1/requests/:id", (req, res) => {
    const report = store.getReport(req.params["id"])
    res.json({ report })
})

// upload image
router.post("/api/v1/requests", uploadImage, (req, res) => {
    const image = req.file
    const report = store.requestReport(image.path)
    report.resultLink = "/api/v1/requests" + report.id
    res.json({ id: report.id, resultLink: report.resultLink })
})

module.exports = router
