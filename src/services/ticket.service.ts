import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { MongoDBClient } from '../utils/mongodb/client';
import Ticket, { ITicket } from '../models/ticket';
import { Note } from '../models/note';
import Asset, { IAsset } from '../models/asset';
import UserIdentity, { IUserIdentity } from '../models/user-identity';
import User, { IUser } from '../models/user';
import Counter, { ICounter } from '../models/counter';
import LaborCharge from '../models/labor-charge';


@injectable()
export class TicketService {
    constructor(@inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient) {}

    public async getTickets() {
        return await Ticket.find({}).populate({path: 'assets', model: Asset}).populate({path: 'laborCharges', model: LaborCharge}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }
    
    public async getTicket(id: string){
        return await Ticket.findById(id);
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

        if(!ticket._id){
            return await Ticket.create(ticket);
        } else {
            await Ticket.findByIdAndUpdate(ticket._id, ticket);
            return await Ticket.findById(ticket._id);
        }
    }
}