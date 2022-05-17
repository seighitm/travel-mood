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
var message_service_1 = require("../services/message.service");
var asyncHandler_1 = require("../utils/asyncHandler");
var router = (0, express_1.Router)();
router.put('/messages/read', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var messages;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, message_service_1.readMessages)((_a = req.body) === null || _a === void 0 ? void 0 : _a.firstMessageId, (_b = req.body) === null || _b === void 0 ? void 0 : _b.chatId, (_c = req.user) === null || _c === void 0 ? void 0 : _c.id)];
            case 1:
                messages = _d.sent();
                res.json(messages);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/messages/non-read', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var messages;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, message_service_1.getNonReadMessages)((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                messages = _b.sent();
                res.json(messages);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/message/:chatId', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var messages;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                console.log(req.params);
                console.log(req.query);
                return [4 /*yield*/, (0, message_service_1.getMessagesByChatId)((_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, req.query.massagesCount)];
            case 1:
                messages = _c.sent();
                res.json(messages);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/message/single/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    var _a;
    return __generator(this, function (_b) {
        message = (0, message_service_1.getMessageById)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
        res.json(message);
        return [2 /*return*/];
    });
}); }));
router.post('/message', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, content, chatId, message;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, content = _a.content, chatId = _a.chatId;
                return [4 /*yield*/, (0, message_service_1.createNewMessage)(content, chatId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                message = _c.sent();
                res.json(message);
                return [2 /*return*/];
        }
    });
}); }));
router.get('/message/read/:chatId', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var messages;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, message_service_1.other_ReadMessage)((_a = req.params) === null || _a === void 0 ? void 0 : _a.chatId, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                messages = _c.sent();
                res.json(messages);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=message.controller.js.map