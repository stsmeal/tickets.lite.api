import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { MongoDBClient } from '../utils/mongodb/client';
import Ticket, { ITicket } from '../models/ticket';
import { Note } from '../models/note';
import Asset, { IAsset } from '../models/asset';
import UserIdentity, { IUserIdentity } from '../models/user-identity';
import User, { IUser } from '../models/user';
import Counter, { ICounter } from '../models/counter';


@injectable()
export class TicketService {
    constructor(@inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient) {}

    public async getTickets() {
        return await Ticket.find({});
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
        
        if(ticket.userCreated){
            ticket.userCreated = await User.findById(ticket.userCreated._id)
        }

        if(!ticket._id){
            return await Ticket.create(ticket);
        } else {
            await Ticket.findByIdAndUpdate(ticket._id, ticket);
            return await Ticket.findById(ticket._id);
        }
    }
}