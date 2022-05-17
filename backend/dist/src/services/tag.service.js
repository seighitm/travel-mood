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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTag = exports.getOneTag = exports.getTags = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var primitive_checks_1 = require("../utils/primitive-checks");
var getTags = function (query) { return __awaiter(void 0, void 0, void 0, function () {
    var queries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queries = [];
                if (!(0, primitive_checks_1.isNullOrUndefined)(query.tagName) && !(0, primitive_checks_1.isEmptyArray)(query.tagName)) {
                    queries.push({
                        name: {
                            contains: query.tagName
                        }
                    });
                }
                return [4 /*yield*/, PrismaClient_1.default.tag.findMany({
                        where: {
                            AND: queries
                        },
                        select: {
                            id: true,
                            name: true,
                            _count: true
                        },
                        orderBy: {
                            articles: {
                                _count: 'desc',
                            },
                        },
                    })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getTags = getTags;
var getOneTag = function (tageName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.tag.findUnique({
                    where: {
                        name: tageName
                    },
                    select: {
                        id: true,
                    },
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.getOneTag = getOneTag;
var deleteTag = function (tagsName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, PrismaClient_1.default.tag.deleteMany({
                    where: {
                        name: {
                            in: tagsName
                        }
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteTag = deleteTag;
//# sourceMappingURL=tag.service.js.map