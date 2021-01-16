require("dotenv").config()
const path = require('path')
const express = require("express")
const morgan = require('morgan')
const app = express()
const reportsRouter = require("./routes/reports")

// middlewares
app.use(express.json())
app.use(morgan("dev"))

// setting static directory
app.use(express.static(path.join(__dirname, "public")))

// adding routes
app.use(reportsRouter)

// handle errors
app.use((error, req, res, next) => {
    console.error(error)
    res.status(500).json({ error: "Something went wrong" })
})

app.listen( process.env.PORT, () => {
    console.log('SERVER RUNING : ' + process.env.PORT)
    
})