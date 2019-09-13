"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var audit_1 = require("./audit");
var TicketSchema = new mongoose_1.Schema({
    number: { type: Number, unique: true, required: true },
    description: { type: String },
    status: { type: Number },
    category: { type: Number },
    dateCompleted: { type: Date },
    notes: [{ type: Object }],
    laborCharges: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'LaborCharge' }],
    assignments: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    assets: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Asset' }]
});
TicketSchema.add(audit_1.default);
var Ticket = mongoose_1.model('Ticket', TicketSchema, 'Tickets');
exports.default = Ticket;
//# sourceMappingURL=ticket.js.map