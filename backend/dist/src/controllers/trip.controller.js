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
var express_1 = require("express");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var asyncHandler_1 = require("../utils/asyncHandler");
var trip_service_1 = require("../services/trip.service");
var router = (0, express_1.Router)();
/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.get('/admin/trips', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trips;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.filtering)(req.query)];
            case 1:
                trips = _a.sent();
                res.json(trips);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Favorite trip
 * @auth required
 * @route {PUT} /trips/:id/favorite
 * @param ID of trip
 * @returns Trip
 */
router.put('/trip/:id/favorite', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.addTripToFavorite)(req.user.id, req.params.id)];
            case 1:
                trip = _a.sent();
                res.json({ trip: trip });
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Remove a trip from favorite
 * @auth required
 * @route {DELETE} /trips/:id/favorite
 * @param ID of trip
 * @returns Trip
 */
router.delete('/trip/:id/favorite', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.removeTripFromFavorite)(req.user.id, req.params.id)];
            case 1:
                trip = _a.sent();
                res.json({ trip: trip });
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Create trip comment
 * @auth required
 * @route {POST} /trips/:id/comment
 * @param ID of trip
 * @returns Trip
 */
router.post('/trip/:id/comment', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.addCommentToTrip)(req.user.id, req.params.id, req.body.comment)];
            case 1:
                comment = _a.sent();
                res.json(comment);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Delete comment to trip
 * @auth required
 * @route {DELETE} /trips/:id/comment
 * @param ID of trip
 * @returns Trip
 */
router.delete('/trip/:id/comment', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.removeCommentToTrip)(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                comment = _b.sent();
                res.json(comment).sendStatus(204);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Join to trip
 * @auth required
 * @route {POST} /trips/:id/join
 * @returns Trip
 */
router.post('/trip/:id/join', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.joinToTrip)(req === null || req === void 0 ? void 0 : req.body, req.params.id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Leave from trip
 * @auth required
 * @route {DELETE} /trips/:id/join
 * @returns Trip
 */
router.delete('/trip/:id/join', auth_middleware_1.authM.required, (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userJoinToTrip;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.leaveFromTrip)((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id, req.params.id)];
            case 1:
                userJoinToTrip = _b.sent();
                res.json(userJoinToTrip);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Create trip
 * @auth required
 * @route {POST} /trips
 * @returns Trip
 */
router.post('/trip', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.createTrip)(req.user.id, req.body)];
            case 1:
                trip = _a.sent();
                res.json(trip);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.get('/trips', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trips;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.getTrips)(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.role)];
            case 1:
                trips = _c.sent();
                res.json(trips);
                return [2 /*return*/];
        }
    });
}); }));
router.put('/trip/joinRequest/:id/changeStatus', [auth_middleware_1.authM.required], function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userJoinning, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.update({
                        where: {
                            id: Number((_a = req.body) === null || _a === void 0 ? void 0 : _a.tripRequestId)
                        },
                        data: {
                            status: req.body.status
                        },
                        include: {
                            user: true,
                            trip: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    })];
            case 1:
                userJoinning = _b.sent();
                res.json(userJoinning);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.log(error_1);
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/trips/requests', [auth_middleware_1.authM.required], function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userJoinning, userJoinning, error_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                if (!(((_a = req.query) === null || _a === void 0 ? void 0 : _a.status) == 'ALL')) return [3 /*break*/, 2];
                return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.groupBy({
                        by: ['status'],
                        where: {
                            OR: [
                                {
                                    trip: {
                                        user: {
                                            id: Number(req.user.id)
                                        }
                                    }
                                },
                                {
                                    status: 'RECEIVED',
                                    userId: Number(req.user.id)
                                }
                            ]
                        },
                        _count: true
                    })];
            case 1:
                userJoinning = _d.sent();
                res.json(userJoinning);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.findMany({
                    where: {
                        OR: [
                            {
                                status: {
                                    in: (_b = req.query) === null || _b === void 0 ? void 0 : _b.status
                                },
                                trip: {
                                    user: {
                                        id: Number(req.user.id)
                                    }
                                }
                            },
                            {
                                status: {
                                    in: (_c = req.query) === null || _c === void 0 ? void 0 : _c.status
                                },
                                userId: Number(req.user.id)
                            }
                        ]
                    },
                    include: {
                        user: true,
                        trip: {
                            include: {
                                user: true
                            }
                        }
                    }
                })];
            case 3:
                userJoinning = _d.sent();
                res.json(userJoinning);
                _d.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_2 = _d.sent();
                console.log(error_2);
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/**
 * Get one trip
 * @auth required
 * @route {GET} /trips/:id
 * @returns Trip
 */
router.get('/trip-one/:id', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('MIIIIIIIIIIIIIISA');
                return [4 /*yield*/, (0, trip_service_1.getOneTrip)(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                trip = _b.sent();
                res.json(trip);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update trip
 * @auth required
 * @route {PUT} /trips/:id
 * @returns Trip
 */
router.put('/trip/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.updateTrip)(req.user.id, req.params.id, req === null || req === void 0 ? void 0 : req.body)];
            case 1:
                trip = _a.sent();
                res.json(trip);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Delete trip
 * @auth required
 * @route {DELETE} /trips/:id
 * @returns Trip
 */
router.delete('/trip/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.deleteTrip)(req.params.id, req.user.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.role)];
            case 1:
                trip = _b.sent();
                res.json(trip);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get all trips
 * @auth required
 * @route {GET} /trips
 * @returns Trips
 */
router.put('/trip/:id/hide', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var trips;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, trip_service_1.switchTripHideStatus)(req.params.id, req.user.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.role)];
            case 1:
                trips = _b.sent();
                res.json(trips);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=trip.controller.js.map