"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var profileMapper = function (profile, userId) { return ({
    id: profile.id,
    picture: profile.picture,
    firstName: profile.firstName,
    lastName: profile.lastName,
    following: userId
        ? profile === null || profile === void 0 ? void 0 : profile.followedBy.some(function (followingUser) { return followingUser.id === userId; })
        : false,
}); };
exports.default = profileMapper;
//# sourceMappingURL=profile.mapper.js.map