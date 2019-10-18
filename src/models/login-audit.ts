import {Schema, Document } from 'mongoose';
import AuditSchema, { Audit } from './audit';
import { User } from './user';

export interface LoginAudit extends Audit, Document {
    user: User;
    time: Date;
}

const LoginAuditSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    time: {type: Schema.Types.Date},
});

LoginAuditSchema.add(AuditSchema);

export default LoginAuditSchema;