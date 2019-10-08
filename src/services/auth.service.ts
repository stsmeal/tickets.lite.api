import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { UserIdentity } from '../models/user-identity';
import { User } from '../models/user';
import * as config from '../config.json';
import { Context } from '../context/context';
import TYPES from '../constant/types';
import { AuthContext } from '../context/auth-context';
import { MasterConfiguration } from '../models/master-configuration';


@injectable()
export class AuthService {
    constructor(@inject(TYPES.AuthContext) private authContext: AuthContext, @inject(TYPES.Context) private context: Context) { }

    public async authenticate(username: string, password: string, site: string) {
        this.authContext.masterConfigurations;
        this.context.setSite(site);
        username = username.toLowerCase();
        let userIdentity = await this.context.userIdentities.findOne({username: username});
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await this.context.users.findOne({username: username}).select('-notifications');
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async create(user: User, password: string) {
        this.context.setSite(user.site);
        user.username = user.username.toLowerCase();
        if(await this.context.users.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await this.context.userIdentities.create(<UserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        user.dateCreated = new Date();
        return await this.context.users.create(user);       
    }

    public async isSiteNotTaken(site: string){
        site = site.toLowerCase();
        let config = await this.authContext.masterConfigurations.find({site: site});
        return await (config != null);
    }

    public async createConfiguration(configuration: MasterConfiguration, user: User, password: string){
        if((await this.isSiteNotTaken(configuration.site))){
            user = await this.create(user, password);
            configuration.dbName = configuration.site;
            await this.createConstants(configuration.site);
            await this.authContext.masterConfigurations.create(configuration);
            return await this.authenticate(user.username, password, configuration.site);
        } else {
            throw "Workplace is taken";
        }
    }

    private async createConstants(site: string){
        this.context.setSite(site);
        await this.context.counters.create({name: 'inventory', count: 1});
        await this.context.counters.create({name: 'tickets', count: 1});
        return await true;
    }
}