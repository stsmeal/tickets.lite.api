import {Schema, Document, model } from 'mongoose';
import { User } from './user';
import AuditSchema, { Audit } from './audit';

export interface LaborCharge extends Audit, Document{
    number: number;
    description: string;
    type: number;
    dateStarted: Date;
    dateEnded: Date;
    rate: number;
    assignment: User;
}

const LaborChargeSchema = new Schema({
    description: {type: String},
    type: {type: Number},
    dateStarted: {type: Date},
    dateEnded: {type: Date},
    rate: {type: Number},
    assignment: {type: Schema.Types.ObjectId, ref: 'User'}
});

LaborChargeSchema.add(AuditSchema);

export default LaborChargeSchema;