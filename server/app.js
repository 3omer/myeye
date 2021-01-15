require("dotenv").config()
const path = require('path')
const express = require("express")
const morgan = require('morgan')
const { uploadImage } = require("./middlewares/uploadManager")
const app = express()

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// setting static directory
app.use(express.static(path.join(__dirname, "public")))

app.get("/api/v1/requests/:id", (req, res) => {
    const reportId = req.params['id']
    const reportDetails = ['list of objects found']
    const imageProcessed = "http://host:port/static/result.jpg"
    res.json({ reportId, reportId, imageProcessed })
})

// upload image
app.post("/api/v1/requests", uploadImage, (req, res) => {
    const image = req.file
    res.json({ filename: image.originalname })
})

app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
})

app.listen( process.env.PORT, () => {
    console.log('SERVER RUNING : ' + process.env.PORT)
    
})