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
export class TicketService {
    constructor(@inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient) {}

    public async getTickets() {
        return await Ticket.find({}).populate({path: 'assets', model: Asset}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }
    
    public async getTicket(id: string){
        return await Ticket.findById(id).populate({path: 'assets', model: Asset}).populate({path: 'laborCharges', model: LaborCharge, populate: {path: 'assignment', model: User}}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }

    public async saveTicket(ticket: ITicket){
        if(!ticket._id || !ticket.number){
            let counter: ICounter = await Counter.findOne({name: 'tickets'}).exec();
            if(!counter){
                ticket.number = 1;
                await Counter.create({name: 'tickets', count: 1});
            } else {
                counter.count += 1;
                ticket.number = counter.count;
                await Counter.findOneAndUpdate({name: 'tickets'}, {count: counter.count});
            }
        }

        //handle labor charges
        if(ticket.laborCharges && ticket.laborCharges.length){
            for(let i = 0; i < ticket.laborCharges.length; i++){
                if(!ticket.laborCharges[i]._id){
                    ticket.laborCharges[i] = await LaborCharge.create(ticket.laborCharges[i]);
                } else {
                    await LaborCharge.findByIdAndUpdate(ticket.laborCharges[i]._id, ticket.laborCharges[i]);
                    ticket.laborCharges[i] = await LaborCharge.findById(ticket.laborCharges[i]._id);
                }
            } 
        }
        
        //delete old labor charges
        if(ticket._id){
            let oldLaborCharges = (await Ticket.findById(ticket._id).select('laborCharges')).laborCharges
            .map(lc => lc._id)
            .filter(id => ticket.laborCharges.findIndex(lc => lc._id == id) == -1);
            
            if(oldLaborCharges.length)
                await LaborCharge.find({_id: {$in: oldLaborCharges}}).update({deleted: true});
        }

        if(!ticket._id){
            return await Ticket.create(ticket);
        } else {
            await Ticket.findByIdAndUpdate(ticket._id, ticket);
            return await Ticket.findById(ticket._id).populate({path: 'assets', model: Asset}).populate({path: 'laborCharges', model: LaborCharge, populate: {path: 'assignment', model: User}}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
        }
    }

    public async deleteTicket(id: string){
        return await Ticket.findByIdAndUpdate(id, {deleted: true});
    }
}