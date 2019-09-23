import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { MongoDBClient } from '../utils/mongodb/client';
import Ticket, { ITicket } from '../models/ticket';
import { Note } from '../models/note';
import Asset, { IAsset } from '../models/asset';
import UserIdentity, { IUserIdentity } from '../models/user-identity';
import User, { IUser } from '../models/user';
import Counter, { ICounter } from '../models/counter';
import LaborCharge, { ILaborCharge } from '../models/labor-charge';


@injectable()
export class InventoryService {
    public async getAssets() {
        return await Asset.find({}).populate('userCreated').populate('userUpdated');
    }
    
    public async getAsset(id: string){
        return await Asset.findById(id).populate({path: 'assets', model: Asset}).populate({path: 'laborCharges', model: LaborCharge, populate: {path: 'assignment', model: User}}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }

    public async saveAsset(asset: IAsset){
        if(!asset._id && !asset.number){
            let counter: ICounter = await Counter.findOne({name: 'inventory'});
            if(!counter){
                asset.number = "1";
                await Counter.create({name: 'inventory', count: 1});
            } else {
                counter.count += 1;
                asset.number = counter.count.toString();
                await Counter.findOneAndUpdate({name: 'inventory'}, {count: counter.count});
            }
        }

        if(!asset._id){
            return await Asset.create(asset);
        } else {
            await Asset.findByIdAndUpdate(asset._id, asset);
            return await Asset.findById(asset._id).populate('userCreated').populate('userUpdated');
        }
    }

    public async deleteAsset(id: string){
        return await Asset.findByIdAndUpdate(id, {deleted: true});
    }
}