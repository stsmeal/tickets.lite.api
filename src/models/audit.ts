import { Schema } from "mongoose";
import { IUser } from "./user";
import { next } from "inversify-express-utils";

export class IAudit {
    userCreated: IUser;
    dateCreated: Date;
    userUpdated: IUser;
    dateUpdated: Date;
    deleted: boolean;
}

const AuditSchema = new Schema({
    userCreated: {type: Schema.Types.ObjectId, ref: 'User'},
    dateCreated: {type: Schema.Types.Date},
    userUpdated: {type: Schema.Types.ObjectId, ref: 'User'},
    dateUpdated: {type: Schema.Types.Date},
    deleted: {type: Schema.Types.Boolean, default: false }
});

AuditSchema.pre('find', function() {
    let audit = this;
    audit.where({deleted: false});
});

AuditSchema.pre('findOne', function(){
    let audit = this;
    audit.where({deleted: false});
});


AuditSchema.pre('findOneAndRemove', function(){
    let audit = this;
    audit.where({deleted: false});
});


AuditSchema.pre('findOneAndUpdate', function(){
    let audit = this;
    audit.where({deleted: false});
});


export default AuditSchema;