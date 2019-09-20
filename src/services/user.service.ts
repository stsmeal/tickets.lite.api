import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import UserIdentity, { IUserIdentity } from '../models/user-identity';
import User, { IUser } from '../models/user';
import * as config from '../config.json';


@injectable()
export class UserService {
    constructor() {}

    public async authenticate(username: string, password: string) {
        username = username.toLowerCase();
        let userIdentity = await UserIdentity.findOne({username: username}).exec();
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await User.findOne({username: username}).exec();
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async getAll() {
        return await User.find({}).exec();
    }

    public async create(user: IUser, password: string) {
        user.username = user.username.toLowerCase();
        if(await User.findOne({username: user.username}).exec()){
            throw 'Username is Taken';
        }

        await UserIdentity.create(<IUserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        return await User.create(user);       
    }
}