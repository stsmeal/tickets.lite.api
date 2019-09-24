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
        let userIdentity = await UserIdentity.findOne({username: username});
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await User.findOne({username: username});
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async getAll() {
        return await User.find({});
    }

    public async get(id: string) {
        return await User.findById(id);
    }

    public async create(user: IUser, password: string) {
        user.username = user.username.toLowerCase();
        if(await User.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await UserIdentity.create(<IUserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        return await User.create(user);       
    }

    public async update(user: IUser) {
        let oldUser = await User.findById(user._id);
        let userIdentity = await UserIdentity.findOne({username: oldUser.username});

        if(userIdentity.username != user.username.toLowerCase()){
            userIdentity.username = user.username;
            await UserIdentity.findByIdAndUpdate(userIdentity._id, userIdentity);;
        }

        await User.findByIdAndUpdate(user._id, user);
        return await User.findById(user._id);
    }
    
    public async delete(id: string) {
        let user =  await User.findById(id);
        let userIdentity = await UserIdentity.findOne({username: user.username});
        user.deleted = true;
        userIdentity.deleted = true;
        await UserIdentity.findByIdAndUpdate(userIdentity._id, userIdentity);;

        return await User.findByIdAndUpdate(user._id, user);;
    }

    public async quickSearch(searchText: string){
        let aggregate = (await User.aggregate([{
            $project: { fullname: { $concat: ["$lastname", ", ", "$firstname"]}}
        },{
            $match: { fullname: new RegExp(`^${searchText}`, 'i')}
        }]).limit(25)).map(u => u._id);

        let users = await User.find({_id: {$in: aggregate}}).sort({lastname: 1, firstname: 1});

        return await users;
    }
}