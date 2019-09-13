"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var CounterSchema = new mongoose_1.Schema({
    name: { type: String, unique: true, required: true },
    count: { type: Number }
});
var Counter = mongoose_1.model('Counter', CounterSchema, 'Counters');
exports.default = Counter;
//# sourceMappingURL=counter.js.map