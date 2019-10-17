import {Schema, Document } from 'mongoose';
import AuditSchema, { Audit } from './audit';

export interface Tenant extends Document, Audit{
    site: string;
    companyName: string;
    description: string;
    address1: string;
    address2: string;
    state: string;
    zipcode: string;
    country: string;
    accountOwnerFirstname: string;
    accountOwnerLastname: string;
    accountOwnerEmail: string;
    accountActive: boolean;
    dbName: string;
    server: string;
    port: number;
}

const TenantSchema = new Schema({
    site: { type: String, required: true, unique: true },
    companyName: { type: String },
    description: { type: String },
    address1: { type: String },
    address2: { type: String },
    state: { type: String },
    zipcode: { type: String },
    country: { type: String },
    accountOwnerFirstname: { type: String },
    accountOwnerLastname: { type: String },
    accountOwnerEmail: { type: String },
    accountActive: { type: Boolean },
    dbName: { type: String },
    server: { type: String },
    port: { type: Number }
});

TenantSchema.add(AuditSchema);

export default TenantSchema;