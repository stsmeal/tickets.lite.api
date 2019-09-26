import { Connection, connection, Model } from "mongoose";
import UserSchema, { IUser } from "../models/user";
import UserIdentitySchema, { IUserIdentity } from "../models/user-identity";
import TicketSchema, { ITicket } from "../models/ticket";
import LaborChargeSchema, { ILaborCharge } from "../models/labor-charge";
import CounterSchema, { ICounter } from "../models/counter";
import AssetSchema, { IAsset } from "../models/asset";
import { injectable } from "inversify";

@injectable()
export class Context {
    public connection: Connection;
    public User: Model<IUser, {}>;
    public UserIdentity: Model<IUserIdentity, {}>;
    public Ticket: Model<ITicket, {}>;
    public LaborCharge: Model<ILaborCharge, {}>;
    public Counter: Model<ICounter, {}>;
    public Asset: Model<IAsset, {}>;


    constructor(){ }

    public setSite(site: string){
        this.connection = connection.useDb(site);
        this.setModels();
    }

    private setModels(): void {
        this.User = this.connection.model<IUser>('User', UserSchema, 'Users');
        this.UserIdentity = this.connection.model<IUserIdentity>("UserIdentity", UserIdentitySchema, "UserIdentities");
        this.Ticket = this.connection.model<ITicket>('Ticket', TicketSchema, 'Tickets');
        this.LaborCharge = this.connection.model<ILaborCharge>('LaborCharge', LaborChargeSchema, 'LaborCharges');
        this.Counter = this.connection.model<ICounter>('Counter', CounterSchema, 'Counters');
        this.Asset = this.connection.model<IAsset>('Asset', AssetSchema, 'Inventory');
    }
}
