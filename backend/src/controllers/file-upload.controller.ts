import {NextFunction, Response, Router} from 'express';
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {authMiddleware} from "../middlewares/auth.middleware";
import fs from 'fs-extra'
import {asyncHandler} from "../utils/asyncHandler";
import {removeFiles} from "../services/file-upload.services";
import * as path from "path";

const router = Router();
const upload = require("../middlewares/fileUpload.middleware");
// import {upload}  from "../middlewares/aws-multer"

router.post('/upload',
  [authMiddleware.optional, upload.single("image")],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    res.status(200).json({
      url: req.file.location
    });
  })
)

router.delete('/files/remove',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    const data = await removeFiles(req.body.files)
    res.send(data);
  })
)

router.get('/geo-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json', 'custom.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

router.get('/languages-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json','languages.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

router.get('/countries-data',
  [authMiddleware.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data-json', 'data_json.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

export default router;
