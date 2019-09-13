"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserIdentitySchema = new mongoose_1.Schema({
    username: { type: String },
    hash: { type: String }
});
var UserIdentity = mongoose_1.model('UserIdentity', UserIdentitySchema, 'UserIdentities');
exports.default = UserIdentity;
//# sourceMappingURL=user-identity.js.map