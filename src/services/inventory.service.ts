import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Asset } from '../models/asset';
import { Counter } from '../models/counter';
import { Context } from '../context/context';
import { QueryCriteria } from '../models/query';
import { UserProvider } from '../providers/user-provider';


@injectable()
export class InventoryService {
    constructor(@inject(TYPES.Context) private context: Context, @inject(TYPES.UserProvider) private userProvider: UserProvider){}
    public async getAssets() {
        return await this.context.inventory.find({}).populate('userCreated').populate('userUpdated');
    }
    
    public async getAsset(id: string){
        return await this.context.inventory.findById(id).populate({path: 'assets', model: this.context.inventory}).populate({path: 'laborCharges', model: this.context.laborCharges, populate: {path: 'assignment', model: this.context.users}}).populate({path: 'assignments', model: this.context.users}).populate('userCreated').populate('userUpdated');
    }

    public async saveAsset(asset: Asset){
        if(!asset._id && !asset.number){
            let counter: Counter = await this.context.counters.findOneAndUpdate({name: 'inventory'}, {$inc: {count: 1}});
            asset.number = counter.count.toString();
        }

        if(!asset._id){
            asset.dateCreated = new Date();
            asset.userCreated = this.userProvider.user;
            asset.dateUpdated = new Date();
            asset.userUpdated = this.userProvider.user;
            return await this.context.inventory.create(asset);
        } else {
            asset.dateUpdated = new Date();
            asset.userUpdated = this.userProvider.user;
            await this.context.inventory.findByIdAndUpdate(asset._id, asset);
            return await this.context.inventory.findById(asset._id).populate('userCreated').populate('userUpdated');
        }
    }

    public async deleteAsset(id: string){
        return await this.context.inventory.findByIdAndUpdate(id, {deleted: true});
    }

    public async quickSearch(searchText: string){
        let aggregate = (await this.context.inventory.aggregate([{
            $project: { fullname: { $concat: ["$number", " - ", "$description"]}}
        },{
            $match: { fullname: new RegExp(`${searchText}`, 'i')}
        }]).limit(25)).map(a => a._id);

        let assets = await this.context.inventory.find({_id: {$in: aggregate}}).sort({number: 1, description: 1});

        return await assets;
    }

    
    public async query(queryCriteria: QueryCriteria) {
        let filter = (queryCriteria.filter)? queryCriteria.filter : {};
        let direction = (queryCriteria.sortDirection == "desc")? -1: 1;
        let sort = (queryCriteria.sortColumn && queryCriteria.sortDirection)? { [queryCriteria.sortColumn]: direction} : {};
        let data = { total: 0, items: []};
        let wildCardFilter = {};
        if(queryCriteria.wildcardFilter){
            let aggregate = (await this.context.inventory.aggregate([{
                $project: { description: { 
                    $concat: [
                        "$number",
                        " ",
                        "$description"
                    ]
                }}
            },{
                $match: { description: new RegExp(`${queryCriteria.wildcardFilter}`, 'i')}
            }])).map(a => a._id);

            wildCardFilter = {_id: {$in: aggregate}};
        }

        data.total = await this.context.inventory.find(filter).find(wildCardFilter).count();
        data.items = await this.context.inventory.find(filter).find(wildCardFilter).sort(sort).skip(queryCriteria.page * queryCriteria.pageSize).limit(queryCriteria.pageSize);
        return await data;
    }
}