import {Schema, Document, model } from 'mongoose';
import { Note } from './note';
import { IUser } from './user';
import { IAsset } from './asset';
import AuditSchema, { IAudit } from './audit';
import { ILaborCharge } from './labor-charge';

export interface ITicket extends IAudit, Document{
    number: number;
    description: string;
    status: number;
    category: number;
    dateCompleted: Date;
    notes: Note[];
    laborCharges: ILaborCharge[];
    assignments: IUser[];
    assets: IAsset[];
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

const Ticket = model<ITicket>('Ticket', TicketSchema, 'Tickets');

export default Ticket;