import { Connection, connection, Model } from "mongoose";

import { injectable } from "inversify";
import * as config from '../config.json';
import MasterConfigurationSchema, { MasterConfiguration } from "../models/master-configuration";
import MasterEmailSchema, { MasterEmail } from "../models/master-email.js";

@injectable()
export class AuthContext {
    public connection: Connection;
    public masterConfigurations: Model<MasterConfiguration, {}>;
    public masterEmails: Model<MasterEmail, {}>;


    constructor(){ 
        this.connection = connection.useDb(config.configurationDatabase);
        this.setModels();
    }

    private setModels(): void {
        this.masterConfigurations = this.connection.model<MasterConfiguration>('MasterConfiguration', MasterConfigurationSchema, 'masterConfigurations');
        this.masterEmails = this.connection.model<MasterEmail>('MasterEmail', MasterEmailSchema, 'masterEmails');
    }
}