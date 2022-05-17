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
exports.updateUser = exports.resetPassword = exports.forgotPassword = exports.switchRole = exports.login = exports.getCurrentUser = exports.createUser = exports.ROLE = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var api_error_1 = __importDefault(require("../utils/api-error"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var client_1 = require("@prisma/client");
var token_service_1 = require("./token.service");
var graceful_fs_1 = __importDefault(require("graceful-fs"));
var path_1 = __importDefault(require("path"));
var nanoid_1 = require("nanoid");
var emailTemplates_1 = require("../utils/emailTemplates");
var nodemailer_1 = require("../utils/nodemailer");
var enums_1 = require("../types/enums");
var primitive_checks_1 = require("../utils/primitive-checks");
var user_validator_1 = require("../validators/user.validator");
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "USER";
    ROLE["ADMIN"] = "ADMIN";
})(ROLE = exports.ROLE || (exports.ROLE = {}));
var createUser = function (input, profileImage) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, hashedPassword, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = {
                    email: input.email.trim(),
                    firstName: input.firstName.trim(),
                    lastName: input.lastName.trim(),
                    password: input.password.trim(),
                    country: input.country.trim(),
                    birthday: input.birthday,
                    gender: input.gender,
                    languages: input.languages,
                    relationshipStatus: input.relationshipStatus,
                };
                Object.entries(payload).forEach(function (entry) {
                    if (!entry[1])
                        throw new api_error_1.default(422, { message: entry[0].toUpperCase() + ' can\'t be blank' });
                });
                if (!(payload.relationshipStatus in enums_1.RelationshipStatusEnum)) {
                    throw new api_error_1.default(422, { message: 'Wrong relationship status!' });
                }
                return [4 /*yield*/, checkUserUniquenessByEmail(payload.email)];
            case 1:
                _a.sent();
                return [4 /*yield*/, bcryptjs_1.default.hash(payload.password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.user.create({
                        data: __assign(__assign({ firstName: payload.firstName, lastName: payload.lastName, email: payload.email, password: hashedPassword, gender: {
                                connect: {
                                    gender: payload.gender
                                }
                            }, birthday: new Date(payload.birthday).toISOString(), relationshipStatus: {
                                connect: {
                                    status: payload.relationshipStatus
                                }
                            } }, (!(0, primitive_checks_1.isNullOrUndefined)(profileImage) && !(0, primitive_checks_1.isEmptyObject)(profileImage)
                            ? {
                                picture: {
                                    connectOrCreate: {
                                        where: {
                                            image: profileImage === null || profileImage === void 0 ? void 0 : profileImage.filename
                                        },
                                        create: {
                                            image: profileImage === null || profileImage === void 0 ? void 0 : profileImage.filename
                                        }
                                    }
                                },
                                images: {
                                    connectOrCreate: {
                                        where: {
                                            image: profileImage === null || profileImage === void 0 ? void 0 : profileImage.filename
                                        },
                                        create: {
                                            image: profileImage === null || profileImage === void 0 ? void 0 : profileImage.filename
                                        }
                                    }
                                },
                            } : {})), { role: {
                                connect: {
                                    role: enums_1.RoleEnum.USER
                                }
                            }, languages: {
                                connect: payload.languages.map(function (item) { return ({ name: item }); }),
                            }, country: {
                                connect: {
                                    code: payload.country
                                },
                            } }),
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
                user = _a.sent();
                return [4 /*yield*/, (0, token_service_1.saveToken)(user.id, (0, token_service_1.generateTokens)(user).refreshToken)];
            case 4:
                _a.sent();
                return [2 /*return*/, {
                        id: user.id,
                        role: user.role.role,
                        accessToken: (0, token_service_1.generateTokens)(user).accessToken,
                        refreshToken: (0, token_service_1.generateTokens)(user).refreshToken,
                    }];
        }
    });
}); };
exports.createUser = createUser;
var getCurrentUser = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findFirst({
                    where: {
                        id: Number(userId)
                    },
                    include: {
                        role: {
                            select: {
                                role: true
                            }
                        },
                        picture: true,
                        country: true,
                        languages: true,
                        gender: {
                            select: {
                                gender: true
                            }
                        },
                        chats: {
                            select: { id: true }
                        }
                    }
                })];
            case 1:
                user = _a.sent();
                return [2 /*return*/, __assign(__assign({}, user), { role: user === null || user === void 0 ? void 0 : user.role.role, accessToken: (0, token_service_1.generateTokens)(user).accessToken, refreshToken: (0, token_service_1.generateTokens)(user).refreshToken })];
        }
    });
}); };
exports.getCurrentUser = getCurrentUser;
var checkUserUniquenessByEmail = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUserByEmail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                    where: {
                        email: email
                    },
                    select: {
                        id: true
                    },
                })];
            case 1:
                existingUserByEmail = _a.sent();
                if (!(0, primitive_checks_1.isNullOrUndefined)(existingUserByEmail)) {
                    throw new api_error_1.default(422, { message: 'Email has already been taken!' });
                }
                return [2 /*return*/];
        }
    });
}); };
var login = function (userPayload) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, user, match;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = {
                    email: userPayload.email.trim(),
                    password: userPayload.password.trim(),
                };
                Object.entries(payload).forEach(function (entry) {
                    if (!entry[1])
                        throw new api_error_1.default(422, { message: entry[0].toUpperCase() + ' can\'t be blank' });
                });
                (0, user_validator_1.mailValidator)(payload.email);
                (0, user_validator_1.passwordValidator)(payload.password);
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            email: payload.email
                        },
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            password: true,
                            picture: true,
                            blockExpiration: true,
                            activatedStatus: true,
                            role: {
                                select: {
                                    role: true
                                }
                            }
                        },
                    })];
            case 1:
                user = _a.sent();
                if (!!(0, primitive_checks_1.isNullOrUndefined)(user)) return [3 /*break*/, 6];
                if ((user === null || user === void 0 ? void 0 : user.activatedStatus.toString()) == enums_1.ACTIVATED_STATUS_ENUM.BLOCKED && new Date() < new Date(user === null || user === void 0 ? void 0 : user.blockExpiration)) {
                    throw new api_error_1.default(422, { message: 'Account is blocked!' });
                }
                if (!((user === null || user === void 0 ? void 0 : user.activatedStatus) == enums_1.ACTIVATED_STATUS_ENUM.BLOCKED)) return [3 /*break*/, 3];
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: { id: user.id },
                        data: {
                            activatedStatus: enums_1.ACTIVATED_STATUS_ENUM.ACTIVATED.toString(),
                            blockExpiration: null
                        }
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [4 /*yield*/, bcryptjs_1.default.compare(payload.password, user.password)];
            case 4:
                match = _a.sent();
                return [4 /*yield*/, (0, token_service_1.saveToken)(user.id, (0, token_service_1.generateTokens)(user).refreshToken)];
            case 5:
                _a.sent();
                if (match) {
                    return [2 /*return*/, {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role.role,
                            picture: user.picture,
                            accessToken: (0, token_service_1.generateTokens)(user).accessToken,
                            refreshToken: (0, token_service_1.generateTokens)(user).refreshToken,
                        }];
                }
                _a.label = 6;
            case 6: throw new api_error_1.default(403, { message: 'Email or Password is invalid' });
        }
    });
}); };
exports.login = login;
var switchRole = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var userDb;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                    where: {
                        id: Number(userId)
                    },
                    select: {
                        role: {
                            select: {
                                role: true
                            }
                        }
                    }
                })];
            case 1:
                userDb = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: {
                            id: Number(userId)
                        },
                        data: {
                            role: {
                                connect: {
                                    role: userDb.role.role == ROLE.USER ? ROLE.ADMIN : ROLE.USER
                                }
                            }
                        },
                        include: {
                            picture: true,
                            role: {
                                select: {
                                    role: true
                                }
                            }
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.switchRole = switchRole;
var forgotPassword = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var user, resetToken, resetUrl, message, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, user_validator_1.mailValidator)(email);
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            email: email
                        },
                        select: {
                            email: true,
                            id: true
                        }
                    })];
            case 1:
                user = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(user)) {
                    throw new api_error_1.default(404, { message: 'No email could not be send' });
                }
                resetToken = (0, nanoid_1.nanoid)();
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            resetPasswordToken: resetToken,
                            resetPasswordExpire: new Date(Date.now() + 10 * (60 * 1000))
                        }
                    })];
            case 2:
                _a.sent();
                resetUrl = "".concat(process.env.URL, "auth/reset-password/").concat(resetToken);
                message = (0, emailTemplates_1.forgotMessage)(resetUrl, user);
                result = (0, nodemailer_1.sendEmail)({
                    to: user.email,
                    subject: 'Password Reset Request',
                    text: message,
                });
                return [4 /*yield*/, result];
            case 3:
                if (_a.sent())
                    return [2 /*return*/, user];
                return [2 /*return*/, null];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (password, resetToken) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, user_validator_1.passwordValidator)(password);
                if (!resetToken) {
                    throw new api_error_1.default(400, { message: 'Invalid Request' });
                }
                return [4 /*yield*/, PrismaClient_1.default.user.findFirst({
                        where: {
                            AND: [
                                {
                                    resetPasswordToken: resetToken
                                },
                                {
                                    resetPasswordExpire: {
                                        gt: new Date(Date.now())
                                    }
                                }
                            ]
                        },
                        select: {
                            id: true,
                            email: true
                        }
                    })];
            case 1:
                user = _a.sent();
                if (primitive_checks_1.isNullOrUndefined) {
                    throw new api_error_1.default(400, { message: 'Invalid Token or expired' });
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: {
                            id: user.id,
                        },
                        data: {
                            password: hashedPassword,
                            resetPasswordToken: null,
                            resetPasswordExpire: null,
                        }
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
exports.resetPassword = resetPassword;
// export const findUserIdByName = async (name: string): Promise<number> => {
//   const user = await prisma.user.findUnique({
//     where: {name},
//     select: {id: true},
//   });
//
//   if (!user)
//     throw new ApiError(404, {message: 'User not found!'});
//
//   return user.id;
// };
//################################################################################################
//################################################################################################
//RAU
//################################################################################################
//################################################################################################
var updateUser = function (userPayload, id, file) { return __awaiter(void 0, void 0, void 0, function () {
    var email, name, password, oldPassword, country, date, languages, gender, oldImages, profileImage, isUserUpdateImages, isUserUpdateMapCountries, interestedInCountries, visitedCountries, dbUser, imagesToRemove_1, _loop_1, i, i, userInfo, user, _a, _b, _c, _d;
    var _e, _f;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                email = userPayload.email, name = userPayload.name, password = userPayload.password, oldPassword = userPayload.oldPassword, country = userPayload.country, date = userPayload.date, languages = userPayload.languages, gender = userPayload.gender, oldImages = userPayload.oldImages, profileImage = userPayload.profileImage, isUserUpdateImages = userPayload.isUserUpdateImages, isUserUpdateMapCountries = userPayload.isUserUpdateMapCountries, interestedInCountries = userPayload.interestedInCountries, visitedCountries = userPayload.visitedCountries;
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            id: Number(id),
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
                dbUser = _h.sent();
                console.log(oldImages);
                console.log(file);
                console.log(profileImage);
                console.log(isUserUpdateImages);
                if (!isUserUpdateMapCountries) return [3 /*break*/, 3];
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: { id: Number(id) },
                        data: __assign(__assign({}, (interestedInCountries
                            ? { interestedInCountries: { set: [] } }
                            : {})), (visitedCountries
                            ? { visitedCountries: { set: [] } }
                            : {}))
                    })];
            case 2:
                _h.sent();
                _h.label = 3;
            case 3:
                if (!(isUserUpdateImages && (oldImages === null || oldImages === void 0 ? void 0 : oldImages.length) != 0)) return [3 /*break*/, 7];
                imagesToRemove_1 = [];
                if (dbUser)
                    imagesToRemove_1 = (_g = dbUser === null || dbUser === void 0 ? void 0 : dbUser.images) === null || _g === void 0 ? void 0 : _g.filter(function (item) { return !(oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(item.image)); });
                if (imagesToRemove_1[0] != undefined) {
                    _loop_1 = function (i) {
                        graceful_fs_1.default.stat(path_1.default.resolve(__dirname, '..', 'uploads', imagesToRemove_1[i].image), function (err, stats) {
                            if (err)
                                return console.error(err);
                            graceful_fs_1.default.unlink(path_1.default.resolve(__dirname, '..', 'uploads', imagesToRemove_1[i].image), function (err) {
                                if (err)
                                    return console.log(err);
                                console.log('File deleted successfully!');
                            });
                        });
                    };
                    for (i = 0; i < imagesToRemove_1.length; i++) {
                        _loop_1(i);
                    }
                }
                i = 0;
                _h.label = 4;
            case 4:
                if (!(i < imagesToRemove_1.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, PrismaClient_1.default.userImage.delete({
                        where: {
                            image: imagesToRemove_1[i].image,
                        },
                    })];
            case 5:
                _h.sent();
                _h.label = 6;
            case 6:
                i++;
                return [3 /*break*/, 4];
            case 7:
                if (password && password.length < 3) {
                    throw new api_error_1.default(404, { message: 'Invalid password!' });
                }
                if (oldPassword && oldPassword.length < 3) {
                    throw new api_error_1.default(404, { message: 'Invalid password!' });
                }
                if (!oldPassword) return [3 /*break*/, 9];
                return [4 /*yield*/, PrismaClient_1.default.user.findUnique({
                        where: {
                            id: Number(id),
                        },
                        select: {
                            password: true,
                        },
                    })];
            case 8:
                userInfo = _h.sent();
                if (!bcryptjs_1.default.compareSync(oldPassword, userInfo.password))
                    throw new api_error_1.default(404, { message: 'The old password is incorrect!' });
                _h.label = 9;
            case 9:
                if (!(languages && languages.length != 0)) return [3 /*break*/, 11];
                return [4 /*yield*/, PrismaClient_1.default.user.update({
                        where: { id: Number(id) },
                        data: { languages: { set: [] } },
                    })];
            case 10:
                _h.sent();
                _h.label = 11;
            case 11:
                _b = (_a = PrismaClient_1.default.user).update;
                _e = {
                    where: { id: Number(id) }
                };
                _c = [__assign(__assign(__assign(__assign({}, (interestedInCountries
                        ? {
                            interestedInCountries: {
                                connect: interestedInCountries.map(function (item) { return ({
                                    code: item
                                }); })
                            },
                        }
                        : {})), (visitedCountries
                        ? {
                            visitedCountries: {
                                connect: visitedCountries.map(function (item) { return ({
                                    code: item,
                                }); })
                            }
                        }
                        : {})), (email != undefined ? { email: email } : {})), (name != undefined ? { name: name } : {}))];
                if (!password) return [3 /*break*/, 13];
                _f = {};
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 12:
                _d = (_f.password = _h.sent(), _f);
                return [3 /*break*/, 14];
            case 13:
                _d = {};
                _h.label = 14;
            case 14: return [4 /*yield*/, _b.apply(_a, [(_e.data = __assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, [__assign.apply(void 0, _c.concat([(_d)])), (gender != undefined ? { gender: gender } : {})]), (date != undefined ? { birthday: new Date(date).toISOString() } : {})]), (Boolean(isUserUpdateImages)
                                        ? (profileImage != 'null' && profileImage != null && oldImages && (oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(profileImage))
                                            ? { picture: profileImage }
                                            : { picture: 'null' })
                                        : {})]), ((file === null || file === void 0 ? void 0 : file.length) != 0 ? {
                                    images: {
                                        create: file === null || file === void 0 ? void 0 : file.map(function (imageName) { return ({ image: imageName.filename }); }),
                                    },
                                } : {})]), (country != undefined ? {
                                country: {
                                    connect: { name: country },
                                },
                            } : {})]), (languages && languages.length != 0 ? {
                            languages: {
                                connectOrCreate: languages.map(function (item) { return ({ create: { name: item }, where: { name: item } }); }),
                            },
                        } : {})]),
                        _e.select = client_1.Prisma.validator()({
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
                        _e)])];
            case 15:
                user = _h.sent();
                return [2 /*return*/, __assign(__assign({}, user), { role: user.role.role, accessToken: (0, token_service_1.generateTokens)(user).accessToken, refreshToken: (0, token_service_1.generateTokens)(user).refreshToken })];
        }
    });
}); };
exports.updateUser = updateUser;
//# sourceMappingURL=auth.service.js.map