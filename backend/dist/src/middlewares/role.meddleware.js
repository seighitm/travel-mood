"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_error_1 = __importDefault(require("../utils/api-error"));
var token_service_1 = require("../services/token.service");
var getTokenFromHeaders = function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        return req.headers.authorization.split(' ')[1];
    return null;
};
var AuthMiddleware = function (roles) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            var accessToken = getTokenFromHeaders(req);
            if (!accessToken)
                return next(new api_error_1.default(401, { errors: { body: ["Unauthorized"] } }));
            var userData = (0, token_service_1.validateAccessToken)(accessToken);
            if (!userData)
                return next(new api_error_1.default(401, { errors: { body: ["Unauthorized"] } }));
            if (!roles.includes(userData.role))
                return next(new api_error_1.default(403, { errors: { body: ["Permission Denied"] } }));
            req.user = userData;
            next();
        }
        catch (e) {
            console.log(e);
            return next(new api_error_1.default(401, { message: "Unauthorized" }));
        }
    };
};
exports.default = AuthMiddleware;
//# sourceMappingURL=role.meddleware.js.map