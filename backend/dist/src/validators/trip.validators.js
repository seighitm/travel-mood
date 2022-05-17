"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripPayloadValidator = void 0;
var primitive_checks_1 = require("../utils/primitive-checks");
var api_error_1 = __importDefault(require("../utils/api-error"));
var TripPayloadValidator = function (_a) {
    var title = _a.title, description = _a.description, languages = _a.languages, countries = _a.countries;
    if ((0, primitive_checks_1.isNullOrUndefined)(title)) {
        throw new api_error_1.default(422, { message: "Title can't be blank" });
    }
    else if ((0, primitive_checks_1.isShortStringThan)(title, 5)) {
        throw new api_error_1.default(422, { message: "Title should have at least 8 letters!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(description)) {
        throw new api_error_1.default(422, { message: "Description can't be blank" });
    }
    else if ((0, primitive_checks_1.isShortStringThan)(description, 8)) {
        throw new api_error_1.default(422, { message: "Description should have at least 8 letters!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(countries) || (0, primitive_checks_1.isEmptyArray)(countries)) {
        throw new api_error_1.default(422, { message: "Add at least one country!" });
    }
    if ((0, primitive_checks_1.isNullOrUndefined)(languages) || (0, primitive_checks_1.isEmptyArray)(languages)) {
        throw new api_error_1.default(422, { message: "Add at least one language!" });
    }
};
exports.TripPayloadValidator = TripPayloadValidator;
//# sourceMappingURL=trip.validators.js.map