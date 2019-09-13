"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var audit_1 = require("./audit");
var AssetSchema = new mongoose_1.Schema({
    number: { type: mongoose_1.Schema.Types.String, unique: true, required: true },
    status: { type: Number },
    category: { type: Number },
    description: { type: mongoose_1.Schema.Types.String },
    notes: [{ type: Object }]
});
AssetSchema.add(audit_1.default);
var Asset = mongoose_1.model('Asset', AssetSchema, 'Inventory');
exports.default = Asset;
//# sourceMappingURL=asset.js.map