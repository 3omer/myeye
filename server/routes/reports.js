const path = require("path")
const fs = require("fs")
const router = require("express").Router()
const { uploadImage } = require("../middlewares/uploadManager")
const sendToImageQueue = require("../rClient")

/**
 * build meta data of the image needed for further processing
 * @param {string} host server address. for example 192.168.42.2:80
 * @param {string} filename image filename
 * @returns {object} imageMeta - orignalImageURL and resultImageURL 
 */
function constructImageMeta(host, filename) {
    return {
        originalImageURL: 'http://' + path.join(host, 'upload', filename),
        resultImageURL: 'http://' + path.join(host, 'download', filename)
    }
}

// upload image
router.post("/api/v1/request", uploadImage, async (req, res, next) => {
    console.log("File uploaded to", req.file.path);

    const filename = req.file.filename
    const imageMeta = constructImageMeta(req.get("host"), filename)

    try {
        await sendToImageQueue(imageMeta.originalImageURL, imageMeta.resultImageURL)
        res.json({
            msg: "Request accepted. Processing image may take several minutes",
            requestID: "",
            imageURL: imageMeta.originalImageURL,
            resultURL: imageMeta.resultImageURL,
            progress: "pending"
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
    req.worker = true
    next()
}, uploadImage, (req, res, next) => {
    // const requestId = req.body.requestId
    // const progress = req.body.progress //TODO
    // const erros = req.body.progress.erros
    res.json({ msg: "OK" })
})

module.exports = router
