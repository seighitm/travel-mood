import fs from "fs-extra";
import * as path from "path";
import {isEmptyArray, isNullOrUndefined, isString} from "../utils/primitive-checks";
import {s3} from "../middlewares/aws-multer";

export const removeFiles = async (files: any): Promise<any> => {
  console.log('^^^^^^^^^')
  console.log(files)
  console.log('^^^^^^^^^')
  if (!isNullOrUndefined(files) && !isEmptyArray(files) && isString(files[0])) {
    for (let i = 0; files.length; i++) {
      if (files[i]) {
        // await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: files[i]}, (err, data) => {
        //   if (err) {
        //     console.log(err, err.stack);
        //     return err
        //   }
        //   else {
        //     console.log('delete', data);
        //     return data
        //   }
        // })
      }
    }
    // files.forEach(async (file: any) => await fs.remove(path.resolve(__dirname, '..', 'uploads', file)))
  }
  return
};
