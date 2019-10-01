import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Ticket } from '../models/ticket';
import { Counter } from '../models/counter';
import { Context } from '../context/context';
import { QueryCriteria } from '../models/query';
import { DocumentQuery } from 'mongoose';
import { UserProvider } from '../providers/user-provider';


@injectable()
export class TicketService {
    constructor(@inject(TYPES.Context) private context: Context, @inject(TYPES.UserProvider) private userProvider: UserProvider) {}

    public async getTickets() {
        return await this.context.Ticket.find({});//.populate({path: 'assets', model: AssetSchema}).populate({path: 'assignments', model: User}).populate('userCreated').populate('userUpdated');
    }
    
    public async getTicket(id: string){
        return await this.context.Ticket.findById(id).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
    }

    public async saveTicket(ticket: Ticket){
        if(!ticket._id || !ticket.number){
            let counter: Counter = await this.context.Counter.findOneAndUpdate({name: 'tickets'}, {$inc: {count: 1}});
            ticket.number = counter.count;
        }

        //handle labor charges
        if(ticket.laborCharges && ticket.laborCharges.length){
            for(let i = 0; i < ticket.laborCharges.length; i++){
                if(!ticket.laborCharges[i]._id){
                    ticket.laborCharges[i].dateCreated = new Date();
                    ticket.laborCharges[i].userCreated = this.userProvider.user;
                    ticket.laborCharges[i].dateUpdated = new Date();
                    ticket.laborCharges[i].userUpdated = this.userProvider.user;
                    ticket.laborCharges[i] = await this.context.LaborCharge.create(ticket.laborCharges[i]);
                } else {
                    ticket.laborCharges[i].dateUpdated = new Date();
                    ticket.laborCharges[i].userUpdated = this.userProvider.user;
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
            ticket.dateCreated = new Date();
            ticket.userCreated = this.userProvider.user;
            ticket.dateUpdated = new Date();
            ticket.userUpdated = this.userProvider.user;
            return await this.context.Ticket.create(ticket);
        } else {
            ticket.dateUpdated = new Date();
            ticket.userUpdated = this.userProvider.user;
            await this.context.Ticket.findByIdAndUpdate(ticket._id, ticket);
            return await this.context.Ticket.findById(ticket._id).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
        }
    }

    public async deleteTicket(id: string){
        return await this.context.Ticket.findByIdAndUpdate(id, {deleted: true});
    }

    public async query(queryCriteria: QueryCriteria) {
        let filter = (queryCriteria.filter)? queryCriteria.filter : {};
        let direction = (queryCriteria.sortDirection == "desc")? -1: 1;
        let sort = (queryCriteria.sortColumn && queryCriteria.sortDirection)? { [queryCriteria.sortColumn]: direction} : {};
        let data = { total: 0, items: []};
        data.total = await this.context.Ticket.find(filter).count();
        data.items = await this.context.Ticket.find(filter).sort(sort).skip(queryCriteria.page * queryCriteria.pageSize).limit(queryCriteria.pageSize);
        return await data;
    }
}