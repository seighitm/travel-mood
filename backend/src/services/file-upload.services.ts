import fs from "fs-extra";
import * as path from "path";
import {isEmptyArray, isNullOrUndefined, isString} from "../utils/primitive-checks";

export const removeFiles = async (files: any): Promise<any> => {
  if (!isNullOrUndefined(files) && !isEmptyArray(files) && isString(files[0])) {
    files.forEach(async (file: any) => await fs.remove(path.resolve(__dirname, '..', 'uploads', file)))
  }
};
