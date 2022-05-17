"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findToken = exports.removeToken = exports.refreshTokenService = exports.validateRefreshToken = exports.validateAccessToken = exports.generateTokens = exports.saveToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var api_error_1 = __importDefault(require("../utils/api-error"));
var dotenv = require('dotenv');
dotenv.config();
var saveToken = function (userId, refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.refreshToken.upsert({
                    where: {
                        userId: userId
                    },
                    update: {
                        token: refreshToken
                    },
                    create: {
                        userId: userId,
                        token: refreshToken,
                    },
                    select: {
                        token: true,
                        userId: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.saveToken = saveToken;
var generateTokens = function (user) {
    var accessToken = jsonwebtoken_1.default.sign(__assign(__assign({}, user), { role: user === null || user === void 0 ? void 0 : user.role.role }), process.env.ACCESS_TOKEN, { expiresIn: '60d' });
    var refreshToken = jsonwebtoken_1.default.sign(__assign(__assign({}, user), { role: user === null || user === void 0 ? void 0 : user.role.role }), process.env.REFRESH_TOKEN, { expiresIn: '60d' });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};
exports.generateTokens = generateTokens;
var validateAccessToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
exports.validateAccessToken = validateAccessToken;
var validateRefreshToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN);
    }
    catch (e) {
        console.log(e);
        return null;
    }
};
exports.validateRefreshToken = validateRefreshToken;
var refreshTokenService = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, tokenFromDb, user, tokens;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!refreshToken) {
                    throw new api_error_1.default(404, { message: 'Error refresh token!' });
                }
                userData = (0, exports.validateRefreshToken)(refreshToken);
                return [4 /*yield*/, PrismaClient_1.default.refreshToken.findUnique({
                        where: { token: refreshToken },
                    })];
            case 1:
                tokenFromDb = _a.sent();
                if (!userData || !tokenFromDb) {
                    throw new api_error_1.default(404, { message: 'Error refresh token!' });
                }
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: { id: userData.id },
                        select: {
                            id: true,
                            email: true,
                            password: true,
                            picture: true,
                            role: {
                                select: {
                                    role: true
                                }
                            }
                        },
                    })];
            case 2:
                user = _a.sent();
                tokens = (0, exports.generateTokens)(user);
                return [4 /*yield*/, (0, exports.saveToken)(user.id, tokens.refreshToken)];
            case 3:
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, tokens), { user: user })];
        }
    });
}); };
exports.refreshTokenService = refreshTokenService;
var removeToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.refreshToken.delete({ where: { token: refreshToken } })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.removeToken = removeToken;
var findToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.refreshToken.findUnique({ where: { token: refreshToken } })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findToken = findToken;
//# sourceMappingURL=token.service.js.map