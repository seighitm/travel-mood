"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var tag_controller_1 = __importDefault(require("../controllers/tag.controller"));
var article_controller_1 = __importDefault(require("../controllers/article.controller"));
var auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
var profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
var chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
var message_controller_1 = __importDefault(require("../controllers/message.controller"));
var user_controller_1 = __importDefault(require("../controllers/user.controller"));
var file_upload_controller_1 = __importDefault(require("../controllers/file-upload.controller"));
var trip_controller_1 = __importDefault(require("../controllers/trip.controller"));
var map_controller_1 = __importDefault(require("../controllers/map.controller"));
var base_controller_1 = __importDefault(require("../controllers/base.controller"));
var api = (0, express_1.Router)()
    .use(tag_controller_1.default)
    .use(article_controller_1.default)
    .use(profile_controller_1.default)
    .use(auth_controller_1.default)
    .use(chat_controller_1.default)
    .use(base_controller_1.default)
    .use(message_controller_1.default)
    .use(user_controller_1.default)
    .use(file_upload_controller_1.default)
    .use(trip_controller_1.default)
    .use(map_controller_1.default);
exports.default = (0, express_1.Router)().use('/api', api);
//# sourceMappingURL=routes.js.map