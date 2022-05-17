"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabaseScript = void 0;
var PrismaClient_1 = __importDefault(require("../../prisma/PrismaClient"));
var graceful_fs_1 = __importDefault(require("graceful-fs"));
var path = __importStar(require("path"));
var base_service_1 = require("../services/base.service");
var initDatabaseScript = function () { return __awaiter(void 0, void 0, void 0, function () {
    var countLanguages, data, array_1, err_1, countCountries, data, err_2, countRoles, countGender, relationshipStatusCount, transportsCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(__dirname);
                console.log('__dirname');
                return [4 /*yield*/, PrismaClient_1.default.language.count()];
            case 1:
                countLanguages = _a.sent();
                if (!(countLanguages <= 10)) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                data = graceful_fs_1.default.readFileSync(path.resolve(__dirname, '..', 'assets', 'languages.json'), 'utf8');
                array_1 = [];
                Object.entries(JSON.parse(data)).forEach(function (entry) { return array_1.push(entry[1].name); });
                return [4 /*yield*/, (0, base_service_1.addNewLanguage)(__spreadArray([], array_1, true))];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, PrismaClient_1.default.countries.count()];
            case 6:
                countCountries = _a.sent();
                if (!(countCountries <= 10)) return [3 /*break*/, 10];
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                data = graceful_fs_1.default.readFileSync(path.resolve(__dirname, '..', 'assets', 'data_json.json'), 'utf8');
                return [4 /*yield*/, (0, base_service_1.addNewCountry)(JSON.parse(data))];
            case 8:
                _a.sent();
                return [3 /*break*/, 10];
            case 9:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 10];
            case 10: return [4 /*yield*/, PrismaClient_1.default.role.count()];
            case 11:
                countRoles = _a.sent();
                if (!(countRoles != 2)) return [3 /*break*/, 13];
                return [4 /*yield*/, PrismaClient_1.default.role.createMany({
                        data: [
                            { role: 'ADMIN' },
                            { role: 'USER' }
                        ],
                        skipDuplicates: true
                    })];
            case 12:
                _a.sent();
                _a.label = 13;
            case 13: return [4 /*yield*/, PrismaClient_1.default.gender.count()];
            case 14:
                countGender = _a.sent();
                if (!(countGender != 6)) return [3 /*break*/, 16];
                return [4 /*yield*/, PrismaClient_1.default.gender.createMany({
                        data: [
                            { gender: 'MALE' },
                            { gender: 'FEMALE' },
                            { gender: 'OTHER' },
                            { gender: 'MALE_GROUP' },
                            { gender: 'FEMALE_GROUP' },
                            { gender: 'ANY' }
                        ],
                        skipDuplicates: true
                    })];
            case 15:
                _a.sent();
                _a.label = 16;
            case 16: return [4 /*yield*/, PrismaClient_1.default.relationshipStatus.count()];
            case 17:
                relationshipStatusCount = _a.sent();
                if (!(relationshipStatusCount != 2)) return [3 /*break*/, 19];
                return [4 /*yield*/, PrismaClient_1.default.relationshipStatus.createMany({
                        data: [
                            { status: 'SINGLE' },
                            { status: 'IN_RELATION' },
                        ],
                        skipDuplicates: true
                    })];
            case 18:
                _a.sent();
                _a.label = 19;
            case 19: return [4 /*yield*/, PrismaClient_1.default.transport.count()];
            case 20:
                transportsCount = _a.sent();
                if (!(transportsCount == 0)) return [3 /*break*/, 22];
                return [4 /*yield*/, PrismaClient_1.default.transport.createMany({
                        data: [
                            { name: 'CAR' },
                            { name: 'PLANE' },
                        ],
                        skipDuplicates: true
                    })];
            case 21:
                _a.sent();
                _a.label = 22;
            case 22: return [2 /*return*/];
        }
    });
}); };
exports.initDatabaseScript = initDatabaseScript;
//# sourceMappingURL=init.js.map