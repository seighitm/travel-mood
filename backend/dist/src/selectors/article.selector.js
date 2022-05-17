"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articlesSelector = exports.articleSelector = void 0;
var client_1 = require("@prisma/client");
exports.articleSelector = client_1.Prisma.validator()({
    id: true,
    title: true,
    isUpdatedByAdmin: true,
    countries: true,
    description: true,
    body: true,
    createdAt: true,
    updatedAt: true,
    images: true,
    primaryImage: true,
    comments: {
        orderBy: {
            id: 'desc',
        },
        select: {
            author: {
                select: {
                    firstName: true,
                    lastName: true,
                    picture: true,
                    id: true,
                    gender: true,
                    followedBy: true
                },
            },
            id: true,
            body: true,
            createdAt: true,
        }
    },
    tagList: {
        select: {
            name: true,
        },
    },
    favoritedBy: true,
    author: {
        select: {
            id: true,
            picture: true,
            followedBy: true,
            gender: true,
            firstName: true,
            lastName: true,
        },
    },
    _count: {
        select: {
            favoritedBy: true,
        },
    },
});
exports.articlesSelector = client_1.Prisma.validator()({
    id: true,
    title: true,
    isUpdatedByAdmin: true,
    countries: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    primaryImage: true,
    comments: {
        select: {
            id: true
        }
    },
    tagList: {
        select: {
            name: true,
        },
    },
    favoritedBy: true,
    author: {
        select: {
            id: true,
            picture: true,
            followedBy: true,
            gender: true,
            firstName: true,
            lastName: true,
        },
    },
    _count: {
        select: {
            favoritedBy: true,
        },
    },
});
//# sourceMappingURL=article.selector.js.map