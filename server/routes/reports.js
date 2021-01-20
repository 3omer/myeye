const path = require("path")
const router = require("express").Router()
const { uploadImage } = require("../middlewares/uploadManager")
const toImageQueue = require("../rClient")

// upload image
router.post("/api/v1/requests", uploadImage, async (req, res, next) => {
    const filename = req.file.filename
    const absImgPath = path.join(process.cwd(), process.env.UPLOAD_DIR, filename)
    const absOutPath = path.join(process.cwd(), process.env.DOWNLOAD_DIR, filename) 
    const absDownloadLink = "bgek ya 5awl"
    try {
        await toImageQueue(absImgPath, absOutPath)
        console.log("New request pushed to Image Queue", absImgPath, absOutPath)
        
        res.json({
            msg: "Request accepted. Processing image may take several minutes",
            "downloadLink": process.env.DOWNLOAD_DIR + filename
        })
    } catch (error) {
        console.error(error)
        return res.status(503).json({ error: "Serivce is busy :(" })
    }

})

// ?q=fileidentefire
router.get("/api/v1/reports", (req, res) => {
    const q = req.query.q
    res.json({ q })
})


module.exports = router
