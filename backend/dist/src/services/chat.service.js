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
exports.getChats = exports.addUserToGroupChat = exports.deleteGroupChat = exports.updateGroupChat = exports.createGroupChat = exports.createChat = exports.getMyChats = exports.accessChat = exports.findChatByQuery = void 0;
var api_error_1 = __importDefault(require("../utils/api-error"));
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var findChatByQuery = function (chatPayload, userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.chat.findFirst({
                    where: {
                        AND: [
                            { isGroupChat: false },
                            { users: { some: { id: { equals: Number(userId) } } } },
                            { users: { some: { id: { equals: Number(chatPayload.userId) } } } }
                        ]
                    },
                    select: {
                        id: true,
                        users: true,
                        chatName: true,
                        isGroupChat: true,
                        groupAdmin: true,
                        latestMessage: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findChatByQuery = findChatByQuery;
var accessChat = function (chatPayload, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(chatPayload === null || chatPayload === void 0 ? void 0 : chatPayload.userId)) {
                    throw new api_error_1.default(422, { message: "Person ID can't be blank" });
                }
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                return [4 /*yield*/, (0, exports.findChatByQuery)(chatPayload, userId)];
            case 1:
                chat = _a.sent();
                if (!chat) return [3 /*break*/, 2];
                return [2 /*return*/, chat];
            case 2: return [4 /*yield*/, (0, exports.createChat)(chatPayload, userId)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.accessChat = accessChat;
var getMyChats = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chats, i, j;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { errors: { title: ["UserId param not sent with request"] } });
                }
                return [4 /*yield*/, PrismaClient_1.default.chat.findMany({
                        where: {
                            users: {
                                some: {
                                    id: { equals: Number(userId) }
                                }
                            }
                        },
                        orderBy: {
                            id: 'asc'
                        },
                        select: {
                            id: true,
                            users: {
                                include: {
                                    picture: true
                                }
                            },
                            chatName: true,
                            isGroupChat: true,
                            groupAdmin: true,
                            latestMessage: true,
                            // messageNotification: true
                        }
                    })
                    // const ch = chats.map((item: any) => ({...item, chatName: item.users.find((u: any) => u.id != userId).firstName()}))
                ];
            case 1:
                chats = _a.sent();
                // const ch = chats.map((item: any) => ({...item, chatName: item.users.find((u: any) => u.id != userId).firstName()}))
                for (i = 0; i < chats.length; i++) {
                    if (chats[i].isGroupChat == false)
                        for (j = 0; j < chats[i].users.length; j++) {
                            if (chats[i].users[j].id != userId) {
                                chats[i].chatName = chats[i].users[j].firstName;
                            }
                        }
                }
                return [2 /*return*/, chats];
        }
    });
}); };
exports.getMyChats = getMyChats;
var createChat = function (chatPayload, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.chat.create({
                    data: {
                        chatName: 'chatName',
                        isGroupChat: false,
                        users: {
                            connect: [
                                { id: Number(userId) },
                                { id: Number(chatPayload.userId) }
                            ],
                        },
                        groupAdmin: {
                            connect: {
                                id: Number(userId),
                            },
                        },
                    },
                    select: {
                        id: true,
                        users: true,
                        chatName: true,
                        isGroupChat: true,
                        groupAdmin: true,
                        latestMessage: true
                    }
                })];
            case 1:
                chat = _a.sent();
                return [2 /*return*/, chat];
        }
    });
}); };
exports.createChat = createChat;
var createGroupChat = function (users, chatName, userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                if (!chatName) {
                    throw new api_error_1.default(400, { message: "ChatName can't be blank" });
                }
                if (!users) {
                    throw new api_error_1.default(400, { message: "USERS field can't be blank" });
                }
                if (users.length < 2) {
                    throw new api_error_1.default(400, { message: "More than 2 users are required to form a group chat" });
                }
                users.push(userId);
                return [4 /*yield*/, PrismaClient_1.default.chat.create({
                        data: {
                            chatName: chatName,
                            isGroupChat: true,
                            users: { connect: (users === null || users === void 0 ? void 0 : users.map(function (item) { return ({ id: item }); })) || [] },
                            groupAdmin: {
                                connect: {
                                    id: Number(userId),
                                },
                            },
                        },
                        select: {
                            id: true,
                            users: true,
                            chatName: true,
                            isGroupChat: true,
                            groupAdmin: true,
                            latestMessage: true
                        }
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.createGroupChat = createGroupChat;
var updateGroupChat = function (chatName, chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                if (!chatName) {
                    throw new api_error_1.default(400, { message: "ChatName can't be blank" });
                }
                return [4 /*yield*/, PrismaClient_1.default.chat.update({
                        where: {
                            id: chatId
                        },
                        data: {
                            chatName: chatName,
                        },
                        select: {
                            id: true,
                            users: true,
                            chatName: true,
                            isGroupChat: true,
                            groupAdmin: true,
                            latestMessage: true,
                        }
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateGroupChat = updateGroupChat;
var deleteGroupChat = function (chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chatUsers, newUsers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                return [4 /*yield*/, PrismaClient_1.default.chat.findUnique({
                        where: { id: chatId },
                        select: { users: true }
                    })];
            case 1:
                chatUsers = _b.sent();
                newUsers = (_a = chatUsers === null || chatUsers === void 0 ? void 0 : chatUsers.users) === null || _a === void 0 ? void 0 : _a.filter(function (item) { return item.id !== userId; }).map(function (user) { return ({ id: user.id }); });
                return [4 /*yield*/, PrismaClient_1.default.chat.update({
                        where: {
                            id: chatId
                        },
                        data: {
                            users: { set: newUsers || [] },
                        },
                        select: {
                            id: true,
                            users: true,
                            chatName: true,
                            isGroupChat: true,
                            groupAdmin: true,
                            latestMessage: true
                        }
                    })];
            case 2: return [2 /*return*/, _b.sent()];
        }
    });
}); };
exports.deleteGroupChat = deleteGroupChat;
var addUserToGroupChat = function (chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chatUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                return [4 /*yield*/, PrismaClient_1.default.chat.findMany({
                        where: {
                            id: chatId
                        },
                        select: {
                            id: true,
                        }
                    })];
            case 1:
                chatUsers = _a.sent();
                if (!chatUsers) {
                    throw new api_error_1.default(400, { message: "ChatUsers field not found!" });
                }
                return [4 /*yield*/, PrismaClient_1.default.chat.update({
                        where: {
                            id: chatId
                        },
                        data: {
                            users: {
                                connect: { id: userId }
                            },
                        },
                        select: {
                            id: true,
                            users: true,
                            chatName: true,
                            isGroupChat: true,
                            groupAdmin: true,
                            latestMessage: true
                        }
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addUserToGroupChat = addUserToGroupChat;
// #################################################3
// #################################################3
// #################################################3
var getChats = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var chats;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userId) {
                    throw new api_error_1.default(400, { message: "UserId param not sent with request" });
                }
                return [4 /*yield*/, (0, exports.getMyChats)(userId)
                    // if (chats) {
                    //   for (let i = 0; i < chats.length; i++) {
                    //     let c = 0;
                    //     for (let j = 0; j < chats[i].messageNotification.length; j++) {
                    //       if (chats[i].messageNotification[j].userId == userId) {
                    //         c += 1
                    //       }
                    //     }
                    //     // @ts-ignore
                    //     chats[i].countNonReadmessages = c
                    //   }
                    // }
                ];
            case 1:
                chats = _a.sent();
                // if (chats) {
                //   for (let i = 0; i < chats.length; i++) {
                //     let c = 0;
                //     for (let j = 0; j < chats[i].messageNotification.length; j++) {
                //       if (chats[i].messageNotification[j].userId == userId) {
                //         c += 1
                //       }
                //     }
                //     // @ts-ignore
                //     chats[i].countNonReadmessages = c
                //   }
                // }
                return [2 /*return*/, chats];
        }
    });
}); };
exports.getChats = getChats;
//# sourceMappingURL=chat.service.js.map