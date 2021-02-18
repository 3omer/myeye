// require("dotenv").config()
const path = require('path')
const fs = require("fs")
const express = require("express")
const morgan = require('morgan')
const multer = require("multer")
const app = express()
const reportsRouter = require("./routes/reports")

// middlewares
app.use(express.json())
app.use(morgan("dev"))

const UPLOAD_DIR = path.join(__dirname, process.env.UPLOAD_DIR)
const DOWNLOAD_DIR = path.join(__dirname, process.env.DOWNLOAD_DIR)

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR)
}

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR)
}

// setting static directory
app.use('/download', express.static(path.join(__dirname, process.env.DOWNLOAD_DIR)))
app.use("/upload", express.static(process.env.UPLOAD_DIR))

// adding routes
app.use(reportsRouter)

// handle errors
app.use((error, req, res, next) => {
    console.error(error)
    if (error instanceof multer.MulterError) {
        res.status(400).json({ error: "Ensure you are uploading image file. Only [.jpg, .png] are accepted" })
    } else {
        res.status(500).json({ error: "Something went wrong" })
    }
})

app.listen(process.env.PORT, () => {
    console.log('SERVER RUNING : ' + process.env.PORT)

})
