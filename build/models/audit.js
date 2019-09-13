"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var IAudit = (function () {
    function IAudit() {
    }
    return IAudit;
}());
exports.IAudit = IAudit;
var AuditSchema = new mongoose_1.Schema({
    userCreated: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: { type: mongoose_1.Schema.Types.Date },
    userUpdated: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dateUpdated: { type: mongoose_1.Schema.Types.Date },
});
exports.default = AuditSchema;
//# sourceMappingURL=audit.js.map