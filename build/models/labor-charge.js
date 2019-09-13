"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var audit_1 = require("./audit");
var LaborChargeSchema = new mongoose_1.Schema({
    description: { type: String },
    type: { type: Number },
    dateStarted: { type: Date },
    dateEnded: { type: Date },
    rate: { type: Number },
    assignment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    assets: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Asset' }]
});
LaborChargeSchema.add(audit_1.default);
var LaborCharge = mongoose_1.model('LaborCharge', LaborChargeSchema, 'LaborCharges');
exports.default = LaborCharge;
//# sourceMappingURL=labor-charge.js.map