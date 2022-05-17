"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commentMapper = function (comment) { return ({
    id: comment.id,
    createdAt: comment.createdAt,
    body: comment.body,
    author: {
        id: comment.author.id,
        firstName: comment.author.firstName,
        lastName: comment.author.lastName,
        gender: comment.author.gender,
        picture: comment.author.picture,
    }
}); };
exports.default = commentMapper;
//# sourceMappingURL=comment.mapper.js.map