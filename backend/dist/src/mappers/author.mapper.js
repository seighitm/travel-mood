"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authorMapper = function (author, userId) { return ({
    id: author.id,
    picture: author.picture,
    firstName: author.firstName,
    lastName: author.lastName,
    gender: author.gender,
    following: author.followedBy.some(function (follow) { return follow.id === userId; }),
}); };
exports.default = authorMapper;
//# sourceMappingURL=author.mapper.js.map