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
var article_service_1 = require("../services/article.service");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var asyncHandler_1 = require("../utils/asyncHandler");
var upload = require("../middlewares/fileUpload.middleware");
var router = (0, express_1.Router)();
/**
 * @desc Get articles
 * @access PUBLIC
 * @route {GET} api/articles
 * @param {*} req.query
 * @returns {Promise} Promise
 */
router.get('/admin/articles', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var articles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.getArticlesForAdmin)(req.query)];
            case 1:
                articles = _a.sent();
                res.json(articles);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Get articles
 * @access PUBLIC
 * @route {GET} api/articles
 * @param {*} req.query
 * @returns {Promise} Promise
 */
router.get('/articles', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var articles;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.getArticles)(req.query, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                articles = _b.sent();
                res.json(articles);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Create new article
 * @access PUBLIC
 * @route {POST} api/articles
 * @param {*} req.body
 * @returns {Promise} Promise
 */
router.post('/article', [auth_middleware_1.authM.required, upload.array("images[]")], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log(req.body);
                return [4 /*yield*/, (0, article_service_1.createArticle)(req.body, req.files, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                article = _b.sent();
                res.json(article);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Get one article
 * @access PUBLIC
 * @route {GET} api/article/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.get('/article/:id', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.getArticleById)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                article = _c.sent();
                res.json(article);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Update article
 * @access PRIVATE
 * @route {PUT} api/article/:id
 * @param {*} req.body
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.put('/article/:id', [auth_middleware_1.authM.required, upload.array("images[]")], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log(req.body);
                console.log(req.files);
                return [4 /*yield*/, (0, article_service_1.updateArticle)(req.body, req.params.id, req.user.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.role, req.files)];
            case 1:
                article = _b.sent();
                res.json(article);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Delete article
 * @access PRIVATE
 * @route {DELETE} api/article/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.deleteArticle)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, (_c = req.user) === null || _c === void 0 ? void 0 : _c.role)];
            case 1:
                data = _d.sent();
                res.json(data);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Add article to favorite
 * @access PRIVATE
 * @route {POST} api/article/:id/favorite
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.post('/article/:id/favorite', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.favoriteArticle)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                article = _c.sent();
                res.json(article);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Remove article from favorite
 * @access PRIVATE
 * @route {DELETE} api/article/:id/favorite
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/:id/favorite', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.unFavoriteArticle)(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                article = _b.sent();
                res.json(article);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Get all article comments
 * @access PUBLIC
 * @route {GET} api/article/:id/comments
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.get('/article/:id/comments', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var comments;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.getCommentsByArticle)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                comments = _b.sent();
                res.json(comments);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Create new comment
 * @access PRIVATE
 * @route {POST} api/article/:id/comments
 * @param {*} req.body
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.post('/article/:id/comment', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.addComment)(req.body.comment, req.params.id, req.user.id)];
            case 1:
                comment = _a.sent();
                res.json(comment);
                return [2 /*return*/];
        }
    });
}); }));
/**
 * @desc Delete comment
 * @access PRIVATE
 * @route {DELETE} api/article/comment/:id
 * @param {id} req.params
 * @returns {Promise} Promise
 */
router.delete('/article/comment/:id', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, (0, article_service_1.deleteComment)((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, (_c = req.user) === null || _c === void 0 ? void 0 : _c.role)];
            case 1:
                comment = _d.sent();
                res.json(comment);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=article.controller.js.map