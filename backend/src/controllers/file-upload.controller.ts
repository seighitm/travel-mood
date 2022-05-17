import {NextFunction, Response, Router} from 'express';
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {authM} from "../middlewares/auth.middleware";
import fs from 'fs-extra'
import {asyncHandler} from "../utils/asyncHandler";
import {removeFiles} from "../services/file-upload.services";
import * as path from "path";

const router = Router();
const upload = require("../middlewares/fileUpload.middleware");
// import {upload}  from "../middlewares/aws-multer"

router.post('/upload',
  [authM.optional, upload.single("image")],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    console.log(req.file)

    res.status(200).json({
      url: req.file.location
    });
  })
)

router.delete('/files/remove',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    const data = await removeFiles(req.body.files)
    console.log(data)
    res.send(data);
  })
)

router.get('/geo-data',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'custom.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

router.get('/languages-data',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'languages.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

router.get('/countries-data',
  [authM.optional],
  asyncHandler(async (req: IGetUserAuthInfoRequest | any, res: Response, next: NextFunction) => {
    fs.readJson(path.resolve(__dirname, '..', 'assets', 'data_json.json'), (err, data) => {
      if (err) res.status(404).send(err);
      res.status(200).send(data);
    })
  })
)

export default router;
