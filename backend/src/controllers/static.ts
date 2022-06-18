import {NextFunction, Response, Router} from 'express'
import {IGetUserAuthInfoRequest} from '../types/interfaces'
import {authMiddleware} from '../middlewares/auth.middleware'
import fs from 'fs-extra'
import {asyncHandler} from '../utils/asyncHandler'
import * as path from 'path'
import upload from '../middlewares/fileUpload.middleware'

const router = Router()

router.post(
  '/upload',
  [authMiddleware.optional, upload.single('image')],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    res.status(200).json({
      url: process.env.NODE_ENV == 'PRODUCTION' ? req.file.location : `${process.env.SERVER_STORE}uploads/` + req.file.filename,
    })
  })
)

router.get(
  '/geo-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json', 'custom.json'), (err, data) => {
      if (err) res.status(404).send(err)
      res.status(200).send(data)
    })
  })
)

router.get(
  '/languages-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json', 'languages.json'), (err, data) => {
      if (err) res.status(404).send(err)
      res.status(200).send(data)
    })
  })
)

router.get(
  '/countries-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json', 'data_json.json'), (err, data) => {
      if (err) res.status(404).send(err)
      res.status(200).send(data)
    })
  })
)

export default router
