import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { IUserIdentity } from '../models/user-identity';
import { IUser } from '../models/user';
import * as config from '../config.json';
import { Context } from '../context/context';
import TYPES from '../constant/types';


@injectable()
export class AuthService {
    constructor(@inject(TYPES.Context) private context: Context) { }

    public async authenticate(username: string, password: string, site: string) {
        this.context.setSite(site);
        username = username.toLowerCase();
        let userIdentity = await this.context.UserIdentity.findOne({username: username});
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await this.context.User.findOne({username: username});
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async create(user: IUser, password: string) {
        this.context.setSite(user.site);
        user.username = user.username.toLowerCase();
        if(await this.context.User.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await this.context.UserIdentity.create(<IUserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        return await this.context.User.create(user);       
    }
}