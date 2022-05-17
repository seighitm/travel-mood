"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_service_1 = require("../services/auth.service");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var asyncHandler_1 = require("../utils/asyncHandler");
var token_service_1 = require("../services/token.service");
var router = (0, express_1.Router)();
var upload = require("../middlewares/fileUpload.middleware");
/**
 * @desc Register a new user and return its data
 * @route POST /api/auth/register
 * @access Public
 * @param {*} req.body
 * @param {*} req.file
 * @returns {Promise} Promise
 */
router.post('/auth/register', [auth_middleware_1.authM.optional, upload.single("image")], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.createUser)(req.body, req.file)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Login user and return its data.
 * @route POST /api/auth/login
 * @access Public
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/login', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.login)(req.body.user)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Create new refresh token
 * @access PRIVATE
 * @route {POST} api/refresh
 * @body-param localRefreshToken
 * @returns {accessToken, refreshToken, user}
 */
router.post('/refresh', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userData;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, token_service_1.refreshTokenService)((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.localRefreshToken)];
            case 1:
                userData = _b.sent();
                return [2 /*return*/, res.json(userData)];
        }
    });
}); }));
/**
 * @desc Decode and send user info from token
 * @access PRIVATE
 * @route {POST} api/auth/me
 * @returns {Promise} Promise
 */
router.get('/auth/me', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.getCurrentUser)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Logout user from account
 * @access PUBLIC
 * @route {GET} api/auth/logout
 * @returns {Promise} Promise
 */
router.get('/auth/logout', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) {
    res.json(req.user);
}));
/**
 * @desc Forgot user password
 * @access PUBLIC
 * @route {POST} api/auth/forgot-password
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/forgot-password', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.forgotPassword)((_a = req.body) === null || _a === void 0 ? void 0 : _a.email)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Reset user password
 * @access PUBLIC
 * @route {POST} api/auth/reset-password
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/auth/reset-password', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.resetPassword)((_a = req.body) === null || _a === void 0 ? void 0 : _a.password, (_b = req.body) === null || _b === void 0 ? void 0 : _b.resetToken)];
            case 1:
                user = _c.sent();
                res.status(200).json({
                    message: "An email has been sent to ".concat(user.email, " with further instructions."),
                });
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=auth.controller.js.map