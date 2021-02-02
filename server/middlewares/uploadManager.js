const path = require('path')
const multer = require("multer")
const unique = require("unique-filename")

const uploadDir = process.env.UPLOAD_DIR

const imageExt = ['.jpg', '.png']

/**
 * Create a unique filename and keep given extension
 * @param {string}  ext file extension
 * @returns {string}    newfilename 
 */
const newFileName = (ext) =>  unique('','img') + ext

/**
 * @param {string} ext file extnsion
 * @returns {Boolean}
 */
const isImageExt = (ext) => imageExt.includes(ext)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // if the request from the worker save the image to downloads
        if (req.worker) {
            return cb(null, process.env.DOWNLOAD_DIR)
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        if (isImageExt(ext)) {
            if (req.worker) {
                return cb(null, file.originalname)
            }
            cb(null, newFileName(ext))
        } else {
            cb(new Error('Unsupported file extension'))
        }
    }
})

const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 2e+6, files: 1 }
}).single('image')

module.exports = { uploadImage }