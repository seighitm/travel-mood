"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordValidator = exports.mailValidator = exports.UserPayloadValidator = void 0;
var primitive_checks_1 = require("../utils/primitive-checks");
var api_error_1 = __importDefault(require("../utils/api-error"));
var GENDER_ENUM;
(function (GENDER_ENUM) {
    GENDER_ENUM["FEMALE"] = "FEMALE";
    GENDER_ENUM["MALE"] = "MALE";
    GENDER_ENUM["OTHER"] = "OTHER";
    GENDER_ENUM["MALE_GROUP"] = "MALE_GROUP";
    GENDER_ENUM["FEMALE_GROUP"] = "FEMALE_GROUP";
    GENDER_ENUM["ANY"] = "ANY";
})(GENDER_ENUM || (GENDER_ENUM = {}));
var UserPayloadValidator = function (_a) {
    var gender = _a.gender, birthday = _a.birthday, languages = _a.languages;
    if (!(0, primitive_checks_1.isNullOrUndefined)(primitive_checks_1.isNullOrUndefined) && (GENDER_ENUM[gender] == undefined)) {
        throw new api_error_1.default(422, { message: 'Wrong Gender format!' });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(languages) || (0, primitive_checks_1.isEmptyArray)(languages)) {
        throw new api_error_1.default(422, { message: 'You did not enter any language!' });
    }
    if (!(0, primitive_checks_1.isNullOrUndefined)(birthday) && (new Date().getTime() < new Date(birthday).getTime())) {
        throw new api_error_1.default(422, { message: 'Birthday is incorrect!' });
    }
};
exports.UserPayloadValidator = UserPayloadValidator;
var mailValidator = function (email) {
    if ((0, primitive_checks_1.isNullOrUndefined)(email)) {
        throw new api_error_1.default(404, { message: 'You did not enter your email!' });
    }
    else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
        throw new api_error_1.default(422, { message: 'Invalid email format!' });
    }
};
exports.mailValidator = mailValidator;
var passwordValidator = function (password) {
    if ((0, primitive_checks_1.isNullOrUndefined)(password)) {
        throw new api_error_1.default(404, { message: 'You did not enter your password!' });
    }
    else if (!(0, primitive_checks_1.isNullOrUndefined)(password) && (0, primitive_checks_1.isShortStringThan)(password, 8)) {
        throw new api_error_1.default(404, { message: 'Password should have at least 8 letters!' });
    }
};
exports.passwordValidator = passwordValidator;
//# sourceMappingURL=user.validator.js.map