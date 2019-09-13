"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var types_1 = require("../constant/types");
var client_1 = require("../utils/mongodb/client");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcryptjs_1 = require("bcryptjs");
var config = require("../config.json");
var UserService = (function () {
    function UserService(mongoClient) {
        this.mongoClient = mongoClient;
    }
    UserService.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var reg, user, _a, hash_1, userNoHash, token;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        reg = new RegExp('^' + username + '$', 'i');
                        return [4, this.mongoClient.findOneAsync('user', { username: reg })];
                    case 1:
                        user = (_b.sent());
                        _a = user;
                        if (!_a) return [3, 3];
                        return [4, bcryptjs_1.compare(password, user.hash)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (!_a) return [3, 5];
                        hash_1 = user.hash, userNoHash = __rest(user, ["hash"]);
                        token = jsonwebtoken_1.sign(JSON.stringify(user), config.secret);
                        return [4, __assign({}, userNoHash, { token: token })];
                    case 4: return [2, _b.sent()];
                    case 5: throw 'User invalid';
                }
            });
        });
    };
    UserService.prototype.getAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.mongoClient.findAsync('user', {})];
                    case 1:
                        users = (_a.sent());
                        users.forEach(function (u) { return u = _this.formatUser(u); });
                        return [4, users];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.create = function (user, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user.username = user.username.toLowerCase();
                        return [4, this.mongoClient.findOneAsync('user', { username: user.username })];
                    case 1:
                        if (_c.sent()) {
                            throw 'Username is taken';
                        }
                        _a = user;
                        return [4, bcryptjs_1.hash(password, 10)];
                    case 2:
                        _a.hash = _c.sent();
                        _b = this.formatUser;
                        return [4, this.mongoClient.insertAsync('user', user)];
                    case 3:
                        user = _b.apply(this, [_c.sent()]);
                        return [4, user];
                    case 4: return [2, _c.sent()];
                }
            });
        });
    };
    UserService.prototype.formatUser = function (user) {
        var hash = user.hash, noHashUser = __rest(user, ["hash"]);
        return __assign({}, noHashUser);
    };
    UserService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.MongoDBClient)),
        __metadata("design:paramtypes", [client_1.MongoDBClient])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.js.map