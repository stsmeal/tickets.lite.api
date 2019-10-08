import { Connection, connection, Model } from "mongoose";
import UserSchema, { User } from "../models/user";
import UserIdentitySchema, { UserIdentity } from "../models/user-identity";
import TicketSchema, { Ticket } from "../models/ticket";
import LaborChargeSchema, { LaborCharge } from "../models/labor-charge";
import CounterSchema, { Counter } from "../models/counter";
import AssetSchema, { Asset } from "../models/asset";
import { injectable } from "inversify";

@injectable()
export class Context {
    public connection: Connection;
    public users: Model<User, {}>;
    public userIdentities: Model<UserIdentity, {}>;
    public tickets: Model<Ticket, {}>;
    public laborCharges: Model<LaborCharge, {}>;
    public counters: Model<Counter, {}>;
    public inventory: Model<Asset, {}>;


    constructor(){ }

    public setSite(site: string){
        this.connection = connection.useDb(site);
        this.setModels();
    }

    private setModels(): void {
        this.users = this.connection.model<User>('User', UserSchema, 'users');
        this.userIdentities = this.connection.model<UserIdentity>("UserIdentity", UserIdentitySchema, "userIdentities");
        this.tickets = this.connection.model<Ticket>('Ticket', TicketSchema, 'tickets');
        this.laborCharges = this.connection.model<LaborCharge>('LaborCharge', LaborChargeSchema, 'laborCharges');
        this.counters = this.connection.model<Counter>('Counter', CounterSchema, 'counters');
        this.inventory = this.connection.model<Asset>('Asset', AssetSchema, 'inventory');
    }
}
