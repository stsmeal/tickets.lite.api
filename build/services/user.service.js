"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var inversify_1 = require("inversify");
var types_1 = require("../constant/types");
var client_1 = require("../utils/mongodb/client");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcryptjs_1 = require("bcryptjs");
var config = require("../config.json");
var user_identity_1 = require("../models/user-identity");
var user_1 = require("../models/user");
var UserService = (function () {
    function UserService(mongoClient) {
        this.mongoClient = mongoClient;
    }
    UserService.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdentity, _a, user, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        username = username.toLowerCase();
                        return [4, user_identity_1.default.findOne({ username: username }).exec()];
                    case 1:
                        userIdentity = _b.sent();
                        _a = userIdentity;
                        if (!_a) return [3, 3];
                        return [4, bcryptjs_1.compare(password, userIdentity.hash)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (!_a) return [3, 6];
                        return [4, user_1.default.findOne({ username: username }).exec()];
                    case 4:
                        user = _b.sent();
                        token = jsonwebtoken_1.sign(JSON.stringify(user), config.secret);
                        return [4, { user: user, token: token }];
                    case 5: return [2, _b.sent()];
                    case 6: throw 'Incorrect Username or Password';
                }
            });
        });
    };
    UserService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, user_1.default.find({}).exec()];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.create = function (user, password) {
        return __awaiter(this, void 0, void 0, function () {
            var userIdentity, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user.username = user.username.toLowerCase();
                        return [4, user_1.default.findOne({ username: user.username }).exec()];
                    case 1:
                        if (_b.sent()) {
                            throw 'Username is Taken';
                        }
                        userIdentity = new user_identity_1.default();
                        userIdentity.username = user.username;
                        _a = userIdentity;
                        return [4, bcryptjs_1.hash(password, 10)];
                    case 2:
                        _a.hash = _b.sent();
                        return [4, userIdentity.save()];
                    case 3:
                        _b.sent();
                        return [4, (new user_1.default(user)).save()];
                    case 4: return [2, _b.sent()];
                }
            });
        });
    };
    UserService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.MongoDBClient)),
        __metadata("design:paramtypes", [client_1.MongoDBClient])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map