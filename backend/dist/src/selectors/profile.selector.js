"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var profileSelector = client_1.Prisma.validator()({
    id: true,
    picture: true,
    firstName: true,
    lastName: true,
    followedBy: {
        select: {
            id: true,
            followedBy: true,
            following: true,
            picture: true
        },
    },
});
exports.default = profileSelector;
//# sourceMappingURL=profile.selector.js.map