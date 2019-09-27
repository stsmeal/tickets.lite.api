import {Schema, Document } from 'mongoose';
import AuditSchema, { Audit } from './audit';

export interface MasterEmail extends Document, Audit {
    site: string;
    firstname: string;
    lastname: string;
    company: string;
}

const MasterEmailSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    firstname: { type: String },
    lastname: { type: String },
    company: { type: String }
});

MasterEmailSchema.add(AuditSchema);

export default MasterEmailSchema;