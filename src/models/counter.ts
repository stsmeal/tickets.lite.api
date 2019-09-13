import {Schema, Document, model } from 'mongoose';

export interface ICounter extends Document {
    name: string;
    count: number;
}

const CounterSchema = new Schema({
    name: {type: String, unique: true, required: true },
    count: {type: Number }
});


const Counter = model<ICounter>('Counter', CounterSchema, 'Counters');

export default Counter;