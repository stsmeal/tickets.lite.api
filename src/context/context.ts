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
    public User: Model<User, {}>;
    public UserIdentity: Model<UserIdentity, {}>;
    public Ticket: Model<Ticket, {}>;
    public LaborCharge: Model<LaborCharge, {}>;
    public Counter: Model<Counter, {}>;
    public Asset: Model<Asset, {}>;


    constructor(){ }

    public setSite(site: string){
        this.connection = connection.useDb(site);
        this.setModels();
    }

    private setModels(): void {
        this.User = this.connection.model<User>('User', UserSchema, 'users');
        this.UserIdentity = this.connection.model<UserIdentity>("UserIdentity", UserIdentitySchema, "userIdentities");
        this.Ticket = this.connection.model<Ticket>('Ticket', TicketSchema, 'tickets');
        this.LaborCharge = this.connection.model<LaborCharge>('LaborCharge', LaborChargeSchema, 'laborCharges');
        this.Counter = this.connection.model<Counter>('Counter', CounterSchema, 'counters');
        this.Asset = this.connection.model<Asset>('Asset', AssetSchema, 'inventory');
    }
}
