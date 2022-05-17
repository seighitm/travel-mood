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
exports.addNewProfileVisit = exports.admin_users = exports.getAllFavoriteItems = exports.fullSearchUsers = exports.getUserById = exports.getProfileViews = exports.createProfileView = exports.getUsersByNameOrEmail = exports.activateUserProfile = exports.blockUserProfile = exports.checkUserProfileViews = exports.addInterestedVisitedCountries = exports.updateUserImages = exports.updateUserGeneralInfo = exports.updateUserPersonalInfo = exports.updateUserMap = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var client_1 = require("@prisma/client");
var token_service_1 = require("./token.service");
var api_error_1 = __importDefault(require("../utils/api-error"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var primitive_checks_1 = require("../utils/primitive-checks");
var user_validator_1 = require("../validators/user.validator");
var removeUnusedImages = function (imagesToRemove) { return __awaiter(void 0, void 0, void 0, function () {
    var i, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, primitive_checks_1.isNullOrUndefined)(imagesToRemove) && !(0, primitive_checks_1.isEmptyArray)(imagesToRemove)) {
                    for (i = 0; i < imagesToRemove.length; i++)
                        fs_extra_1.default.remove(path_1.default.resolve(__dirname, '..', 'uploads', imagesToRemove[i].image), function (err) {
                            if (err)
                                console.log(err);
                            console.log('File deleted successfully!');
                        });
                }
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < imagesToRemove.length)) return [3 /*break*/, 4];
                return [4 /*yield*/, PrismaClient_1.default.userImage.delete({
                        where: { image: imagesToRemove[i].image },
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateUserMap = function (userId, _a) {
    var interestedInCountries = _a.interestedInCountries, visitedCountries = _a.visitedCountries;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: {
                            id: Number(userId)
                        },
                        data: {
                            interestedInCountries: {
                                set: interestedInCountries.map(function (item) { return ({ code: item }); })
                            },
                            visitedCountries: {
                                connect: visitedCountries.map(function (item) { return ({ code: item }); })
                            }
                        },
                        select: {
                            id: true
                        }
                    })];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
exports.updateUserMap = updateUserMap;
var updateUserPersonalInfo = function (userId, _a) {
    var email = _a.email, password = _a.password, oldPassword = _a.oldPassword;
    return __awaiter(void 0, void 0, void 0, function () {
        var userInfo, hashedPassword, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ((0, primitive_checks_1.isNullOrUndefined)(password)) {
                        throw new api_error_1.default(404, { message: 'You did not enter your password!' });
                    }
                    else if (!(0, primitive_checks_1.isNullOrUndefined)(password) && (0, primitive_checks_1.isShortStringThan)(password, 8)) {
                        throw new api_error_1.default(404, { message: 'Password should have at least 8 letters!' });
                    }
                    if ((0, primitive_checks_1.isNullOrUndefined)(oldPassword)) {
                        throw new api_error_1.default(404, { message: 'You did not enter your old password!' });
                    }
                    else if (!(0, primitive_checks_1.isNullOrUndefined)(oldPassword) && (0, primitive_checks_1.isShortStringThan)(oldPassword, 8)) {
                        throw new api_error_1.default(404, { message: 'Password should have at least 8 letters!' });
                    }
                    return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                            where: {
                                id: Number(userId)
                            },
                            select: {
                                password: true
                            },
                        })];
                case 1:
                    userInfo = _b.sent();
                    if (!bcryptjs_1.default.compareSync(oldPassword, userInfo.password)) {
                        throw new api_error_1.default(404, { message: 'The old password is incorrect!' });
                    }
                    return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 2:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, PrismaClient_1.default.user.update({
                            where: {
                                id: Number(userId)
                            },
                            data: {
                                email: email,
                                password: hashedPassword,
                            },
                            select: {
                                id: true,
                                role: {
                                    select: {
                                        role: true
                                    }
                                }
                            }
                        })];
                case 3:
                    user = _b.sent();
                    return [4 /*yield*/, (0, token_service_1.saveToken)(user.id, (0, token_service_1.generateTokens)(user).refreshToken)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, __assign(__assign({}, user), { role: user.role.role, accessToken: (0, token_service_1.generateTokens)(user).accessToken, refreshToken: (0, token_service_1.generateTokens)(user).refreshToken })];
            }
        });
    });
};
exports.updateUserPersonalInfo = updateUserPersonalInfo;
var updateUserGeneralInfo = function (userId, _a) {
    var firstName = _a.firstName, lastName = _a.lastName, country = _a.country, birthday = _a.birthday, languages = _a.languages, gender = _a.gender;
    return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, user_validator_1.UserPayloadValidator)({ gender: gender, birthday: birthday, languages: languages });
                    return [4 /*yield*/, PrismaClient_1.default.user.update({
                            where: {
                                id: Number(userId)
                            },
                            data: __assign(__assign(__assign(__assign({ firstName: firstName, lastName: lastName }, (!(0, primitive_checks_1.isNullOrUndefined)(gender)
                                ? {
                                    gender: {
                                        connect: {
                                            gender: gender
                                        }
                                    }
                                } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(birthday)
                                ? { birthday: birthday }
                                : { birthday: null })), (!(0, primitive_checks_1.isNullOrUndefined)(country)
                                ? {
                                    country: {
                                        connect: {
                                            code: country
                                        }
                                    },
                                }
                                : {
                                    country: {
                                        disconnect: true
                                    }
                                })), { languages: {
                                    set: languages.map(function (language) { return ({
                                        name: language
                                    }); }),
                                } }),
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                birthday: true,
                                gender: true,
                                role: {
                                    select: {
                                        role: true
                                    }
                                }
                            },
                        })];
                case 1:
                    user = _b.sent();
                    return [4 /*yield*/, (0, token_service_1.saveToken)(user.id, (0, token_service_1.generateTokens)(user).refreshToken)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, __assign(__assign({}, user), { role: user.role.role, accessToken: (0, token_service_1.generateTokens)(user).accessToken, refreshToken: (0, token_service_1.generateTokens)(user).refreshToken })];
            }
        });
    });
};
exports.updateUserGeneralInfo = updateUserGeneralInfo;
var updateUserImages = function (userId, _a, files) {
    var oldImages = _a.oldImages, profileImage = _a.profileImage;
    return __awaiter(void 0, void 0, void 0, function () {
        var dbUser, imagesToRemove, user;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            id: Number(userId),
                        },
                        select: {
                            picture: true,
                            images: {
                                select: {
                                    image: true,
                                },
                            },
                        },
                    })];
                case 1:
                    dbUser = _d.sent();
                    if (!!(0, primitive_checks_1.isNullOrUndefined)(dbUser)) return [3 /*break*/, 5];
                    if (!(!(0, primitive_checks_1.isNullOrUndefined)(oldImages) && !(0, primitive_checks_1.isEmptyArray)(oldImages))) return [3 /*break*/, 3];
                    imagesToRemove = (_b = dbUser === null || dbUser === void 0 ? void 0 : dbUser.images) === null || _b === void 0 ? void 0 : _b.filter(function (item) { return !(oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(item.image)); });
                    return [4 /*yield*/, removeUnusedImages(imagesToRemove)];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, removeUnusedImages(dbUser === null || dbUser === void 0 ? void 0 : dbUser.images)];
                case 4:
                    _d.sent();
                    _d.label = 5;
                case 5: return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: { id: Number(userId) },
                        data: __assign(__assign({}, (profileImage != 'null' && profileImage != null && oldImages && (oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(profileImage))
                            ? {
                                picture: {
                                    connect: {
                                        image: profileImage
                                    }
                                }
                            }
                            : {
                                picture: {
                                    disconnect: true
                                }
                            })), (!(0, primitive_checks_1.isNullOrUndefined)(files) && !(0, primitive_checks_1.isEmptyArray)(files)
                            ? {
                                images: {
                                    create: files === null || files === void 0 ? void 0 : files.map(function (imageName) { return ({
                                        image: imageName.filename
                                    }); })
                                }
                            } : {
                            images: {
                                set: (_c = dbUser === null || dbUser === void 0 ? void 0 : dbUser.images) === null || _c === void 0 ? void 0 : _c.filter(function (item) { return oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(item.image); }).map(function (image) { return ({ image: image.image }); })
                            }
                        })),
                        select: client_1.Prisma.validator()({
                            id: true,
                            email: true,
                            picture: true,
                            images: true,
                            role: {
                                select: {
                                    role: true
                                }
                            }
                        }),
                    })];
                case 6:
                    user = _d.sent();
                    return [2 /*return*/, __assign(__assign({}, user), { accessToken: (0, token_service_1.generateTokens)(user).accessToken, refreshToken: (0, token_service_1.generateTokens)(user).refreshToken })];
            }
        });
    });
};
exports.updateUserImages = updateUserImages;
var addInterestedVisitedCountries = function (userId, payload) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                    where: { id: Number(userId) },
                    data: __assign(__assign({}, (payload.interestedInCountries
                        ? {
                            interestedInCountries: {
                                set: []
                            }
                        } : {})), (payload.visitedCountries
                        ? {
                            visitedCountries: {
                                set: []
                            }
                        } : {}))
                })];
            case 1:
                _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: { id: Number(userId) },
                        data: __assign(__assign({}, (!(0, primitive_checks_1.isNullOrUndefined)(payload.interestedInCountries)
                            ? {
                                interestedInCountries: {
                                    connect: payload.interestedInCountries.map(function (item) { return ({ where: { code: item } }); })
                                },
                            } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(payload.visitedCountries)
                            ? {
                                visitedCountries: {
                                    connect: payload.visitedCountries.map(function (item) { return ({ where: { code: item } }); })
                                }
                            } : {}))
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addInterestedVisitedCountries = addInterestedVisitedCountries;
var checkUserProfileViews = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.profileViews.updateMany({
                    where: {
                        guestId: Number(userId)
                    },
                    data: {
                        seen: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.checkUserProfileViews = checkUserProfileViews;
var blockUserProfile = function (userId, expiredBlockDate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                    where: { id: Number(userId) },
                    data: {
                        activatedStatus: 'BLOCKED',
                        blockExpiration: new Date(expiredBlockDate)
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.blockUserProfile = blockUserProfile;
var activateUserProfile = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.update({
                    where: { id: Number(userId) },
                    data: {
                        activatedStatus: 'ACTIVATED',
                        blockExpiration: null
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.activateUserProfile = activateUserProfile;
var getUsersByNameOrEmail = function (searchField) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!(0, primitive_checks_1.isNullOrUndefined)(searchField) && !(0, primitive_checks_1.isEmptyString)(searchField))) return [3 /*break*/, 2];
                return [4 /*yield*/, PrismaClient_1.default.user.findMany({
                        where: {
                            OR: [
                                {
                                    OR: [
                                        { firstName: { contains: searchField === null || searchField === void 0 ? void 0 : searchField.split(' ')[0] } },
                                        { firstName: { contains: searchField === null || searchField === void 0 ? void 0 : searchField.split(' ')[1] } }
                                    ],
                                },
                                {
                                    OR: [
                                        { lastName: { contains: searchField === null || searchField === void 0 ? void 0 : searchField.split(' ')[0] } },
                                        { lastName: { contains: searchField === null || searchField === void 0 ? void 0 : searchField.split(' ')[1] } }
                                    ]
                                }
                            ]
                        },
                        select: {
                            id: true,
                            followedBy: true,
                            following: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            picture: true,
                            favoritedArticle: true
                        },
                    })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [2 /*return*/, []];
        }
    });
}); };
exports.getUsersByNameOrEmail = getUsersByNameOrEmail;
var createProfileView = function (userId, guestId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(Number(guestId) != Number(userId))) return [3 /*break*/, 2];
                return [4 /*yield*/, PrismaClient_1.default.profileViews.upsert({
                        where: {
                            guestId_userId: {
                                userId: Number(userId),
                                guestId: Number(guestId)
                            }
                        },
                        update: {
                            createdAt: new Date().toISOString(),
                            seen: false
                        },
                        create: {
                            user: {
                                connect: { id: Number(userId) }
                            },
                            guest: {
                                connect: { id: Number(guestId) }
                            }
                        }
                    })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
exports.createProfileView = createProfileView;
var getProfileViews = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                    where: { id: Number(userId) },
                    select: {
                        id: true,
                        picture: true,
                        guests: {
                            select: {
                                user: {
                                    include: {
                                        picture: true
                                    }
                                },
                                createdAt: true,
                                seen: true,
                            },
                            orderBy: { createdAt: 'desc' }
                        },
                        pofilesVisit: {
                            select: {
                                user: true,
                                createdAt: true
                            },
                            orderBy: { id: 'asc' }
                        }
                    },
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getProfileViews = getProfileViews;
var getUserById = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                    where: {
                        id: Number(userId)
                    },
                    include: {
                        country: true,
                        followedBy: true,
                        following: {
                            include: {
                                picture: true
                            }
                        },
                        languages: true,
                        favoritedArticle: true,
                        images: true,
                        picture: true,
                        gender: {
                            select: {
                                gender: true
                            }
                        },
                        chats: {
                            select: {
                                id: true
                            }
                        },
                        trips: {
                            include: {
                                user: {
                                    include: {
                                        picture: true
                                    }
                                },
                                places: true,
                                destinations: true,
                                languages: true,
                                tripFavoritedBy: true,
                                usersJoinToTrip: {
                                    include: {
                                        user: true
                                    }
                                }
                            }
                        },
                        articles: {
                            include: {
                                favoritedBy: true,
                                countries: true,
                                author: true
                            }
                        },
                        visitedCountries: true,
                        interestedInCountries: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getUserById = getUserById;
var fullSearchUsers = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var users, ageMinMax_1;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findMany({
                    where: __assign(__assign(__assign(__assign(__assign(__assign({}, (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.name) && !(0, primitive_checks_1.isEmptyString)(query === null || query === void 0 ? void 0 : query.name)
                        ? {
                            OR: [
                                {
                                    OR: [
                                        { firstName: { contains: (_a = query.name) === null || _a === void 0 ? void 0 : _a.split(' ')[0] } },
                                        { firstName: { contains: (_b = query.name) === null || _b === void 0 ? void 0 : _b.split(' ')[1] } }
                                    ],
                                },
                                {
                                    OR: [
                                        { lastName: { contains: (_c = query.name) === null || _c === void 0 ? void 0 : _c.split(' ')[0] } },
                                        { lastName: { contains: (_d = query.name) === null || _d === void 0 ? void 0 : _d.split(' ')[1] } }
                                    ]
                                }
                            ]
                        }
                        : {})), (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.isOnline)
                        ? {
                            id: {
                                in: (_e = global.onlineUsers) === null || _e === void 0 ? void 0 : _e.map(function (item) { return item.userId != undefined ? item.userId : -1; })
                            }
                        } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.languages) && !(0, primitive_checks_1.isEmptyArray)(query === null || query === void 0 ? void 0 : query.languages)
                        ? {
                            languages: {
                                some: {
                                    name: {
                                        in: query === null || query === void 0 ? void 0 : query.languages
                                    }
                                }
                            }
                        }
                        : {})), (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.gender)
                        ? {
                            sex: {
                                equals: query.sex
                            }
                        } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.countries) && !(0, primitive_checks_1.isEmptyArray)(query === null || query === void 0 ? void 0 : query.countries)
                        ? {
                            country: {
                                name: {
                                    in: query.countries
                                }
                            }
                        } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(query === null || query === void 0 ? void 0 : query.tripTo)
                        ? {
                            trips: {
                                some: {
                                    destinations: {
                                        some: {
                                            name: {
                                                in: query === null || query === void 0 ? void 0 : query.tripTo
                                            }
                                        }
                                    }
                                }
                            }
                        } : {})),
                    select: {
                        followedBy: {
                            select: {
                                id: true
                            }
                        },
                        following: {
                            select: {
                                id: true
                            }
                        },
                        favoritedArticle: {
                            select: {
                                id: true
                            }
                        },
                        picture: {
                            select: {
                                image: true
                            }
                        },
                        role: {
                            select: {
                                role: true
                            }
                        },
                        trips: {
                            select: {
                                destinations: true
                            }
                        },
                        articles: {
                            select: {
                                countries: true
                            }
                        },
                        firstName: true,
                        lastName: true,
                        id: true,
                        birthday: true,
                        activatedStatus: true,
                        rating: true,
                        country: {
                            select: {
                                name: true
                            }
                        }
                    },
                })];
            case 1:
                users = _f.sent();
                if (!(0, primitive_checks_1.isNullOrUndefined)(query.age)) {
                    ageMinMax_1 = query.age.split('-');
                    return [2 /*return*/, users
                            .filter(function (item) {
                            return Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) > Number(ageMinMax_1[0]) &&
                                Math.floor((new Date().getTime() - new Date(item.birthday).getTime()) / (1000 * 60 * 60 * 24 * 365)) < Number(ageMinMax_1[1]);
                        })];
                }
                return [2 /*return*/, users];
        }
    });
}); };
exports.fullSearchUsers = fullSearchUsers;
var getAllFavoriteItems = function (favoriteType, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var articleSelector, tripSelector, userSelector;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                articleSelector = {
                    favoritedArticle: {
                        include: {
                            tagList: {
                                select: {
                                    name: true
                                }
                            },
                            favoritedBy: {
                                select: {
                                    id: true
                                }
                            },
                            author: true,
                        }
                    },
                };
                tripSelector = {
                    tripFavoritedBy: {
                        include: {
                            tripFavoritedBy: true,
                            destinations: true,
                            gender: true,
                            languages: true,
                            user: true
                        }
                    },
                };
                userSelector = {
                    followedBy: true,
                    following: true,
                };
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            id: Number(userId)
                        },
                        select: __assign({ firstName: true, lastName: true }, (favoriteType == 'users'
                            ? userSelector
                            : favoriteType == 'articles'
                                ? articleSelector
                                : favoriteType == 'trips'
                                    ? tripSelector
                                    : __assign(__assign(__assign({}, userSelector), articleSelector), tripSelector)))
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getAllFavoriteItems = getAllFavoriteItems;
var admin_users = function (_a) {
    var sortBy = _a.sortBy, order = _a.order, search = _a.search, limit = _a.limit, page = _a.page;
    return __awaiter(void 0, void 0, void 0, function () {
        var activePage, count, users;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    activePage = (Number(page) - 1) * limit || 0;
                    console.log({
                        sortBy: sortBy,
                        order: order,
                        search: search,
                        limit: limit,
                        page: page
                    });
                    return [4 /*yield*/, PrismaClient_1.default.user.count()];
                case 1:
                    count = _d.sent();
                    return [4 /*yield*/, PrismaClient_1.default.user.findMany(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, (search !== '' && search !== undefined
                            ? {
                                where: {
                                    OR: [
                                        {
                                            email: {
                                                contains: search
                                            }
                                        },
                                        {
                                            OR: [
                                                {
                                                    firstName: {
                                                        contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                                                    }
                                                },
                                                {
                                                    firstName: {
                                                        contains: (_b = search === null || search === void 0 ? void 0 : search.split(' ')[1]) !== null && _b !== void 0 ? _b : search === null || search === void 0 ? void 0 : search.split(' ')[0]
                                                    }
                                                }
                                            ],
                                        },
                                        {
                                            OR: [
                                                {
                                                    lastName: {
                                                        contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                                                    }
                                                },
                                                {
                                                    lastName: {
                                                        contains: (_c = search === null || search === void 0 ? void 0 : search.split(' ')[1]) !== null && _c !== void 0 ? _c : search === null || search === void 0 ? void 0 : search.split(' ')[0]
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                            }
                            : {})), { select: {
                                id: true,
                                email: true,
                                picture: {
                                    select: {
                                        image: true
                                    }
                                },
                                role: {
                                    select: {
                                        role: true
                                    }
                                },
                                firstName: true,
                                lastName: true,
                                activatedStatus: true,
                                rating: true,
                            } }), (sortBy == 'email' && order != 'none' ? { orderBy: { email: order } } : {})), (sortBy == 'name' && order != 'none' ? { orderBy: { firstName: order } } : {})), (sortBy == 'id' && order != 'none' ? { orderBy: { id: order } } : {})), (sortBy == 'rating' && order != 'none' ? { orderBy: { rating: order } } : {})), { skip: activePage, take: Number(limit) }))];
                case 2:
                    users = _d.sent();
                    return [2 /*return*/, {
                            users: users.map(function (user) { return ({
                                id: user.id,
                                name: user.firstName,
                                email: user.email,
                                rating: user.rating,
                                role: user.role,
                                activatedStatus: user.activatedStatus
                            }); }),
                            count: count
                        }];
            }
        });
    });
};
exports.admin_users = admin_users;
//#############################################################################3
//#############################################################################3
//RAU
//#############################################################################3
//#############################################################################3
var addNewProfileVisit = function (userId, profileId) { return __awaiter(void 0, void 0, void 0, function () {
    var profileView;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.profileViews.upsert({
                    where: {
                        guestId_userId: {
                            userId: Number(profileId),
                            guestId: Number(userId)
                        }
                    },
                    create: {
                        guestId: Number(userId),
                        userId: Number(profileId)
                    },
                    update: {
                        createdAt: new Date(),
                        guestId: Number(userId),
                        userId: Number(profileId),
                        seen: false
                    }
                })];
            case 1:
                profileView = _a.sent();
                return [2 /*return*/, profileView];
        }
    });
}); };
exports.addNewProfileVisit = addNewProfileVisit;
//# sourceMappingURL=user.service.js.map