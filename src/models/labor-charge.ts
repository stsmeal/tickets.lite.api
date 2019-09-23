import {Schema, Document, model } from 'mongoose';
import { IUser } from './user';
import AuditSchema, { IAudit } from './audit';

export interface ILaborCharge extends IAudit, Document{
    number: number;
    description: string;
    type: number;
    dateStarted: Date;
    dateEnded: Date;
    rate: number;
    assignment: IUser;
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

const LaborCharge = model<ILaborCharge>('LaborCharge', LaborChargeSchema, 'LaborCharges');

export default LaborCharge;