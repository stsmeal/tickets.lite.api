import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { hash } from 'bcryptjs';
import { UserIdentity } from '../models/user-identity';
import { User } from '../models/user';
import { Context } from '../context/context';
import { QueryCriteria } from '../models/query';


@injectable()
export class UserService {
    constructor(@inject(TYPES.Context) private context: Context) {}

    public async getAll() {
        return await this.context.User.find({});
    }

    public async get(id: string) {
        return await this.context.User.findById(id);
    }

    public async create(user: User, password: string) {
        user.username = user.username.toLowerCase();
        if(await this.context.User.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await this.context.UserIdentity.create(<UserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        return await this.context.User.create(user);       
    }

    public async update(user: User) {
        let oldUser = await this.context.User.findById(user._id);
        let userIdentity = await this.context.UserIdentity.findOne({username: oldUser.username});

        if(userIdentity.username != user.username.toLowerCase()){
            userIdentity.username = user.username;
            await this.context.UserIdentity.findByIdAndUpdate(userIdentity._id, userIdentity);;
        }

        await this.context.User.findByIdAndUpdate(user._id, user);
        return await this.context.User.findById(user._id);
    }
    
    public async delete(id: string) {
        let user =  await this.context.User.findById(id);
        let userIdentity = await this.context.UserIdentity.findOne({username: user.username});
        user.deleted = true;
        userIdentity.deleted = true;
        await this.context.UserIdentity.findByIdAndUpdate(userIdentity._id, userIdentity);;

        return await this.context.User.findByIdAndUpdate(user._id, user);;
    }

    public async quickSearch(searchText: string){
        let aggregate = (await this.context.User.aggregate([{
            $project: { fullname: { $concat: ["$lastname", ", ", "$firstname"]}}
        },{
            $match: { fullname: new RegExp(`${searchText}`, 'i')}
        }]).limit(25)).map(u => u._id);

        let users = await this.context.User.find({_id: {$in: aggregate}}).sort({lastname: 1, firstname: 1});

        return await users;
    }

    public async getLaborCharges(userId: string){
        return await this.context.LaborCharge.find({assignment: userId}).sort({dateCreated: -1});
    }
    
    public async getTickets(userId: string){
        return await this.context.Ticket.find({assignments: { $all: [userId]}}).sort({dateCreated: -1});
    }

    public async query(queryCriteria: QueryCriteria) {
        let filter = (queryCriteria.filter)? queryCriteria.filter : {};
        let direction = (queryCriteria.sortDirection == "desc")? -1: 1;
        let sort = (queryCriteria.sortColumn && queryCriteria.sortDirection)? { [queryCriteria.sortColumn]: direction} : {};
        let data = { total: 0, items: []};
        data.total = await this.context.User.find(filter).count();
        data.items = await this.context.User.find(filter).sort(sort).skip(queryCriteria.page * queryCriteria.pageSize).limit(queryCriteria.pageSize);
        return await data;
    }
}