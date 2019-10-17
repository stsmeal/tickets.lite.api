import { Connection, connection, Model } from "mongoose";

import { injectable } from "inversify";
import * as config from '../config.json';
import TenantSchema, { Tenant } from "../models/tenant";

@injectable()
export class AuthContext {
    public connection: Connection;
    public tenants: Model<Tenant, {}>;
    
    constructor(){ 
        this.connection = connection.useDb(config.configurationDatabase);
        this.setModels();
    }

    private setModels(): void {
        this.tenants = this.connection.model<Tenant>('Tenant', TenantSchema, 'tenants');
    }
}