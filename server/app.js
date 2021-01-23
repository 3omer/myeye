require("dotenv").config()
const path = require('path')
const express = require("express")
const morgan = require('morgan')
const multer = require("multer")
const app = express()
const reportsRouter = require("./routes/reports")

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// setting static directory
app.use('/download', express.static(path.join(__dirname, "/public/download")))
app.use('/public/download', express.static(path.join(__dirname, "/public/download")))
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

app.listen( process.env.PORT, () => {
    console.log('SERVER RUNING : ' + process.env.PORT)
    
})
