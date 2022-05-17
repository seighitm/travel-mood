"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleCreateOrUpdateValidator = void 0;
var primitive_checks_1 = require("../utils/primitive-checks");
var api_error_1 = __importDefault(require("../utils/api-error"));
var constants_1 = require("../utils/constants");
var ArticleCreateOrUpdateValidator = function (_a) {
    var title = _a.title, description = _a.description, body = _a.body, countries = _a.countries;
    if ((0, primitive_checks_1.isNullOrUndefined)(title)) {
        throw new api_error_1.default(422, { message: "Title can't be blank" });
    }
    else if ((0, primitive_checks_1.isShortStringThan)(title, constants_1.ARTICLE_TITLE_MIN_LENGTH)) {
        throw new api_error_1.default(422, { message: "Title should have at least 3 letters!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(description)) {
        throw new api_error_1.default(422, { message: "Description can't be blank" });
    }
    else if ((0, primitive_checks_1.isShortStringThan)(description, constants_1.ARTICLE_DESCRIPTION_MIN_LENGTH)) {
        throw new api_error_1.default(422, { message: "Description should have at least 8 letters!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(body)) {
        throw new api_error_1.default(422, { message: "Content can't be blank" });
    }
    else if ((0, primitive_checks_1.isShortStringThan)(body, constants_1.ARTICLE_BODY_MIN_LENGTH)) {
        throw new api_error_1.default(422, { message: "Content should have at least 30 letters!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(countries) || (0, primitive_checks_1.isEmptyString)(countries)) {
        throw new api_error_1.default(422, { message: "Add at least one country!" });
    }
};
exports.ArticleCreateOrUpdateValidator = ArticleCreateOrUpdateValidator;
//# sourceMappingURL=article.validator.js.map