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
var auth_middleware_1 = require("../middlewares/auth.middleware");
var user_service_1 = require("../services/user.service");
var asyncHandler_1 = require("../utils/asyncHandler");
var auth_service_1 = require("../services/auth.service");
var upload = require("../middlewares/fileUpload.middleware");
var router = (0, express_1.Router)();
router.get('/user/all-favorites/:type', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.getAllFavoriteItems)((_a = req.params) === null || _a === void 0 ? void 0 : _a.type, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                user = _c.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/admin/users', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.admin_users)(req === null || req === void 0 ? void 0 : req.query)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get user profile views
 * @auth required
 * @route {GET} /users/profile-visits
 * @queryparam search
 * @returns search users
 */
router.get('/user/profile-visits', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.getProfileViews)(req.user.id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Block user
 * @auth required
 * @route {PUT} /user/:id/block
 * @queryparam search
 * @returns search users
 */
router.put('/user/:id/block', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.blockUserProfile)(req.params.id, req.body.expiredBlockDate)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Check profile views
 * @auth required
 * @route {PUT} /users/profile-visits
 * @returns ProfileViews
 */
router.put('/user/profile-visits', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var profileViews;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.checkUserProfileViews)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                profileViews = _b.sent();
                res.json(profileViews);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Add interested or visited countries
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/selected-countries', auth_middleware_1.authM.required, (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.addInterestedVisitedCountries)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, req.body)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Activate user account
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/:id/activate', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.activateUserProfile)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update user images
 * @auth required
 * @route {PUT} /user/selected-countries
 * @returns User
 */
router.put('/user/images', [auth_middleware_1.authM.required, upload.array("images[]")], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.updateUserImages)(req === null || req === void 0 ? void 0 : req.user.id, req.body, req.files)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update user general info
 * @auth required
 * @route {PUT} /users/general-info
 * @returns User
 */
router.put('/user/general-info', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.updateUserGeneralInfo)(req === null || req === void 0 ? void 0 : req.user.id, req.body)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update user personal info
 * @auth required
 * @route {PUT} /users/personal-info
 * @returns User
 */
router.put('/user/personal-info', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.updateUserPersonalInfo)(req === null || req === void 0 ? void 0 : req.user.id, req.body)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update user visited or interested country
 * @auth required
 * @route {PUT} /users/map
 * @returns User
 */
router.put('/user/map', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, (0, user_service_1.updateUserMap)(req === null || req === void 0 ? void 0 : req.user.id, req.body)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Add new profile visit
 * @auth required
 * @route {PUT} /users/map
 * @returns User
 */
router.put('/user/profile-visits/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.createProfileView)(req.user.id, req.params.id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get user by id
 * @auth required
 * @route {GET} /users
 * @queryparam search
 * @returns search users
 */
router.get('/user/:id', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.getUserById)((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Switch user role
 * @auth required
 * @route {PUT} /user/:id/switch-role
 * @params user ID,
 * @returns User
 */
router.put('/user/:id/switch-role', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, auth_service_1.switchRole)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                user = _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get users
 * @auth required
 * @route {GET} /users
 * @queryparams
 * @returns User
 */
router.get('/users', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.fullSearchUsers)(req === null || req === void 0 ? void 0 : req.query)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// RAU
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
/**
 * Search users
 * @auth required
 * @route {GET} /users
 * @queryparam search
 * @returns search users
 */
router.get('/users/llllllllllllllll', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, user_service_1.getUsersByNameOrEmail)((_a = req.query) === null || _a === void 0 ? void 0 : _a.searchField)];
            case 1:
                users = _b.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); }));
//# sourceMappingURL=user.controller.js.map