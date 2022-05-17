"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var commentSelector = client_1.Prisma.validator()({
    id: true,
    createdAt: true,
    body: true,
    author: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
            gender: true,
        },
    },
});
exports.default = commentSelector;
//# sourceMappingURL=comment.selector.js.map