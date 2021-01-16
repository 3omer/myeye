const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        const newName = new Date().getTime() + "-" + file.originalname
        cb(null, newName)
    }
})
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 2e+6, files: 1 }
}).single('image')

module.exports = { uploadImage }