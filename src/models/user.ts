import {Schema, Document } from 'mongoose';

export interface User extends Document{
    username: string;
    site: string;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    status: number;
    trade: number;
    dateCreated: Date;
    role: string;
    phone: string;
    theme: string;
    deleted: boolean;
}

const UserSchema = new Schema({
    username: {type: String, unique: true, lowercase: true},
    site: {type: String, required: true, lowercase: true },
    firstname: {type: String},
    middlename: {type: String},
    lastname: {type: String},
    email: {type: String},
    status: {type: Number},
    trade: {type: Number},
    dateCreated: {type: Date},
    role: {type: String},
    phone: {type: String},
    theme: {type: String},
    deleted: {type: Schema.Types.Boolean, default: false }
});

UserSchema.pre('find', function(){
    let user = this;
    user.where({deleted: false});
});

export default UserSchema;



