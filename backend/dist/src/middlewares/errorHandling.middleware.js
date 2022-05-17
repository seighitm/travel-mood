"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graceful_fs_1 = __importDefault(require("graceful-fs"));
var path_1 = __importDefault(require("path"));
var primitive_checks_1 = require("../utils/primitive-checks");
module.exports = function (err, req, res, next) {
    console.log(err);
    if (err && err.errorCode) {
        if (!(0, primitive_checks_1.isNullOrUndefined)(req === null || req === void 0 ? void 0 : req.files) && !(0, primitive_checks_1.isEmptyArray)(req === null || req === void 0 ? void 0 : req.files) && (0, primitive_checks_1.isFile)(req === null || req === void 0 ? void 0 : req.files[0])) {
            for (var i = 0; req === null || req === void 0 ? void 0 : req.files.length; i++) {
                graceful_fs_1.default.unlink(path_1.default.resolve(__dirname, '..', 'uploads', req === null || req === void 0 ? void 0 : req.files[i].filename), function (err) {
                    if (err)
                        return console.log(err);
                    console.log('Files deleted successfully!');
                });
            }
        }
        else if (!(0, primitive_checks_1.isNullOrUndefined)(req === null || req === void 0 ? void 0 : req.file) && (0, primitive_checks_1.isFile)(req === null || req === void 0 ? void 0 : req.file)) {
            graceful_fs_1.default.unlink(path_1.default.resolve(__dirname, '..', 'uploads', req === null || req === void 0 ? void 0 : req.file.filename), function (err) {
                if (err)
                    return console.log(err);
                console.log('File deleted successfully!');
            });
        }
    }
    console.log(err.errorCode);
    if (err && err.errorCode)
        res.status(err.errorCode).json(err.message);
    else if (err)
        res.status(500).json(err.message);
};
//# sourceMappingURL=errorHandling.middleware.js.map