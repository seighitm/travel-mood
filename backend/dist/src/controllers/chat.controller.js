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
var chat_service_1 = require("../services/chat.service");
var asyncHandler_1 = require("../utils/asyncHandler");
var router = (0, express_1.Router)();
/**
 * Access chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  title
 * @returns created chat
 */
router.post('/chat', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chat;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, chat_service_1.accessChat)(req.body, (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                chat = _b.sent();
                res.json(chat);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Get my chats
 * @auth required
 * @route {GET} /chat
 * @returns array of chats
 */
router.get('/chat', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var chats;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, chat_service_1.getMyChats)(req.user.id)];
            case 1:
                chats = _a.sent();
                res.json(chats);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Create group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chat name
 * @bodyparam  users
 * @returns created group chat
 */
router.post('/chat/group', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var groupChat;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, chat_service_1.createGroupChat)((_a = req.body) === null || _a === void 0 ? void 0 : _a.users, (_b = req.body) === null || _b === void 0 ? void 0 : _b.chatName, (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id)];
            case 1:
                groupChat = _d.sent();
                res.json(groupChat);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Update group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.put('/chat/group', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, chatName, groupChat;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, chatName = _a.chatName;
                return [4 /*yield*/, (0, chat_service_1.updateGroupChat)(chatName, chatId, (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                groupChat = _c.sent();
                res.json(groupChat);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Delete group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.delete('/chat/group', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, groupChat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, (0, chat_service_1.deleteGroupChat)(chatId, userId)];
            case 1:
                groupChat = _b.sent();
                res.json(groupChat);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * Add user to group chat
 * @auth required
 * @route {POST} /chat
 * @bodyparam  chatId
 * @bodyparam  chat name
 * @returns updated group chat
 */
router.put('/chat/groupadd', auth_middleware_1.authM.required, (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, chatId, userId, groupChat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, chatId = _a.chatId, userId = _a.userId;
                return [4 /*yield*/, (0, chat_service_1.addUserToGroupChat)(chatId, userId)];
            case 1:
                groupChat = _b.sent();
                res.json(groupChat);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=chat.controller.js.map