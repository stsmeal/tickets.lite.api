import { Connection, connection, Model } from "mongoose";

import { injectable } from "inversify";
import * as config from '../config.json';
import MasterConfigurationSchema, { MasterConfiguration } from "../models/master-configuration";
import MasterEmailSchema, { MasterEmail } from "../models/master-email.js";

@injectable()
export class AuthContext {
    public connection: Connection;
    public MasterConfiguration: Model<MasterConfiguration, {}>;
    public MasterEmail: Model<MasterEmail, {}>;


    constructor(){ 
        this.connection = connection.useDb(config.configurationDatabase);
        this.setModels();
    }

    private setModels(): void {
        this.MasterConfiguration = this.connection.model<MasterConfiguration>('MasterConfiguration', MasterConfigurationSchema, 'masterConfigurations');
        this.MasterEmail = this.connection.model<MasterEmail>('MasterEmail', MasterEmailSchema, 'masterEmails');
    }
}