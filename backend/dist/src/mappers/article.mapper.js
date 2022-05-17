"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesMapper = exports.articleMapper = void 0;
var author_mapper_1 = __importDefault(require("./author.mapper"));
var articleMapper = function (article, id) { return ({
    id: article.id,
    isUpdatedByAdmin: article.isUpdatedByAdmin,
    title: article.title,
    countries: article.countries,
    description: article.description,
    body: article.body,
    primaryImage: article.primaryImage,
    images: article.images,
    comments: article.comments,
    tagList: article.tagList.map(function (tag) { return tag.name; }),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favoritedBy: article.favoritedBy,
    favorited: article.favoritedBy.some(function (item) { return item.id === Number(id); }),
    favoritesCount: article.favoritedBy.length,
    author: (0, author_mapper_1.default)(article.author, id),
}); };
exports.articleMapper = articleMapper;
var articlesMapper = function (article, id) { return ({
    id: article.id,
    title: article.title,
    isUpdatedByAdmin: article.isUpdatedByAdmin,
    countries: article.countries,
    description: article.description,
    primaryImage: article.primaryImage,
    comments: article.comments,
    tagList: article.tagList.map(function (tag) { return tag.name; }),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favoritedBy: article.favoritedBy,
    favorited: article.favoritedBy.some(function (item) { return item.id === Number(id); }),
    favoritesCount: article.favoritedBy.length,
    author: (0, author_mapper_1.default)(article.author, id),
}); };
exports.articlesMapper = articlesMapper;
//# sourceMappingURL=article.mapper.js.map