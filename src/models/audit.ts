import { Schema } from "mongoose";
import { IUser } from "./user";

export class IAudit {
    userCreated: IUser;
    dateCreated: Date;
    userUpdated: IUser;
    dateUpdated: Date;
}

const AuditSchema = new Schema({
    userCreated: {type: Schema.Types.ObjectId, ref: 'User'},
    dateCreated: {type: Schema.Types.Date},
    userUpdated: {type: Schema.Types.ObjectId, ref: 'User'},
    dateUpdated: {type: Schema.Types.Date},
});

export default AuditSchema;