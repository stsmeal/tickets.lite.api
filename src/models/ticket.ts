import {Schema, Document, model } from 'mongoose';
import { Note } from './note';
import { User } from './user';
import { Asset } from './asset';
import AuditSchema, { Audit } from './audit';
import { LaborCharge } from './labor-charge';

export interface Ticket extends Audit, Document{
    number: number;
    description: string;
    status: number;
    category: number;
    dateCompleted: Date;
    notes: Note[];
    laborCharges: LaborCharge[];
    assignments: User[];
    assets: Asset[];
}

const TicketSchema = new Schema({
    number: {type: Number, unique: true, required: true},
    description: {type: String},
    status: {type: Number},
    category: {type: Number},
    dateCompleted: {type: Date},
    notes: [{type: Object}],
    laborCharges: [{type: Schema.Types.ObjectId, ref: 'LaborCharge'}],
    assignments: [{type: Schema.Types.ObjectId, ref: 'User'}],
    assets: [{type: Schema.Types.ObjectId, ref: 'Asset'}]
});

TicketSchema.add(AuditSchema);

export default TicketSchema;