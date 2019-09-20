/*
import { Audit } from "./audit";
import { Note } from "./note";

export class Asset extends Audit {
    number: string;
    description: string;
    notes: Note[];
}
*/

import {Schema, Document, model} from 'mongoose';
import AuditSchema, { IAudit } from './audit';

export interface IAsset extends IAudit, Document {
    number: string;
    description: string;
    status: number;
    category: number;
}

const AssetSchema = new Schema({
    number: {type: Schema.Types.String, unique: true, required: true},
    status: {type: Number},
    category: {type: Number},
    description: {type: Schema.Types.String},
    notes: [{type: Object}]
});

AssetSchema.add(AuditSchema);

const Asset = model<IAsset>('Asset', AssetSchema, 'Inventory');
let asset = new Asset();

export default Asset;