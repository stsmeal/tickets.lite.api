/*
export class User{
    username: string;
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    dateCreated: Date;
    role: string;
    phone: string;
    theme: string;
}
*/
import {Schema, Document, model } from 'mongoose';

export interface IUser extends Document{
    username: string;
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

const User = model<IUser>('User', UserSchema, 'Users');


export default User;