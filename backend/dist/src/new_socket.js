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
var user_service_1 = require("./services/user.service");
var PrismaClient_1 = __importDefault(require("../prisma/PrismaClient"));
var server = require("./server").server;
var instrument = require("@socket.io/admin-ui").instrument;
var io = require("socket.io")(server, {
    //pingTimeout: 600000,
    cors: {
        origin: ["http://localhost:3000", 'http://localhost:5000/', "https://admin.socket.io", "*"],
        credentials: true
    },
});
instrument(io, { auth: false });
global.onlineUsers = [];
var addUser = function (userId, socketId) {
    !global.onlineUsers.some(function (user) { return user.userId === userId
        && user.socketId == socketId; })
        && global.onlineUsers.push({ userId: userId, socketId: socketId });
};
var removeUser = function (socketId) {
    global.onlineUsers = global.onlineUsers.filter(function (user) { return user.socketId !== socketId; });
};
var getUser = function (userId) {
    return global.onlineUsers.find(function (user) { return user.userId === userId; });
};
var allUser = function () {
    return global.onlineUsers.reduce(function (group, product) {
        var userId = product.userId;
        group[userId] = group[userId] != undefined ? group[userId] : 0;
        group[userId] += 1;
        return group;
    }, {});
};
io.on("connection", function (socket) {
    console.log(allUser());
    console.log("All connections: ".concat(Array.from(io.sockets.sockets).map(function (socket) { return socket[0]; })));
    console.log("Connected to socket.io");
    var userData;
    socket.on("setup", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var us, userChats, i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userData = data;
                    addUser(data === null || data === void 0 ? void 0 : data.id, socket.id);
                    if (!userData) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, user_service_1.getUserById)(userData === null || userData === void 0 ? void 0 : userData.id)];
                case 1:
                    us = (_b.sent());
                    userChats = (_a = us === null || us === void 0 ? void 0 : us.chats) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.id; });
                    if (userChats) {
                        for (i = 0; i < (userChats === null || userChats === void 0 ? void 0 : userChats.length); i++) {
                            socket.join(userChats[i]);
                        }
                    }
                    _b.label = 2;
                case 2:
                    socket.emit("connected", allUser());
                    socket.broadcast.emit("connected", allUser());
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("join chat", function (room) {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("get-online-users", function () {
        var _a;
        if (((_a = getUser(socket.id)) === null || _a === void 0 ? void 0 : _a.userId) != undefined) {
            socket.in(getUser(socket.id).userId);
            socket.to(getUser(socket.id).userId);
        }
        else {
            socket.broadcast.emit("post-online-users", allUser());
        }
    });
    socket.on("disconnect", function (room) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("USER DISCONNECTED");
            // socket.leave(userData?.id);
            // socket.leaveAll();
            //#############################################
            //#############################################
            // console.log(userData)
            // if (global.onlineUsers?.find((item: any) => item.socketId == socket.id)?.userId != undefined) {
            //   const us = (await getUserById(global.onlineUsers?.find((item: any) => item.socketId == socket.id)?.userId))
            //   const aa = us?.chats?.map((item: any) => item.id)
            //   console.log('-----------------------')
            //   console.log(us?.chats?.map((item: any) => item.id))
            //   console.log('-----------------------')
            //
            //   if (aa) {
            //     for (let i = 0; i < aa?.length; i++) {
            //       socket.leave(aa[i])
            //     }
            //   }
            // }
            //#############################################
            //#############################################
            removeUser(socket.id);
            socket.broadcast.emit("disconnected", allUser());
            return [2 /*return*/];
        });
    }); });
    socket.on("new-message", function (newMessageReceived) {
        var chat = newMessageReceived === null || newMessageReceived === void 0 ? void 0 : newMessageReceived.chat;
        socket.in(newMessageReceived.chat.id).emit("message-received", newMessageReceived);
        // if (chat?.users?.length === 0)
        //   return console.log("chat.users not defined");
        // chat.users.forEach((user) => {
        //   console.log(newMessageReceived?.sender)
        //   if (user.id != newMessageReceived?.sender && getUser(user.id)) {
        //     socket.in(getUser(user.id)?.socketId).emit("message-received", newMessageReceived);
        //   }
        // });
    });
    // socket.off("setup", async () => {
    //   console.log("USER DISCONNECTED");
    //
    //   removeUser(socket.id);
    //
    //   socket.broadcast.emit("disconnected", allUser())
    //
    //   // if (userData?.id) {
    //   //   const dbUser = await findUser(userData?.id)
    //   //   if (dbUser) {
    //   //     const user = getUser(dbUser?.id)
    //   //     let follower = null
    //   //     for (let i = 0; i < dbUser.followedBy.length; i++) {
    //   //       if (userData?.id != dbUser.followedBy[i].id) {
    //   //         follower = getUser(dbUser.followedBy[i].id)
    //   //         if (follower)
    //   //           socket.to(follower.socketId).emit("disconnected", user)
    //   //       }
    //   //     }
    //   //   }
    //   // }
    // });
    socket.on("send-views", function (_a) {
        var userId = _a.userId, guestId = _a.guestId;
        return __awaiter(void 0, void 0, void 0, function () {
            var userInfo, guest;
            return __generator(this, function (_b) {
                userInfo = (0, user_service_1.getProfileViews)(userId);
                guest = getUser(guestId);
                if (guest)
                    socket.to(guest.socketId).emit("receive-views", userInfo);
                return [2 /*return*/];
            });
        });
    });
    socket.on("post-reconnect-to-rooms", function (users) { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        var _a;
        return __generator(this, function (_b) {
            if (users)
                for (i = 0; i < global.onlineUsers.length; i++) {
                    if (users === null || users === void 0 ? void 0 : users.includes((_a = global.onlineUsers[i]) === null || _a === void 0 ? void 0 : _a.userId)) {
                        socket.to(global.onlineUsers[i].socketId).emit("get-reconnect-to-rooms");
                    }
                }
            return [2 /*return*/];
        });
    }); });
    socket.on("post-join-room-again", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, aa, i;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, user_service_1.getUserById)(userData.id)];
                case 1:
                    user = _b.sent();
                    aa = (_a = user === null || user === void 0 ? void 0 : user.chats) === null || _a === void 0 ? void 0 : _a.map(function (item) { return item.id; });
                    if (user)
                        for (i = 0; i < (aa === null || aa === void 0 ? void 0 : aa.length); i++)
                            socket.join(aa[i]);
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on("send-trip-join-request", function (_a) {
        var userId = _a.userId, senderId = _a.senderId, tripId = _a.tripId, tripRequestId = _a.tripRequestId, receiveUserId = _a.receiveUserId;
        return __awaiter(void 0, void 0, void 0, function () {
            var user, user, user;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!(receiveUserId != undefined)) return [3 /*break*/, 1];
                        if (getUser(receiveUserId)) {
                            socket.to(getUser(receiveUserId).socketId).emit("receive-trip-join-request");
                        }
                        return [3 /*break*/, 7];
                    case 1:
                        if (!tripRequestId) return [3 /*break*/, 3];
                        return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.findUnique({
                                where: {
                                    id: Number(tripRequestId)
                                },
                                select: {
                                    userId: true
                                }
                            })];
                    case 2:
                        user = _d.sent();
                        if (user && getUser(user === null || user === void 0 ? void 0 : user.userId)) {
                            socket.to(getUser(user === null || user === void 0 ? void 0 : user.userId).socketId).emit("receive-trip-join-request");
                        }
                        return [3 /*break*/, 7];
                    case 3:
                        if (!!userId) return [3 /*break*/, 5];
                        return [4 /*yield*/, PrismaClient_1.default.trip.findUnique({
                                where: {
                                    id: Number(tripId)
                                },
                                select: {
                                    userId: true,
                                }
                            })];
                    case 4:
                        user = _d.sent();
                        if (user && getUser(user === null || user === void 0 ? void 0 : user.userId)) {
                            socket.to(getUser(user === null || user === void 0 ? void 0 : user.userId).socketId).emit("receive-trip-join-request");
                        }
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, PrismaClient_1.default.userJoinToTrip.findFirst({
                            where: {
                                user: {
                                    id: Number(userId)
                                },
                                trip: {
                                    id: Number(tripId)
                                }
                            },
                            select: {
                                trip: {
                                    select: {
                                        userId: true
                                    }
                                }
                            }
                        })];
                    case 6:
                        user = _d.sent();
                        if (user && getUser((_b = user === null || user === void 0 ? void 0 : user.trip) === null || _b === void 0 ? void 0 : _b.userId)) {
                            socket.to(getUser((_c = user === null || user === void 0 ? void 0 : user.trip) === null || _c === void 0 ? void 0 : _c.userId).socketId).emit("receive-trip-join-request");
                        }
                        _d.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    });
});
module.exports = io;
//# sourceMappingURL=new_socket.js.map