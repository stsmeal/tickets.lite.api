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
import { Context } from '../context/context';
import AssetSchema from '../models/asset';


@injectable()
export class TicketService {
    constructor(@inject(TYPES.Context) private context: Context) {}

    public async getTickets() {
        return await this.context.Ticket.find({});//.populate({path: 'assets', model: AssetSchema}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }
    
    public async getTicket(id: string){
        return await this.context.Ticket.findById(id).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
    }

    public async saveTicket(ticket: ITicket){
        if(!ticket._id || !ticket.number){
            let counter: ICounter = await this.context.Counter.findOne({name: 'tickets'}).exec();
            if(!counter){
                ticket.number = 1;
                await this.context.Counter.create({name: 'tickets', count: 1});
            } else {
                counter.count += 1;
                ticket.number = counter.count;
                await this.context.Counter.findOneAndUpdate({name: 'tickets'}, {count: counter.count});
            }
        }

        //handle labor charges
        if(ticket.laborCharges && ticket.laborCharges.length){
            for(let i = 0; i < ticket.laborCharges.length; i++){
                if(!ticket.laborCharges[i]._id){
                    ticket.laborCharges[i] = await this.context.LaborCharge.create(ticket.laborCharges[i]);
                } else {
                    await this.context.LaborCharge.findByIdAndUpdate(ticket.laborCharges[i]._id, ticket.laborCharges[i]);
                    ticket.laborCharges[i] = await this.context.LaborCharge.findById(ticket.laborCharges[i]._id);
                }
            } 
        }
        
        //delete old labor charges
        if(ticket._id){
            let oldLaborCharges = (await this.context.Ticket.findById(ticket._id).select('laborCharges')).laborCharges
            .map(lc => lc._id)
            .filter(id => ticket.laborCharges.findIndex(lc => lc._id == id) == -1);
            
            if(oldLaborCharges.length)
                await this.context.LaborCharge.find({_id: {$in: oldLaborCharges}}).update({deleted: true});
        }

        if(!ticket._id){
            return await this.context.Ticket.create(ticket);
        } else {
            await this.context.Ticket.findByIdAndUpdate(ticket._id, ticket);
            return await this.context.Ticket.findById(ticket._id).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
        }
    }

    public async deleteTicket(id: string){
        return await this.context.Ticket.findByIdAndUpdate(id, {deleted: true});
    }
}