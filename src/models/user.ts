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
import { ObjectID } from 'bson';

export interface IUser extends Document{
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

const UserSchema = new Schema({
    username: {type: String},
    firstname: {type: String},
    middlename: {type: String},
    lastname: {type: String},
    email: {type: String},
    dateCreated: {type: Date},
    role: {type: String},
    phone: {type: String},
    theme: {type: String}
});

const User = model<IUser>('User', UserSchema, 'Users');
let user = new User();

export default User;