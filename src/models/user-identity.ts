import {Schema, Document, model } from 'mongoose';

export interface UserIdentity extends Document{
    username: string;
    hash: string;
    deleted: boolean;
}

const UserIdentitySchema = new Schema({
    username: {type: String, unique: true, lowercase: true},
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

export default UserIdentitySchema;