const path = require("path")
const fs = require("fs")
const router = require("express").Router()
const { uploadImage } = require("../middlewares/uploadManager")
const toImageQueue = require("../rClient")

// upload image
router.post("/api/v1/request", uploadImage, async (req, res, next) => {
    console.log("File uploaded to", req.file.path);

    const filename = req.file.filename
    const absImgPath = path.join(process.env.UPLOAD_DIR, filename)
    const absOutPath = path.join(process.env.DOWNLOAD_DIR, filename)
    const absDownloadLink = "bgek ya 5awl"
    try {
        await toImageQueue(absImgPath, absOutPath)
        console.log("New request pushed to Image Queue", absImgPath, absOutPath)

        res.json({
            msg: "Request accepted. Processing image may take several minutes",
            requestID: "",
            originalImageSrc: "upload/", filename,
            processedImageSrc: process.env.DOWNLOAD_DIR + filename
        })
    } catch (error) {
        console.error(error)
        return res.status(503).json({ error: "Serivce is busy :(" })
    }

})

// ?q=fileidentefire
router.get("/api/v1/result", (req, res) => {
    // TODO: implement
    const requestId = req.query.requestId
    res.json({
        requestId: requestId,
        originalImageSrc: "/upload/img-12345.jpg",
        processedImageSrc: "/download/img-12345.jpg",
        progress: "pending"
    })
})

router.put("/webhooks/notify-progress", (req, res, next) => {
    // TODO: the worker call this endpoint to notify image is ready or failed
    const requestId = req.body.requestId
    const progress = req.body.progress
    const erros = req.body.progress.erros
    res.json({ msg: "OK" })
})

module.exports = router
