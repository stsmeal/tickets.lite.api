import {Schema, Document } from 'mongoose';
import AuditSchema, { Audit } from './audit';
import { User } from './user';

export interface ApiRequest extends Audit, Document {
    headers: Object;
    body: string;
    url: string;
    ip: string;
    protocol: string;
    httpVersion: string;
    user: User;
    path: string;
    method: string;
}

const ApiRequestSchema = new Schema({
    headers: {type: Object},
    body: {type: String},
    url: {type: String},
    ip: {type: String},
    protocol: {type: String},
    httpVersion: {type: String},
    user: {type: Object},
    path: {type: String},
    method: {type: String},
});

ApiRequestSchema.add(AuditSchema);

export default ApiRequestSchema;