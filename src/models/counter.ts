import {Schema, Document } from 'mongoose';

export interface Counter extends Document {
    name: string;
    count: number;
}

const CounterSchema = new Schema({
    name: {type: String, unique: true, required: true },
    count: {type: Number }
});

export default CounterSchema;