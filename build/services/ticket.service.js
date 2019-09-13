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
var ticket_1 = require("../models/ticket");
var user_1 = require("../models/user");
var counter_1 = require("../models/counter");
var TicketService = (function () {
    function TicketService(mongoClient) {
        this.mongoClient = mongoClient;
    }
    TicketService.prototype.getTickets = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, ticket_1.default.find({})];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    TicketService.prototype.getTicket = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, ticket_1.default.findById(id)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    TicketService.prototype.saveTicket = function (ticket) {
        return __awaiter(this, void 0, void 0, function () {
            var counter, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!ticket._id || !ticket.number)) return [3, 5];
                        return [4, counter_1.default.findOne({ name: 'tickets' }).exec()];
                    case 1:
                        counter = _b.sent();
                        if (!!counter) return [3, 3];
                        ticket.number = 1;
                        return [4, counter_1.default.create({ name: 'tickets', count: 1 })];
                    case 2:
                        _b.sent();
                        return [3, 5];
                    case 3:
                        counter.count += 1;
                        ticket.number = counter.count;
                        return [4, counter_1.default.findOneAndUpdate({ name: 'tickets' }, { count: counter.count })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!ticket.userCreated) return [3, 7];
                        _a = ticket;
                        return [4, user_1.default.findById(ticket.userCreated._id)];
                    case 6:
                        _a.userCreated = _b.sent();
                        _b.label = 7;
                    case 7:
                        if (!!ticket._id) return [3, 9];
                        return [4, ticket_1.default.create(ticket)];
                    case 8: return [2, _b.sent()];
                    case 9: return [4, ticket_1.default.findByIdAndUpdate(ticket._id, ticket)];
                    case 10:
                        _b.sent();
                        return [4, ticket_1.default.findById(ticket._id)];
                    case 11: return [2, _b.sent()];
                }
            });
        });
    };
    TicketService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.default.MongoDBClient)),
        __metadata("design:paramtypes", [client_1.MongoDBClient])
    ], TicketService);
    return TicketService;
}());
exports.TicketService = TicketService;
//# sourceMappingURL=ticket.service.js.map