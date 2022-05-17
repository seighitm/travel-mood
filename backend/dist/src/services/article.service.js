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
exports.getUsersQuery = exports.getArticlesForAdmin = exports.deleteComment = exports.addComment = exports.getCommentsByArticle = exports.unFavoriteArticle = exports.favoriteArticle = exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.createArticle = exports.findManyArticles = exports.removeUnusedImages = exports.getArticles = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var article_selector_1 = require("../selectors/article.selector");
var api_error_1 = __importDefault(require("../utils/api-error"));
var comment_selector_1 = __importDefault(require("../selectors/comment.selector"));
var comment_mapper_1 = __importDefault(require("../mappers/comment.mapper"));
var article_mapper_1 = require("../mappers/article.mapper");
var primitive_checks_1 = require("../utils/primitive-checks");
var article_validator_1 = require("../validators/article.validator");
var file_upload_services_1 = require("./file-upload.services");
var auth_service_1 = require("./auth.service");
var getArticles = function (query, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var queries, page, articles, totalArticles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queries = buildFindAllQuery(query);
                page = (query.page - 1) * (Number(query.limit) || 12) || 0;
                return [4 /*yield*/, (0, exports.findManyArticles)(queries, Number(page), Number(query.limit))];
            case 1:
                articles = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.article.count()];
            case 2:
                totalArticles = _a.sent();
                return [2 /*return*/, {
                        articles: articles.map(function (article) { return (0, article_mapper_1.articlesMapper)(article, userId); }),
                        articlesCountOnPage: articles.length,
                        totalCount: totalArticles
                    }];
        }
    });
}); };
exports.getArticles = getArticles;
var removeUnusedImages = function (imagesToRemove) { return __awaiter(void 0, void 0, void 0, function () {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(!(0, primitive_checks_1.isNullOrUndefined)(imagesToRemove) && !(0, primitive_checks_1.isEmptyArray)(imagesToRemove))) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, file_upload_services_1.removeFiles)(imagesToRemove.map(function (image) { return image === null || image === void 0 ? void 0 : image.name; }))];
            case 1:
                _a.sent();
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < imagesToRemove.length)) return [3 /*break*/, 5];
                return [4 /*yield*/, PrismaClient_1.default.articleImage.delete({
                        where: {
                            name: imagesToRemove[i].name
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
exports.removeUnusedImages = removeUnusedImages;
var findArticlesByTitle = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.findMany({
                    where: {
                        title: title
                    },
                    select: {
                        id: true,
                        title: true,
                        images: true
                    },
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var findManyArticles = function (query, offset, limit) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.findMany({
                    where: query,
                    orderBy: {
                        id: 'desc',
                    },
                    skip: offset || 0,
                    take: limit || 12,
                    select: article_selector_1.articlesSelector,
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findManyArticles = findManyArticles;
var createArticle = function (_a, images, userId) {
    var title = _a.title, description = _a.description, body = _a.body, tagList = _a.tagList, countries = _a.countries, isPrimaryImage = _a.isPrimaryImage;
    return __awaiter(void 0, void 0, void 0, function () {
        var countOfExistingTitles, article;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    (0, article_validator_1.ArticleCreateOrUpdateValidator)({ title: title, description: description, countries: countries, body: body });
                    return [4 /*yield*/, PrismaClient_1.default.article.count({
                            where: {
                                title: title
                            }
                        })];
                case 1:
                    countOfExistingTitles = _c.sent();
                    if (countOfExistingTitles != 0) {
                        throw new api_error_1.default(422, { message: 'Title already exists!' });
                    }
                    return [4 /*yield*/, PrismaClient_1.default.article.create({
                            data: __assign(__assign(__assign(__assign({ title: title, description: description, body: body }, ((!(0, primitive_checks_1.isNullOrUndefined)(tagList) && !(0, primitive_checks_1.isEmptyArray)(tagList)) ? {
                                tagList: {
                                    connectOrCreate: tagList.map(function (tag) { return ({
                                        create: { name: tag[0] == '#' ? tag : "#".concat(tag) },
                                        where: { name: tag[0] == '#' ? tag : "#".concat(tag) },
                                    }); }),
                                },
                            } : [])), (isPrimaryImage != 'false' ? {
                                primaryImage: (_b = images[0]) === null || _b === void 0 ? void 0 : _b.filename
                            } : {})), { countries: {
                                    connect: countries.map(function (item) { return ({ code: item }); })
                                }, author: {
                                    connect: {
                                        id: Number(userId),
                                    },
                                } }), ((!(0, primitive_checks_1.isNullOrUndefined)(images) && !(0, primitive_checks_1.isEmptyArray)(images)) ? {
                                images: {
                                    create: images.map(function (file) { return ({ name: file.filename }); })
                                }
                            } : [])),
                            select: article_selector_1.articleSelector,
                        })];
                case 2:
                    article = _c.sent();
                    return [2 /*return*/, (0, article_mapper_1.articleMapper)(article, userId)];
            }
        });
    });
};
exports.createArticle = createArticle;
var getArticleById = function (id, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.findUnique({
                    where: {
                        id: Number(id)
                    },
                    select: article_selector_1.articleSelector,
                })];
            case 1:
                article = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(article)) {
                    throw new api_error_1.default(404, { message: 'Article not found!' });
                }
                return [2 /*return*/, (0, article_mapper_1.articleMapper)(article, userId)];
        }
    });
}); };
exports.getArticleById = getArticleById;
var updateArticle = function (_a, id, userId, userRole, files) {
    var title = _a.title, description = _a.description, body = _a.body, tagList = _a.tagList, countries = _a.countries, isPrimaryImage = _a.isPrimaryImage, oldImages = _a.oldImages, oldPrimaryImage = _a.oldPrimaryImage;
    return __awaiter(void 0, void 0, void 0, function () {
        var articles, art, imagesToRemove, updatedArticle;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, article_validator_1.ArticleCreateOrUpdateValidator)({ title: title, description: description, countries: countries, body: body });
                    return [4 /*yield*/, findArticlesByTitle(title)];
                case 1:
                    articles = _f.sent();
                    return [4 /*yield*/, (0, exports.getArticleById)(id)];
                case 2:
                    art = _f.sent();
                    if (!(0, primitive_checks_1.isNullOrUndefined)(articles) && (((0, primitive_checks_1.isLongArrayLengthThan)(articles, 1))
                        || (!(0, primitive_checks_1.isEmptyArray)(articles) && ((_b = articles[0]) === null || _b === void 0 ? void 0 : _b.id) != Number(id)))) {
                        throw new api_error_1.default(422, { message: 'Article already exists!' });
                    }
                    imagesToRemove = (_d = (_c = articles[0]) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.filter(function (image) { return !(oldImages === null || oldImages === void 0 ? void 0 : oldImages.includes(image.name)); });
                    return [4 /*yield*/, (0, exports.removeUnusedImages)(imagesToRemove)];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, disconnectArticlesTags(id)];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, disconnectArticlesDestinations(id)];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, PrismaClient_1.default.article.update({
                            where: {
                                id: Number(id),
                            },
                            data: __assign(__assign(__assign(__assign(__assign(__assign({}, ((art && art.author.id != userId && userRole == 'ADMIN')
                                ? { isUpdatedByAdmin: true }
                                : art && art.author.id == userId
                                    ? { isUpdatedByAdmin: false }
                                    : {})), { title: title, body: body, description: description }), (!(0, primitive_checks_1.isNullOrUndefined)(files) && {
                                images: {
                                    createMany: {
                                        data: files === null || files === void 0 ? void 0 : files.map(function (item) { return ({ name: item.filename }); }),
                                    }
                                }
                            })), (isPrimaryImage != 'false' ? {
                                primaryImage: (_e = files[0]) === null || _e === void 0 ? void 0 : _e.filename,
                            }
                                : {
                                    primaryImage: (oldPrimaryImage != "null" && oldPrimaryImage != "" && oldPrimaryImage != null)
                                        ? oldPrimaryImage
                                        : null,
                                })), (!(0, primitive_checks_1.isNullOrUndefined)(tagList) && !(0, primitive_checks_1.isEmptyArray)(tagList) && {
                                tagList: {
                                    connectOrCreate: tagList.map(function (tag) { return ({
                                        create: { name: tag },
                                        where: { name: tag },
                                    }); })
                                }
                            })), (!(0, primitive_checks_1.isEmptyArray)(countries) ? {
                                countries: {
                                    connect: countries.map(function (item) { return ({ name: item }); })
                                },
                            } : {})),
                            select: article_selector_1.articleSelector,
                        })];
                case 6:
                    updatedArticle = _f.sent();
                    return [2 /*return*/, (0, article_mapper_1.articleMapper)(updatedArticle, userId)];
            }
        });
    });
};
exports.updateArticle = updateArticle;
var deleteArticle = function (id, userId, userRole) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.findUnique({
                    where: {
                        id: Number(id)
                    },
                    select: article_selector_1.articleSelector,
                })];
            case 1:
                article = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(article)) {
                    throw new api_error_1.default(404, { message: 'Article not found!' });
                }
                else if (article.author.id !== userId && userRole != auth_service_1.ROLE.ADMIN) {
                    throw new api_error_1.default(403, { message: 'User is not article owner!' });
                }
                return [4 /*yield*/, PrismaClient_1.default.article.delete({
                        where: {
                            id: Number(id)
                        },
                        select: article_selector_1.articleSelector,
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, (0, article_mapper_1.articleMapper)(article, userId)];
        }
    });
}); };
exports.deleteArticle = deleteArticle;
var favoriteArticle = function (id, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        favoritedBy: {
                            connect: { id: Number(userId) },
                        },
                    },
                    select: article_selector_1.articleSelector,
                })];
            case 1:
                article = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(article)) {
                    throw new api_error_1.default(404, { message: 'Article to favorite not found!' });
                }
                return [2 /*return*/, __assign({}, (0, article_mapper_1.articleMapper)(article, userId))];
        }
    });
}); };
exports.favoriteArticle = favoriteArticle;
var unFavoriteArticle = function (id, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var article;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        favoritedBy: {
                            disconnect: { id: Number(userId) },
                        },
                    },
                    select: article_selector_1.articleSelector,
                })];
            case 1:
                article = _a.sent();
                if ((0, primitive_checks_1.isNullOrUndefined)(article)) {
                    throw new api_error_1.default(404, { message: 'Article to favorite not found!' });
                }
                return [2 /*return*/, (0, article_mapper_1.articleMapper)(article, userId)];
        }
    });
}); };
exports.unFavoriteArticle = unFavoriteArticle;
var buildFindAllQuery = function (query) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var queries = [];
    console.log(query);
    console.log(query.author.split(' ')[0]);
    console.log(query.author.split(' ')[1]);
    if (query.author) {
        queries.push({
            OR: [
                {
                    OR: [
                        {
                            author: {
                                firstName: {
                                    contains: (_a = query.author) === null || _a === void 0 ? void 0 : _a.split(' ')[0]
                                }
                            }
                        },
                        {
                            author: {
                                firstName: {
                                    contains: (_c = (_b = query.author) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) !== null && _c !== void 0 ? _c : (_d = query.author) === null || _d === void 0 ? void 0 : _d.split(' ')[0]
                                }
                            }
                        }
                    ],
                },
                {
                    OR: [
                        {
                            author: {
                                lastName: {
                                    contains: (_e = query.author) === null || _e === void 0 ? void 0 : _e.split(' ')[0]
                                }
                            }
                        },
                        {
                            author: {
                                lastName: {
                                    contains: (_g = (_f = query.author) === null || _f === void 0 ? void 0 : _f.split(' ')[1]) !== null && _g !== void 0 ? _g : (_h = query.author) === null || _h === void 0 ? void 0 : _h.split(' ')[0]
                                }
                            }
                        }
                    ]
                }
            ]
        });
    }
    console.log(query);
    if (query.tags && query.tags.length != 0) {
        queries.push({
            tagList: {
                some: {
                    name: {
                        in: query.tags
                    }
                }
            },
        });
    }
    if (query.countries && query.countries.length != 0) {
        queries.push({
            countries: {
                some: {
                    name: {
                        in: query.countries
                    }
                }
            }
        });
    }
    return { AND: queries };
};
var disconnectArticlesTags = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        tagList: {
                            set: []
                        }
                    },
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var disconnectArticlesDestinations = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.article.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        countries: {
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
var getCommentsByArticle = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var comments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.articleComment.findMany({
                    where: {
                        article: { id: Number(id) },
                    },
                    select: comment_selector_1.default,
                })];
            case 1:
                comments = _a.sent();
                return [2 /*return*/, comments.map(function (comment) { return (0, comment_mapper_1.default)(comment); })];
        }
    });
}); };
exports.getCommentsByArticle = getCommentsByArticle;
var addComment = function (content, id, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var article, comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if ((0, primitive_checks_1.isNullOrUndefined)(content) || (0, primitive_checks_1.isEmptyString)(content)) {
                    throw new api_error_1.default(422, { message: "Comment can't be blank" });
                }
                return [4 /*yield*/, PrismaClient_1.default.article.findUnique({
                        where: {
                            id: Number(id)
                        },
                        select: {
                            id: true
                        },
                    })];
            case 1:
                article = _a.sent();
                return [4 /*yield*/, PrismaClient_1.default.articleComment.create({
                        data: {
                            body: content,
                            article: {
                                connect: { id: article === null || article === void 0 ? void 0 : article.id },
                            },
                            author: {
                                connect: { id: Number(userId) },
                            },
                        },
                        select: comment_selector_1.default,
                    })];
            case 2:
                comment = _a.sent();
                return [2 /*return*/, (0, comment_mapper_1.default)(comment)];
        }
    });
}); };
exports.addComment = addComment;
var deleteComment = function (commentId, userId, userRole) { return __awaiter(void 0, void 0, void 0, function () {
    var comment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.articleComment.findUnique({
                    where: {
                        id: Number(commentId)
                    },
                    select: {
                        author: {
                            select: {
                                id: true
                            }
                        }
                    }
                })];
            case 1:
                comment = _a.sent();
                if (comment.author.id !== userId && userRole != auth_service_1.ROLE.ADMIN) {
                    throw new api_error_1.default(403, { message: 'User is not comment owner!' });
                }
                return [4 /*yield*/, PrismaClient_1.default.articleComment.delete({
                        where: {
                            id: Number(commentId)
                        },
                    })];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteComment = deleteComment;
var getArticlesForAdmin = function (_a) {
    var search = _a.search, sortBy = _a.sortBy, order = _a.order, limit = _a.limit, page = _a.page;
    return __awaiter(void 0, void 0, void 0, function () {
        var activePage, totalArticlesCount, articles;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    activePage = (Number(page) - 1) * limit || 0;
                    return [4 /*yield*/, PrismaClient_1.default.article.count({
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
                    totalArticlesCount = _b.sent();
                    return [4 /*yield*/, PrismaClient_1.default.article.findMany(__assign(__assign(__assign(__assign(__assign(__assign({ where: {
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
                                comments: true,
                                author: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        picture: true
                                    }
                                },
                                favoritedBy: {
                                    select: {
                                        id: true,
                                    }
                                },
                            } }, (sortBy == 'date' && order != 'none' ? { orderBy: { createdAt: order } } : {})), (sortBy == 'likes' && order != 'none' ? { orderBy: { favoritedBy: { _count: order } } } : {})), (sortBy == 'comments' && order != 'none' ? { orderBy: { comments: { _count: order } } } : {})), (sortBy == 'author' && order != 'none' ? { orderBy: { author: { firstName: order } } } : {})), (sortBy == 'title' && order != 'none' ? { orderBy: { title: order } } : {})), { skip: activePage, take: Number(limit) }))];
                case 2:
                    articles = _b.sent();
                    return [2 /*return*/, {
                            articles: articles.map(function (article) { return ({
                                id: article.id,
                                title: article.title,
                                author: article.author.firstName,
                                date: article.createdAt,
                                likes: article.favoritedBy.length,
                                comments: article.comments.length,
                            }); }),
                            count: totalArticlesCount,
                        }];
            }
        });
    });
};
exports.getArticlesForAdmin = getArticlesForAdmin;
var getUsersQuery = function (search) {
    var _a, _b;
    return {
        OR: [
            {
                OR: [
                    {
                        author: {
                            firstName: {
                                contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    },
                    {
                        author: {
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
                        author: {
                            lastName: {
                                contains: search === null || search === void 0 ? void 0 : search.split(' ')[0]
                            }
                        }
                    },
                    {
                        author: {
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
//# sourceMappingURL=article.service.js.map