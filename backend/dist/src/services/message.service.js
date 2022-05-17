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
exports.other_ReadMessage = exports.createNewMessage = exports.getMessageById = exports.getMessagesByChatId = exports.getNonReadMessages = exports.readMessages = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var api_error_1 = __importDefault(require("../utils/api-error"));
var readMessages = function (firstMessageId, chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!firstMessageId) return [3 /*break*/, 6];
                return [4 /*yield*/, PrismaClient_1.default.message.findMany({
                        where: {
                            id: {
                                gt: Number(firstMessageId)
                            },
                            chat: {
                                id: Number(chatId)
                            }
                        },
                        select: {
                            id: true
                        }
                    })];
            case 1:
                messages = _a.sent();
                if (!messages[messages.length - 1]) return [3 /*break*/, 5];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < messages.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, PrismaClient_1.default.message.update({
                        where: {
                            id: messages[i].id,
                        },
                        data: {
                            readBy: {
                                connect: {
                                    id: Number(userId)
                                }
                            }
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, messages];
            case 6: return [2 /*return*/, []];
        }
    });
}); };
exports.readMessages = readMessages;
var getNonReadMessages = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var messages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.message.findMany({
                    where: {
                        user: {
                            id: {
                                not: Number(userId)
                            }
                        },
                        chat: {
                            users: {
                                some: {
                                    id: Number(userId)
                                }
                            }
                        },
                        readBy: {
                            none: {
                                id: Number(userId)
                            }
                        }
                    },
                    select: {
                        id: true,
                        chat: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                })];
            case 1:
                messages = _a.sent();
                return [2 /*return*/, messages];
        }
    });
}); };
exports.getNonReadMessages = getNonReadMessages;
// export const getMessagesByChatId = async (
//   chatId: number | string,
//   userId: number | string,
//   page: any
// ): Promise<any> => {
//   console.log(page)
//   const totalTripsCount = await prisma.trip.count()
//   console.log('==============')
//   console.log(page)
//
//
//   const messagesCount = await prisma.message.count({
//     where:{
//       chat: {
//         id: Number(chatId)
//       }
//     }
//   })
//   console.log(messagesCount)
//   console.log(Math.ceil(messagesCount / 12))
//   const activePage = messagesCount- (Number(page)) * 12 || 0
//   console.log(activePage)
//   console.log('==============')
//   const messages = await prisma.message.findMany({
//     orderBy: {
//       id: 'asc'
//     },
//     where: {
//       chat: {
//         id: Number(chatId)
//       }
//     },
//     include: {
//       chat: {
//         select: {
//           id: true,
//         }
//       },
//       user: true,
//       lastChatMessage: true
//     },
//     skip: (page - 1) * 12,
//     take: 12,
//   })
//
//   // if (messages[messages.length - 1]) {
//   //   for (let i = 0; i < messages.length; i++)
//   //     await prisma.message.update({
//   //         where: {
//   //           id: messages[i].id,
//   //         },
//   //         data: {
//   //           readBy: {
//   //             connect: {
//   //               id: Number(userId)
//   //             }
//   //           }
//   //         },
//   //       }
//   //     )
//   // }
//
//   console.log(messages)
//   console.log('_________________')
//   console.log('_________________')
//   return {page: page, messages: messages}
// }
var getMessagesByChatId = function (chatId, userId, massagesCount) { return __awaiter(void 0, void 0, void 0, function () {
    var startMessage, messages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(massagesCount);
                return [4 /*yield*/, PrismaClient_1.default.message.findMany({
                        where: {
                            chat: {
                                id: Number(chatId)
                            }
                        },
                        // orderBy: {
                        //   id: 'desc',
                        // },
                        // orderBy: {
                        //   id: 'desc',
                        // },
                        // cursor: {
                        //   id: massagesCount ? startMessage[0].id - Number(massagesCount) : startMessage[0].id,
                        // },
                        skip: massagesCount ? Number(massagesCount) - 15 : 0,
                        take: -15
                    })];
            case 1:
                startMessage = _a.sent();
                console.log(startMessage[0].id);
                console.log(startMessage[startMessage.length - 1].id);
                return [4 /*yield*/, PrismaClient_1.default.message.findMany({
                        where: {
                            chat: {
                                id: Number(chatId)
                            }
                        },
                        include: {
                            chat: {
                                select: {
                                    id: true,
                                }
                            },
                            user: true,
                            lastChatMessage: true
                        },
                        skip: massagesCount ? Number(massagesCount) - 15 : 0,
                        take: -15
                    })
                    // if (messages[messages.length - 1]) {
                    //   for (let i = 0; i < messages.length; i++)
                    //     await prisma.message.update({
                    //       where: {
                    //         id: messages[i].id,
                    //       },
                    //       data: {
                    //         readBy: {
                    //           connect: {
                    //             id: Number(userId)
                    //           }
                    //         }
                    //       }
                    //     })
                    // }
                ];
            case 2:
                messages = _a.sent();
                // if (messages[messages.length - 1]) {
                //   for (let i = 0; i < messages.length; i++)
                //     await prisma.message.update({
                //       where: {
                //         id: messages[i].id,
                //       },
                //       data: {
                //         readBy: {
                //           connect: {
                //             id: Number(userId)
                //           }
                //         }
                //       }
                //     })
                // }
                return [2 /*return*/, messages];
        }
    });
}); };
exports.getMessagesByChatId = getMessagesByChatId;
var getMessageById = function (messageId) { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.message.findUnique({
                    where: { id: Number(messageId) }
                })];
            case 1:
                message = _a.sent();
                return [2 /*return*/, message];
        }
    });
}); };
exports.getMessageById = getMessageById;
var createNewMessage = function (content, chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!content || !chatId) {
                    throw new api_error_1.default(400, { message: "Invalid data passed into request" });
                }
                return [4 /*yield*/, PrismaClient_1.default.message.create({
                        data: {
                            user: {
                                connect: {
                                    id: Number(userId)
                                }
                            },
                            content: content,
                            chat: {
                                connect: {
                                    id: Number(chatId)
                                }
                            },
                            readBy: {
                                connect: {
                                    id: Number(userId)
                                }
                            },
                        },
                        select: {
                            id: true,
                            content: true,
                            readBy: true,
                            lastChatMessage: true,
                            chatId: true,
                            createdAt: true,
                            user: true,
                            chat: {
                                include: {
                                    users: true
                                }
                            }
                        }
                    })];
            case 1:
                message = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.chat.update({
                        where: {
                            id: Number(chatId)
                        },
                        data: {
                            latestMessage: {
                                connect: {
                                    id: message.id
                                }
                            }
                        },
                        select: {
                            messages: true
                        }
                    })];
            case 2:
                _a.sent();
                // if (message.chat.users) {
                //   for (let i = 0; i < message.chat.users.length; i++) {
                //     if (message.chat.users[i].id != Number(userId))
                //       await prisma.messageNotification.create({
                //         data: {
                //           messageId: message.id,
                //           userId: message.chat.users[i].id,
                //           chatId: Number(chatId)
                //         }
                //       })
                //   }
                // }
                return [2 /*return*/, message];
        }
    });
}); };
exports.createNewMessage = createNewMessage;
var other_ReadMessage = function (chatId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var messages, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.message.findMany({
                    where: {
                        chat: {
                            id: Number(chatId)
                        }
                    },
                    select: {
                        id: true,
                        readBy: true,
                    }
                })];
            case 1:
                messages = _a.sent();
                if (!messages[messages.length - 1]) return [3 /*break*/, 5];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < messages.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, PrismaClient_1.default.message.update({
                        where: {
                            id: messages[i].id
                        },
                        data: {
                            readBy: {
                                connect: {
                                    id: Number(userId)
                                }
                            }
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, messages];
        }
    });
}); };
exports.other_ReadMessage = other_ReadMessage;
//# sourceMappingURL=message.service.js.map