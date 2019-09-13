import { controller, httpPost, httpGet, BaseHttpController } from 'inversify-express-utils';
import { Request } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { TicketService } from '../services/ticket.service';
import { ITicket } from '../models/ticket';

@controller('/ticket')
export class TicketController extends BaseHttpController {
    constructor(@inject(TYPES.TicketService) private ticketService: TicketService) { super() }

    @httpGet('/') 
    public async getTickets(){
        return await this.ticketService.getTickets();
    }

    @httpGet('/:id') 
    public async getTicket(request: Request){
        return await this.ticketService.getTicket(request.params.id);
    }

    @httpPost('/')
    public async saveTicket(request: Request) {
        let ticket = <ITicket>request.body;
        return await this.ticketService.saveTicket(ticket);
    }
}