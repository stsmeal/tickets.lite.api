"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    username: { type: String },
    firstname: { type: String },
    middlename: { type: String },
    lastname: { type: String },
    email: { type: String },
    dateCreated: { type: Date },
    role: { type: String },
    phone: { type: String },
    theme: { type: String }
});
var User = mongoose_1.model('User', UserSchema, 'Users');
exports.default = User;
//# sourceMappingURL=user.js.map