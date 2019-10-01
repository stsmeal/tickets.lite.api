import {Schema, Document } from 'mongoose';
import AuditSchema, { Audit } from './audit';

export interface Asset extends Audit, Document {
    number: string;
    description: string;
    status: number;
    category: number;
    lifeExpectancy: number;
    lifeExpectancyScale: number;
    installDate: Date;
    condition: number;
    retiredDate: Date;
}

const AssetSchema = new Schema({
    number: {type: Schema.Types.String, unique: true, required: true},
    status: {type: Number},
    category: {type: Number},
    description: {type: Schema.Types.String},
    notes: [{type: Object}],
    lifeExpectancy: {type: Number},
    lifeExpectancyScale: {type: Number},
    installDate: {type: Date},
    condition: {type: Number},
    retiredDate: {type: Date}
});

export default AssetSchema;