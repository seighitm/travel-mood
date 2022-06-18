import ApiError from '../utils/api-error'
import {NextFunction, Response} from 'express'
import fs from 'graceful-fs'
import path from 'path'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {isEmptyArray, isFile, isNullOrUndefined} from '../utils/primitive-checks'

const errorHandlingMiddleware = function (
  err: ApiError,
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) {
  console.log(err)
  if (err && err.errorCode) {
    if (!isNullOrUndefined(req?.files) && !isEmptyArray(req?.files) && isFile(req?.files[0])) {
      for (let i = 0; req?.files.length; i++) {
        if (req?.files[i]?.filename) {
          fs.unlink(path.resolve(__dirname, '..', 'uploads', req?.files[i]?.filename), function (err) {
            if (err) return console.log(err)
            console.log('Files deleted successfully!')
          })
        } else if (req?.files[i]?.key) {
          // s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: req?.files[i]?.key }, (err, data) => {
          //   if (err) console.log(err, err.stack)
          //   else console.log('delete', data)
          // })
        }
      }
    } else if (!isNullOrUndefined(req?.file) && isFile(req?.file)) {
      if (req?.file?.filename) {
        fs.unlink(path.resolve(__dirname, '..', 'uploads', req?.file?.filename), function (err) {
          if (err) return console.log(err)
          console.log('File deleted successfully!')
        })
      } else if (req?.file?.key) {
        // s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: req?.file?.key }, (err, data) => {
        //   if (err) console.log(err, err.stack)
        //   else console.log('delete', data)
        // })
      }
    }
  }
  if (err && err.errorCode) {
    res.status(err.errorCode).json(err.message)
  } else if (err) {
    res.status(500).json(err.message)
  }
}

export default errorHandlingMiddleware
