"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSelector = void 0;
var client_1 = require("@prisma/client");
exports.userSelector = client_1.Prisma.validator()({
    email: true,
    firstName: true,
    lastName: true,
    picture: true,
});
exports.default = exports.userSelector;
//# sourceMappingURL=user.selector.js.map