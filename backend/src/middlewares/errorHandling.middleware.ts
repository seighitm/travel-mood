import ApiError from "../utils/api-error";
import {NextFunction, Response} from "express";
import fs from "graceful-fs";
import path from "path";
import {IGetUserAuthInfoRequest} from "../utils/interfaces";
import {isEmptyArray, isFile, isNullOrUndefined} from "../utils/primitive-checks";

module.exports = function (err: ApiError, req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  console.log(err)
  if (err && err.errorCode) {
    if (!isNullOrUndefined(req?.files) && !isEmptyArray(req?.files) && isFile(req?.files[0])) {
      for (let i = 0; req?.files.length; i++) {
        fs.unlink(path.resolve(__dirname, '..', 'uploads', req?.files[i].filename), function (err) {
          if (err) return console.log(err);
          console.log('Files deleted successfully!');
        });
      }
    } else if (!isNullOrUndefined(req?.file) && isFile(req?.file)) {
      fs.unlink(path.resolve(__dirname, '..', 'uploads', req?.file.filename), function (err) {
        if (err) return console.log(err);
        console.log('File deleted successfully!');
      });
    }
  }
  console.log(err.errorCode)
  if (err && err.errorCode)
    res.status(err.errorCode).json(err.message);
  else if (err)
    res.status(500).json(err.message);
}
