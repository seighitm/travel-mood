"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var asyncHandler_1 = require("../utils/asyncHandler");
var base_service_1 = require("../services/base.service");
var router = (0, express_1.Router)();
// GET ALL LANGUAGES
router.get('/info/languages', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var languages;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.getAllLanguages)()];
            case 1:
                languages = _a.sent();
                res.json(languages);
                return [2 /*return*/];
        }
    });
}); }));
// GET ALL Transports
router.get('/info/transports', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var transports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.getAllTransports)()];
            case 1:
                transports = _a.sent();
                res.json(transports);
                return [2 /*return*/];
        }
    });
}); }));
// GET ALL LOCATIONS
router.get('/info/countries', [auth_middleware_1.authM.optional], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var countries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.getAllCountries)()];
            case 1:
                countries = _a.sent();
                res.json(countries);
                return [2 /*return*/];
        }
    });
}); }));
// Create language
router.post('/info/languages', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var languages;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.addNewLanguage)((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.languages) === null || _b === void 0 ? void 0 : _b.languages)];
            case 1:
                languages = _c.sent();
                res.json(languages);
                return [2 /*return*/];
        }
    });
}); }));
router.delete('/info/languages', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var languages;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.deleteLanguages)((_a = req.body) === null || _a === void 0 ? void 0 : _a.languages)];
            case 1:
                languages = _b.sent();
                res.json(languages);
                return [2 /*return*/];
        }
    });
}); }));
// Create countries
router.post('/info/countries', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var countries;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.addNewCountry)((_a = req.body) === null || _a === void 0 ? void 0 : _a.countries)];
            case 1:
                countries = _b.sent();
                res.json(countries);
                return [2 /*return*/];
        }
    });
}); }));
// Delete countries
router.delete('/info/countries', [auth_middleware_1.authM.required], (0, asyncHandler_1.asyncHandler)(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var countries;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, base_service_1.deleteCountries)((_a = req.body) === null || _a === void 0 ? void 0 : _a.countries)];
            case 1:
                countries = _b.sent();
                res.json(countries);
                return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
//# sourceMappingURL=base.controller.js.map