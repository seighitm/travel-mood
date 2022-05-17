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
exports.switchTripHideStatus = exports.getUsersQuery = exports.filtering = exports.deleteTrip = exports.getOneTrip = exports.updateTrip = exports.getTrips = exports.createTrip = exports.leaveFromTrip = exports.joinToTrip = exports.removeCommentToTrip = exports.addCommentToTrip = exports.removeTripFromFavorite = exports.addTripToFavorite = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var api_error_1 = __importDefault(require("../utils/api-error"));
var primitive_checks_1 = require("../utils/primitive-checks");
var trip_validators_1 = require("../validators/trip.validators");
var auth_service_1 = require("./auth.service");
var getTripById = function (tripId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.trip.findUnique({
                    where: {
                        id: Number(tripId)
                    },
                    select: {
                        id: true,
                        isHidden: true,
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var getCommentById = function (commentId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.tripComment.findUnique({
                    where: {
                        id: Number(commentId)
                    },
                    select: {
                        id: true,
                        userId: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var addTripToFavorite = function (userId, tripId) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTripById(tripId)];
            case 1:
                trip = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(trip)) {
                    throw new api_error_1.default(422, { message: "Trip not found!" });
                }
                return [4 /*yield*/, PrismaClient_1.default.trip.update({
                        where: {
                            id: Number(tripId),
                        },
                        data: {
                            tripFavoritedBy: {
                                connect: {
                                    id: Number(userId)
                                }
                            },
                        },
                        select: {
                            id: true,
                            tripFavoritedBy: true
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addTripToFavorite = addTripToFavorite;
var removeTripFromFavorite = function (userId, tripId) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTripById(tripId)];
            case 1:
                trip = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(trip)) {
                    throw new api_error_1.default(422, { message: "Trip not found!" });
                }
                return [4 /*yield*/, PrismaClient_1.default.trip.update({
                        where: {
                            id: Number(tripId),
                        },
                        data: {
                            tripFavoritedBy: {
                                disconnect: {
                                    id: Number(userId)
                                }
                            }
                        },
                        select: {
                            id: true,
                            tripFavoritedBy: true
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.removeTripFromFavorite = removeTripFromFavorite;
var addCommentToTrip = function (userId, tripId, bodyOfComment) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTripById(tripId)];
            case 1:
                trip = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(trip)) {
                    throw new api_error_1.default(422, { message: "Trip not found!" });
                }
                return [4 /*yield*/, PrismaClient_1.default.tripComment.create({
                        data: {
                            user: {
                                connect: {
                                    id: Number(userId),
                                }
                            },
                            Trip: {
                                connect: {
                                    id: Number(tripId)
                                }
                            },
                            comment: bodyOfComment
                        },
                        select: {
                            id: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    picture: true,
                                    gender: true
                                }
                            },
                            comment: true,
                            tripId: true,
                            createdAt: true,
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addCommentToTrip = addCommentToTrip;
var removeCommentToTrip = function (commentId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCommentById(commentId)];
            case 1:
                comment = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(comment)) {
                    throw new api_error_1.default(422, { message: "Comment not found!" });
                }
                else if (comment.userId != userId) {
                    throw new api_error_1.default(404, { message: "You are not the author of the comment!" });
                }
                return [4 /*yield*/, PrismaClient_1.default.tripComment.delete({
                        where: {
                            id: Number(commentId)
                        },
                        select: {
                            id: true
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.removeCommentToTrip = removeCommentToTrip;
var joinToTrip = function (_a, tripId) {
    var userId = _a.userId, comment = _a.comment, receiveUserId = _a.receiveUserId;
    return __awaiter(void 0, void 0, void 0, function () {
        var userJoinToTrip, userJoinToTrip;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!(0, primitive_checks_1.isNullOrUndefined)(receiveUserId)) return [3 /*break*/, 2];
                    return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.upsert({
                            where: {
                                userId_tripId: {
                                    userId: Number(receiveUserId),
                                    tripId: Number(tripId)
                                }
                            },
                            update: {
                                status: "RECEIVED"
                            },
                            create: {
                                user: {
                                    connect: {
                                        id: Number(receiveUserId)
                                    }
                                },
                                trip: {
                                    connect: {
                                        id: Number(tripId)
                                    }
                                },
                                status: "RECEIVED"
                            },
                            select: {
                                id: true,
                                status: true,
                                user: {
                                    select: {
                                        id: true
                                    }
                                },
                                trip: {
                                    select: {
                                        id: true
                                    }
                                }
                            }
                        })];
                case 1:
                    userJoinToTrip = _b.sent();
                    return [2 /*return*/, __assign(__assign({}, userJoinToTrip), { receiveUserId: receiveUserId })];
                case 2: return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.upsert({
                        where: {
                            userId_tripId: {
                                userId: Number(userId),
                                tripId: Number(tripId)
                            }
                        },
                        update: {
                            status: "PENDING",
                            comment: comment
                        },
                        create: {
                            user: {
                                connect: { id: Number(userId) }
                            },
                            trip: {
                                connect: { id: Number(tripId) }
                            },
                            comment: comment,
                            // ...(senderId ?
                            //     {
                            //       senderOfInvitation: {
                            //         connect: {
                            //           id: Number(senderId)
                            //         }
                            //       }
                            //     }
                            //     : {}
                            // ),
                        },
                        select: {
                            id: true,
                            status: true,
                            user: {
                                select: {
                                    id: true
                                }
                            },
                            trip: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    })];
                case 3:
                    userJoinToTrip = _b.sent();
                    return [2 /*return*/, userJoinToTrip];
            }
        });
    });
};
exports.joinToTrip = joinToTrip;
var leaveFromTrip = function (userId, tripId) { return __awaiter(void 0, void 0, void 0, function () {
    var userJoinToTrip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.delete({
                    where: {
                        userId_tripId: {
                            userId: Number(userId),
                            tripId: Number(tripId)
                        }
                    },
                    select: {
                        trip: {
                            select: {
                                user: true
                            }
                        },
                        user: {
                            select: {
                                id: true
                            }
                        }
                    }
                })];
            case 1:
                userJoinToTrip = _a.sent();
                return [2 /*return*/, userJoinToTrip];
        }
    });
}); };
exports.leaveFromTrip = leaveFromTrip;
var createTrip = function (userId, _a) {
    var countries = _a.countries, languages = _a.languages, description = _a.description, title = _a.title, date = _a.date, gender = _a.gender, markers = _a.markers, isAnytime = _a.isAnytime, transports = _a.transports, isSplitCost = _a.isSplitCost, itinerary = _a.itinerary, budget = _a.budget;
    return __awaiter(void 0, void 0, void 0, function () {
        var trip;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, trip_validators_1.TripPayloadValidator)({ title: title, description: description, languages: languages, countries: countries });
                    return [4 /*yield*/, PrismaClient_1.default.trip.count({
                            where: {
                                AND: [
                                    {
                                        title: title,
                                    },
                                    {
                                        userId: Number(userId)
                                    }
                                ]
                            }
                        })];
                case 1:
                    trip = _b.sent();
                    if (trip != 0) {
                        throw new api_error_1.default(404, { message: "You have already created a trip with this title!" });
                    }
                    return [4 /*yield*/, PrismaClient_1.default.trip.create({
                            data: __assign(__assign(__assign(__assign({ user: {
                                    connect: {
                                        id: Number(userId)
                                    }
                                }, budget: budget, itinerary: itinerary, gender: {
                                    connect: {
                                        gender: gender
                                    }
                                }, description: description, title: title, splitCosts: isSplitCost, isAnytime: Boolean(isAnytime || date[0] == null) }, ((Boolean(isAnytime) == false && date[0] != null) ? {
                                dateFrom: new Date(date[0]).toISOString(),
                                dateTo: new Date(date[1]).toISOString(),
                            } : {})), (!(0, primitive_checks_1.isNullOrUndefined)(countries) && !(0, primitive_checks_1.isEmptyArray)(countries)
                                ? {
                                    destinations: {
                                        connect: countries.map(function (item) { return ({ code: item.countryCode }); })
                                    }
                                } : [])), { languages: {
                                    connect: languages.map(function (item) { return ({ name: item }); })
                                }, transports: {
                                    connectOrCreate: transports.map(function (item) { return ({ where: { name: item }, create: { name: item } }); })
                                } }), (!(0, primitive_checks_1.isNullOrUndefined)(markers) && !(0, primitive_checks_1.isEmptyArray)(markers)
                                ? {
                                    places: {
                                        connectOrCreate: markers.map(function (item) { return ({
                                            where: {
                                                lat_lon: {
                                                    lon: item === null || item === void 0 ? void 0 : item.place[0].toString(),
                                                    lat: item === null || item === void 0 ? void 0 : item.place[1].toString()
                                                }
                                            },
                                            create: {
                                                lon: item === null || item === void 0 ? void 0 : item.place[0].toString(),
                                                lat: item === null || item === void 0 ? void 0 : item.place[1].toString(),
                                                description: item.description
                                            },
                                        }); }),
                                    },
                                } : [])),
                        })];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
exports.createTrip = createTrip;
var getTrips = function (_a, userId, userRole) {
    var destinations = _a.destinations, budget = _a.budget, date = _a.date, languages = _a.languages, page = _a.page, gender = _a.gender;
    return __awaiter(void 0, void 0, void 0, function () {
        var queries, startDate, endDate, activePage, totalTripsCount, trips;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    queries = [];
                    console.log(destinations);
                    // if(findTrip?.user.id != userId || isNullOrUndefined(userId)){
                    queries.push({
                        isHidden: false
                    });
                    // }
                    if (!(0, primitive_checks_1.isNullOrUndefined)(destinations)) {
                        queries.push({
                            destinations: {
                                some: {
                                    name: {
                                        in: destinations
                                    }
                                }
                            }
                        });
                    }
                    if (!(0, primitive_checks_1.isNullOrUndefined)(languages)) {
                        queries.push({
                            languages: {
                                some: {
                                    name: {
                                        in: languages
                                    }
                                }
                            }
                        });
                    }
                    if (!(0, primitive_checks_1.isNullOrUndefined)(gender)) {
                        queries.push({
                            gender: gender
                        });
                    }
                    if (!(0, primitive_checks_1.isNullOrUndefined)(budget)) {
                        queries.push({
                            budget: {
                                equals: budget
                            }
                        });
                    }
                    if (!(0, primitive_checks_1.isNullOrUndefined)(date) && date.length == 2 && date[0] != 'null') {
                        startDate = new Date(date[0]);
                        // startDate.setDate(startDate.getDate() + 1)
                        startDate.setDate(startDate.getDate());
                        startDate.setHours(0);
                        startDate.setMinutes(0);
                        startDate.setSeconds(0);
                        startDate.setMilliseconds(0);
                        endDate = new Date(date[1]);
                        endDate.setDate(endDate.getDate() - 1);
                        endDate.setHours(23);
                        endDate.setMinutes(59);
                        endDate.setSeconds(59);
                        queries.push({
                            dateTo: {
                                gt: endDate
                            },
                            dateFrom: {
                                lte: startDate
                            }
                        });
                    }
                    activePage = (Number(page) - 1) * 12 || 0;
                    return [4 /*yield*/, PrismaClient_1.default.trip.count()];
                case 1:
                    totalTripsCount = _b.sent();
                    return [4 /*yield*/, PrismaClient_1.default.trip.findMany({
                            where: {
                                AND: queries
                            },
                            include: {
                                gender: {
                                    select: {
                                        gender: true
                                    }
                                },
                                places: {
                                    select: {
                                        id: true,
                                    }
                                },
                                destinations: {
                                    select: {
                                        id: true,
                                        name: true,
                                        code: true
                                    }
                                },
                                transports: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                languages: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                },
                                tripComments: {
                                    select: {
                                        id: true
                                    }
                                },
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        picture: true
                                    }
                                },
                                tripFavoritedBy: {
                                    select: {
                                        id: true,
                                    }
                                }
                            },
                            orderBy: {
                                id: 'desc',
                            },
                            skip: activePage,
                            take: 12,
                        })];
                case 2:
                    trips = _b.sent();
                    console.log(queries);
                    console.log(trips);
                    return [2 /*return*/, {
                            trips: trips,
                            totalTripsCount: totalTripsCount,
                            tripsOnPageCount: trips.length
                        }];
            }
        });
    });
};
exports.getTrips = getTrips;
var disconnectMarkers = function (tripId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.trip.update({
                    where: {
                        id: Number(tripId)
                    },
                    data: {
                        places: {
                            set: []
                        }
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var disconnectCountries = function (tripId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.trip.update({
                    where: {
                        id: Number(tripId)
                    },
                    data: {
                        destinations: {
                            set: []
                        }
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var disconnectLanguages = function (tripId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.trip.update({
                    where: {
                        id: Number(tripId)
                    },
                    data: {
                        languages: {
                            set: []
                        }
                    }
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var removeUnnusedMarkers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var findMarkers, markersToDelete, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.marker.findMany({
                    select: {
                        id: true,
                        trip: {
                            select: {
                                id: true
                            }
                        }
                    },
                })];
            case 1:
                findMarkers = _a.sent();
                markersToDelete = findMarkers.filter(function (item) { var _a; return ((_a = item.trips) === null || _a === void 0 ? void 0 : _a.length) == 0; });
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < markersToDelete.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, PrismaClient_1.default.marker.delete({
                        where: {
                            id: markersToDelete[i].id
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
var updateTrip = function (userId, tripId, _a) {
    var countries = _a.countries, languages = _a.languages, description = _a.description, title = _a.title, date = _a.date, destinations = _a.destinations, gender = _a.gender, markers = _a.markers, isAnytime = _a.isAnytime, transports = _a.transports, isSplitCost = _a.isSplitCost, itinerary = _a.itinerary, budget = _a.budget;
    return __awaiter(void 0, void 0, void 0, function () {
        var newTrip;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, trip_validators_1.TripPayloadValidator)({ title: title, description: description, languages: languages, countries: countries });
                    return [4 /*yield*/, disconnectMarkers(tripId)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, disconnectCountries(tripId)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, disconnectLanguages(tripId)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, PrismaClient_1.default.trip.update({
                            where: {
                                id: Number(tripId),
                            },
                            data: __assign(__assign({ user: {
                                    connect: {
                                        id: Number(userId)
                                    }
                                }, itinerary: itinerary, budget: budget, gender: gender, description: description, title: title, splitCosts: isSplitCost, isAnytime: Boolean(isAnytime || (date === null || date === void 0 ? void 0 : date[0]) == null) }, ((Boolean(isAnytime) == false && date[0] != null) ? {
                                dateFrom: new Date(date[0]).toISOString(),
                                dateTo: new Date(date[1]).toISOString(),
                            } : {
                                dateFrom: null,
                                dateTo: null
                            })), { destinations: {
                                    connect: destinations.map(function (item) { return ({
                                        code: item
                                    }); })
                                }, languages: {
                                    connect: languages.map(function (item) { return ({
                                        name: item
                                    }); })
                                }, transports: {
                                    connectOrCreate: transports.map(function (item) { return ({
                                        create: {
                                            name: item
                                        },
                                        where: {
                                            name: item
                                        }
                                    }); })
                                }, places: {
                                    connectOrCreate: markers.map(function (item) { return ({
                                        where: {
                                            lat_lon: {
                                                lon: item === null || item === void 0 ? void 0 : item.place[0].toString(),
                                                lat: item === null || item === void 0 ? void 0 : item.place[1].toString()
                                            }
                                        },
                                        create: {
                                            lon: item === null || item === void 0 ? void 0 : item.place[0].toString(),
                                            lat: item === null || item === void 0 ? void 0 : item.place[1].toString(),
                                            description: item.description
                                        },
                                    }); }),
                                } }),
                            select: {
                                id: true
                            }
                        })];
                case 4:
                    newTrip = _b.sent();
                    return [4 /*yield*/, removeUnnusedMarkers()];
                case 5:
                    _b.sent();
                    return [2 /*return*/, newTrip];
            }
        });
    });
};
exports.updateTrip = updateTrip;
var getOneTrip = function (tripId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var findTrip, trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(tripId);
                return [4 /*yield*/, getTripById(tripId)];
            case 1:
                findTrip = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.trip.findFirst({
                        where: __assign({ id: Number(tripId) }, ((findTrip === null || findTrip === void 0 ? void 0 : findTrip.user.id) != userId || (0, primitive_checks_1.isNullOrUndefined)(userId))
                            ? { isHidden: false } : {}),
                        include: {
                            places: {
                                select: {
                                    id: true,
                                    lat: true,
                                    lon: true,
                                    description: true
                                }
                            },
                            destinations: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true
                                }
                            },
                            transports: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            languages: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            },
                            tripComments: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            picture: true,
                                            gender: true
                                        }
                                    },
                                },
                                orderBy: {
                                    id: 'desc'
                                }
                            },
                            gender: {
                                select: {
                                    gender: true
                                }
                            },
                            tripFavoritedBy: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            },
                            usersJoinToTrip: true
                        }
                    })];
            case 2:
                trip = _a.sent();
                console.log(trip);
                //
                if (!trip)
                    throw new api_error_1.default(404, { message: "Trip not found!" });
                return [2 /*return*/, trip];
        }
    });
}); };
exports.getOneTrip = getOneTrip;
var deleteTrip = function (tripId, userId, userRole) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTripById(tripId)];
            case 1:
                trip = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(trip))
                    throw new api_error_1.default(404, { message: "Trip not found!" });
                else if (trip.user.id != userId && userRole != auth_service_1.ROLE.ADMIN)
                    throw new api_error_1.default(403, { message: "You are not the author of the trip!" });
                return [4 /*yield*/, PrismaClient_1.default.trip.delete({
                        where: {
                            id: Number(tripId)
                        },
                        select: {
                            id: true
                        }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, trip];
        }
    });
}); };
exports.deleteTrip = deleteTrip;
var filtering = function (_a) {
    var search = _a.search, sortBy = _a.sortBy, order = _a.order, limit = _a.limit, page = _a.page;
    return __awaiter(void 0, void 0, void 0, function () {
        var activePage, totalTripsCount, trips;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    activePage = (Number(page) - 1) * limit || 0;
                    return [4 /*yield*/, PrismaClient_1.default.trip.count({
                            where: {
                                OR: [
                                    {
                                        title: {
                                            contains: search
                                        }
                                    },
                                    (0, exports.getUsersQuery)(search),
                                ]
                            }
                        })];
                case 1:
                    totalTripsCount = _b.sent();
                    return [4 /*yield*/, PrismaClient_1.default.trip.findMany(__assign(__assign(__assign(__assign(__assign(__assign({ where: {
                                OR: [
                                    {
                                        title: {
                                            contains: search
                                        }
                                    },
                                    (0, exports.getUsersQuery)(search),
                                ]
                            }, select: {
                                id: true,
                                title: true,
                                createdAt: true,
                                tripComments: {
                                    select: {
                                        id: true
                                    }
                                },
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        picture: true
                                    }
                                },
                                tripFavoritedBy: {
                                    select: {
                                        id: true,
                                    }
                                },
                            } }, (sortBy == 'date' && order != 'none' ? { orderBy: { createdAt: order } } : {})), (sortBy == 'likes' && order != 'none' ? { orderBy: { tripFavoritedBy: { _count: order } } } : {})), (sortBy == 'comments' && order != 'none' ? { orderBy: { tripComments: { _count: order } } } : {})), (sortBy == 'author' && order != 'none' ? { orderBy: { user: { firstName: order } } } : {})), (sortBy == 'title' && order != 'none' ? { orderBy: { title: order } } : {})), { skip: activePage, take: Number(limit) }))];
                case 2:
                    trips = _b.sent();
                    return [2 /*return*/, {
                            trips: trips.map(function (trip) {
                                var _a, _b, _c;
                                return (__assign(__assign({}, trip), { date: trip.createdAt, author: "".concat((_a = trip === null || trip === void 0 ? void 0 : trip.user) === null || _a === void 0 ? void 0 : _a.firstName, " ").concat((_b = trip === null || trip === void 0 ? void 0 : trip.user) === null || _b === void 0 ? void 0 : _b.lastName), likes: trip === null || trip === void 0 ? void 0 : trip.tripFavoritedBy.length, comments: (_c = trip === null || trip === void 0 ? void 0 : trip.tripComments) === null || _c === void 0 ? void 0 : _c.length }));
                            }),
                            count: totalTripsCount,
                            tripsOnPageCount: trips.length
                        }];
            }
        });
    });
};
exports.filtering = filtering;
var getUsersQuery = function (search) {
    var _a, _b;
    return {
        OR: [
            {
                OR: [
                    {
                        user: {
                            firstName: {
                                contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    },
                    {
                        user: {
                            firstName: {
                                contains: (_a = search === null || search === void 0 ? void 0 : search.split(' ')[1]) !== null && _a !== void 0 ? _a : search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    }
                ],
            },
            {
                OR: [
                    {
                        user: {
                            lastName: {
                                contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    },
                    {
                        user: {
                            lastName: {
                                contains: (_b = search === null || search === void 0 ? void 0 : search.split(' ')[1]) !== null && _b !== void 0 ? _b : search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    }
                ]
            }
        ]
    };
};
exports.getUsersQuery = getUsersQuery;
var switchTripHideStatus = function (tripId, userId, userRole) { return __awaiter(void 0, void 0, void 0, function () {
    var trip;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getTripById(tripId)];
            case 1:
                trip = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(trip))
                    throw new api_error_1.default(404, { message: "Trip not found!" });
                else if (trip.user.id != userId && userRole != auth_service_1.ROLE.ADMIN)
                    throw new api_error_1.default(403, { message: "You are not the author of the trip!" });
                return [4 /*yield*/, PrismaClient_1.default.trip.update({
                        where: {
                            id: Number(tripId)
                        },
                        data: {
                            isHidden: !trip.isHidden
                        }
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, trip];
        }
    });
}); };
exports.switchTripHideStatus = switchTripHideStatus;
//# sourceMappingURL=trip.service.js.map