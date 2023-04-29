const multer = require('multer')
const {v1: uuid} = require('uuid')
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')

const MIME_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
    region: 'us-east-1'
})

const fileUpload =  multer({
    limits: 5000000,
    storage: multerS3({
        s3: s3,
        bucket: 'fantasyprofessors-uploads',
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `${uuid()}.${MIME_TYPE[file.mimetype]}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValidFile = !!MIME_TYPE[file.mimetype]
        cb(isValidFile ? null : new Error('Invalid mime type'), isValidFile)
    }
})

module.exports = fileUpload