import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { hash } from 'bcryptjs';
import { UserIdentity } from '../models/user-identity';
import { User } from '../models/user';
import { Context } from '../context/context';
import { QueryCriteria } from '../models/query';
import { UserProvider } from '../providers/user-provider';
import { GetRegExp } from '../utils/helpers';


@injectable()
export class UserService {
    constructor(@inject(TYPES.Context) private context: Context, @inject(TYPES.UserProvider) private userProvider: UserProvider) {}

    public async getAll() {
        return await this.context.users.find({});
    }

    public async get(id: string) {
        return await this.context.users.findById(id);
    }

    public async create(user: User, password: string) {
        user.username = user.username.toLowerCase();
        if(await this.context.users.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await this.context.userIdentities.create(<UserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        user.dateCreated = new Date();
        return await this.context.users.create(user);       
    }

    public async update(user: User) {
        let oldUser = await this.context.users.findById(user._id);
        let userIdentity = await this.context.userIdentities.findOne({username: oldUser.username});

        user.notifications = oldUser.notifications;

        if(userIdentity.username != user.username.toLowerCase()){
            userIdentity.username = user.username;
            await this.context.userIdentities.findByIdAndUpdate(userIdentity._id, userIdentity);;
        }

        await this.context.users.findByIdAndUpdate(user._id, user);
        return await this.context.users.findById(user._id).select('-notifications');
    }
    
    public async delete(id: string) {
        let user =  await this.context.users.findById(id);
        let userIdentity = await this.context.userIdentities.findOne({username: user.username});
        user.deleted = true;
        userIdentity.deleted = true;
        await this.context.userIdentities.findByIdAndUpdate(userIdentity._id, userIdentity);;

        return await this.context.users.findByIdAndUpdate(user._id, user).select('-notifications');
    }

    public async quickSearch(searchText: string){
        let aggregate = (await this.context.users.aggregate([{
            $project: { fullname: { $concat: ["$lastname", ", ", "$firstname"]}}
        },{
            $match: { fullname: GetRegExp(searchText)}
        }]).limit(25)).map(u => u._id);

        let users = await this.context.users.find({_id: {$in: aggregate}}).sort({lastname: 1, firstname: 1});

        return await users;
    }

    public async getLaborCharges(userId: string){
        return await this.context.laborCharges.find({assignment: userId}).sort({dateCreated: -1});
    }
    
    public async getTickets(userId: string){
        return await this.context.tickets.find({assignments: { $all: [userId]}}).sort({dateCreated: -1});
    }

    public async query(queryCriteria: QueryCriteria) {
        let filter = (queryCriteria.filter)? queryCriteria.filter : {};
        let direction = (queryCriteria.sortDirection == "desc")? -1: 1;
        let sort = (queryCriteria.sortColumn && queryCriteria.sortDirection)? { [queryCriteria.sortColumn]: direction} : {};
        let data = { total: 0, items: []};
        let wildCardFilter = {};
        if(queryCriteria.wildcardFilter){
            let aggregate = (await this.context.users.aggregate([{
                $project: { description: { 
                    $concat: [
                        "$username",
                        " ",
                        "$firstname",
                        " ",
                        "$lastname",
                        " ",
                        "$email",
                    ]
                }}
            },{
                $match: { description: GetRegExp(queryCriteria.wildcardFilter)}
            }])).map(a => a._id);

            wildCardFilter = {_id: {$in: aggregate}};
        }
        data.total = await this.context.users.find(filter).find(wildCardFilter).count();
        data.items = await this.context.users.find(filter).find(wildCardFilter).sort(sort).skip(queryCriteria.page * queryCriteria.pageSize).limit(queryCriteria.pageSize);
        return await data;
    }
}