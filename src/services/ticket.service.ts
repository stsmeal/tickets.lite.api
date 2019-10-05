import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import TicketSchema, { Ticket } from '../models/ticket';
import { Counter } from '../models/counter';
import { Context } from '../context/context';
import { QueryCriteria } from '../models/query';
import { DocumentQuery } from 'mongoose';
import { UserProvider } from '../providers/user-provider';
import { Watch, WatchType } from '../models/watch';
import { Notification, NotificationData, NotificationType } from '../models/notification';
import { ObjectID } from 'bson';


@injectable()
export class TicketService {
    public readonly statuses = [
        {id: 1, label: 'Active' },
        {id: 2, label: 'Pending' },
        {id: 3, label: 'In Progress' },
        {id: 4, label: 'Deferred' },
        {id: 5, label: 'Complete' },
    ];

    public readonly categories = [
        {id: 1, label: 'Preventive Maintance' },
        {id: 2, label: 'Corrective Maintance' },
        {id: 3, label: 'Urgent' },
        {id: 4, label: 'Management' },
        {id: 5, label: 'Other' },
    ];

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
            let newTicket = await this.context.Ticket.create(ticket);
            this.createNotifications(newTicket, <Ticket>{});
            return await newTicket;
        } else {
            ticket.dateUpdated = new Date();
            ticket.userUpdated = this.userProvider.user;
            let oldTicket = await this.context.Ticket.findByIdAndUpdate(ticket._id, ticket).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
            let newTicket = await this.context.Ticket.findById(ticket._id).populate({path: 'assets', model: this.context.Asset}).populate({path: 'laborCharges', model: this.context.LaborCharge, populate: {path: 'assignment', model: this.context.User}}).populate({path: 'assignments', model: this.context.User}).populate('userCreated').populate('userUpdated');
            this.createNotifications(newTicket, oldTicket);
            return await newTicket;
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

    private createNotifications(newTicket: Ticket, oldTicket: Ticket): void {
        if(newTicket){
            let userId = this.userProvider.user._id;
            let username = this.userProvider.user.username;
            let notifications: Map<string, Notification[]> = new Map<string, Notification[]>();
            let add = (userId, notification) => {
                if(!notifications.has(userId)){
                    notifications.set(userId, [notification]);
                } else {
                    let notes = notifications.get(userId);
                    notes.push(notification);
                    notifications.set(userId, notes);
                }
            };
    
            if(newTicket.watches){
                newTicket.watches.forEach((watch: Watch) => {
                    if(watch.user && watch.user._id){
                        if(watch.type == WatchType.statusOnly){
                            if(newTicket.status != oldTicket.status){
                                let notification = new Notification();
                                if(newTicket.status){
                                    notification.message = `set the status to "${this.status(newTicket.status)}"`;
                                } else {
                                    notification.message = `cleared the status`;
                                }
                                notification.id = new ObjectID().toHexString();
                                notification.user = this.userProvider.user;
                                notification.dateCreated = new Date();
                                notification.read = false;
                                notification.data = <NotificationData>{
                                    type: NotificationType.ticket,
                                    id: newTicket.id,
                                    name: newTicket.number.toString()
                                };
                                add(watch.user._id, notification);
                            }
                        }
                        if(watch.type == WatchType.all){
                            //@TODO message for all props 
                        }
                    }
                });
            }

            if(newTicket.assignments != oldTicket.assignments){
                newTicket.assignments = newTicket.assignments || [];
                oldTicket.assignments = oldTicket.assignments || [];
                let newAssignments = newTicket.assignments.filter(a => oldTicket.assignments.findIndex(oa => oa.id === a.id) == -1);
                let oldAssignments = oldTicket.assignments.filter(a => newTicket.assignments.findIndex(na => na.id === a.id) == -1);
                newAssignments.forEach(a => {
                    if(a.id != userId){
                        //If the user is watching then they already have the notifications except if it is status only we will inform them that their assignment changed
                        if(!newTicket.watches || newTicket.watches.findIndex(w => w.user.id == userId && w.type != WatchType.statusOnly) == -1){ //If the user is watching then they already have the notifications
                            let notification = <Notification>{
                                user: this.userProvider.user,
                                id: new ObjectID().toHexString(),
                                dateCreated: new Date(),
                                read: false,
                                data: <NotificationData>{
                                    type: NotificationType.ticket,
                                    id: newTicket.id,
                                    name: newTicket.number.toString()
                                },
                                message: `added you to ticket`
                            };
                            add(a._id, notification);
                        }
                    }
                });
                oldAssignments.forEach(a => {
                    if(a.id != userId){
                        //If the user is watching then they already have the notifications except if it is status only we will inform them that their assignment changed
                        if(!newTicket.watches || newTicket.watches.findIndex(w => w.user.id == userId && w.type != WatchType.statusOnly) == -1){ //If the user is watching then they already have the notifications
                            let notification = <Notification>{
                                user: this.userProvider.user,
                                id: new ObjectID().toHexString(),
                                dateCreated: new Date(),
                                read: false,
                                data: <NotificationData>{
                                    type: NotificationType.ticket,
                                    id: newTicket.id,
                                    name: newTicket.number.toString()
                                },
                                message: `removed you from ticket`
                            };
                            add(a._id, notification);
                        }
                    }
                });
            }
            if(newTicket.assignments){
                if(newTicket.status != oldTicket.status){
                    newTicket.assignments.filter(a => a.id != userId).forEach(a => {
                        let notification = <Notification>{
                            user: this.userProvider.user,
                            id: new ObjectID().toHexString(),
                            dateCreated: new Date(),
                            read: false,
                            data: <NotificationData>{
                                type: NotificationType.ticket,
                                id: newTicket.id,
                                name: newTicket.number.toString()
                            }
                        };
                        if(newTicket.status){
                            notification.message = `set the status to "${this.status(newTicket.status)}"`;
                        } else {
                            notification.message = `cleared the status`;
                        }
                        add(a._id, notification);
                    });
                }
            }
            notifications.forEach((notifications, id)=> {
                this.context.User.findByIdAndUpdate(id, { $push:{
                    notifications: {
                        $each: notifications,
                        $sort: {dateCreated: -1}
                    }
                }}).exec();
            });
        }
    }

    private status(id: number): string {
        let status = this.statuses.find(s => s.id == id);
        if(status && status.label){
            return status.label;
        } else {
            return "";
        }
    }

    private category(id: number): string {
        let category = this.categories.find(s => s.id == id);
        if(category && category.label){
            return category.label;
        } else {
            return "";
        }
    }


    /*
    private audit(newTicket: Ticket, oldTicket: Ticket): void {
        if(newTicket){
            if(oldTicket){
                let obj = newTicket.schema.obj;
                Object.keys(obj).forEach((key) => {
                    if(newTicket[key] != oldTicket[key]){

                    }
                });
            } else {
                let obj = newTicket.schema.obj;
            }
        }
    }
    */
}