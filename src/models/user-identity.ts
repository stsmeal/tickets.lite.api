import {Schema, Document, model } from 'mongoose';

export interface IUserIdentity extends Document{
    username: string;
    hash: string;
    deleted: boolean;
}

const UserIdentitySchema = new Schema({
    username: {type: String},
    hash: {type: String},
    deleted: {type: Schema.Types.Boolean, default: false }
});

UserIdentitySchema.pre('find', function(){
    let userIdentity = this;
    userIdentity.where({deleted: false});
});

UserIdentitySchema.pre('findOne', function(){
    let userIdentity = this;
    userIdentity.where({deleted: false});
});

const UserIdentity = model<IUserIdentity>('UserIdentity', UserIdentitySchema, 'UserIdentities');

export default UserIdentity;