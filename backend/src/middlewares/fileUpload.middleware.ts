import * as path from 'path'

const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const multer = require('multer')

export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname),
})

export default multer(process.env.NODE_ENV === 'PRODUCTION'
  ? {
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname})
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + '_' + file.originalname)
      },
    }),
  }
  : {
    storage: storage,
    limits: {
      fileSize: 1024 * 2024,
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('INVALID_TYPE'))
      }
    },
  }
)
