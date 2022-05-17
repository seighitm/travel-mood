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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRating = exports.unfollowUser = exports.followUser = exports.getProfile = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var profile_selector_1 = __importDefault(require("../selectors/profile.selector"));
var api_error_1 = __importDefault(require("../utils/api-error"));
var profile_mapper_1 = __importDefault(require("../mappers/profile.mapper"));
var getProfile = function (userId, ownerId) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                    where: {
                        id: Number(userId),
                    },
                    select: profile_selector_1.default,
                })];
            case 1:
                profile = _a.sent();
                if (!profile) {
                    throw new api_error_1.default(404, {});
                }
                return [2 /*return*/, (0, profile_mapper_1.default)(profile, ownerId)];
        }
    });
}); };
exports.getProfile = getProfile;
var followUser = function (userId, ownerUserId) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                    where: {
                        id: Number(userId),
                    },
                    data: {
                        followedBy: {
                            connect: {
                                id: Number(ownerUserId),
                            },
                        },
                    },
                    select: profile_selector_1.default,
                })];
            case 1:
                profile = _a.sent();
                return [2 /*return*/, (0, profile_mapper_1.default)(profile, ownerUserId)];
        }
    });
}); };
exports.followUser = followUser;
var unfollowUser = function (userId, ownerUserId) { return __awaiter(void 0, void 0, void 0, function () {
    var profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                    where: {
                        id: Number(userId),
                    },
                    data: {
                        followedBy: {
                            disconnect: {
                                id: Number(ownerUserId),
                            },
                        },
                    },
                    select: profile_selector_1.default,
                })];
            case 1:
                profile = _a.sent();
                return [2 /*return*/, (0, profile_mapper_1.default)(profile, ownerUserId)];
        }
    });
}); };
exports.unfollowUser = unfollowUser;
var setUserRating = function (profileId, rating, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var profileRating, userRatings, arr, sum, avg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.userRatings.upsert({
                    where: {
                        profileId_userId: {
                            profileId: Number(profileId),
                            userId: userId
                        }
                    },
                    update: {
                        rating: Number(rating),
                    },
                    create: {
                        rating: Number(rating),
                        profileId: Number(profileId),
                        userId: userId
                    }
                })];
            case 1:
                profileRating = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.userRatings.findMany({
                        where: {
                            profileId: Number(profileId)
                        }
                    })];
            case 2:
                userRatings = _a.sent();
                arr = Object.values(userRatings);
                sum = function (prev, cur) { return ({ rating: prev.rating + cur.rating }); };
                avg = arr.reduce(sum).rating / arr.length;
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: {
                            id: Number(profileId)
                        },
                        data: {
                            rating: avg
                        }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, Math.floor(avg)];
        }
    });
}); };
exports.setUserRating = setUserRating;
//# sourceMappingURL=profile.service.js.map