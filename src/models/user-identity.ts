import {Schema, Document, model } from 'mongoose';

export interface IUserIdentity extends Document{
    username: string;
    hash: string;
}

const UserIdentitySchema = new Schema({
    username: {type: String},
    hash: {type: String}
});

const UserIdentity = model<IUserIdentity>('UserIdentity', UserIdentitySchema, 'UserIdentities');

export default UserIdentity;