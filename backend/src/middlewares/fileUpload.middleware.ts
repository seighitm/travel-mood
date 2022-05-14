const multer = require("multer");
import * as path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '..', 'uploads'));
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 10024 * 20240,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("INVALID_TYPE"));
    }
  },
});
