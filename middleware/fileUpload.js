const multer = require('multer')
const {v1: uuid} = require('uuid')

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const fileUpload =  multer({
    limits: 5000000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images')
        },
        filename: (req, file, cb) => {
            const fileExtension = MIME_TYPE[file.mimetype]
            cb(null, uuid() + '.' + fileExtension)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValidFile = !!MIME_TYPE[file.mimetype]
        cb(isValidFile ? null : new Error('Invalid mime type'), isValidFile)
    }
})

module.exports = fileUpload