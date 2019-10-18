import { injectable, inject } from 'inversify';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { UserIdentity } from '../models/user-identity';
import { User } from '../models/user';
import * as config from '../config.json';
import { Context } from '../context/context';
import TYPES from '../constant/types';
import { AuthContext } from '../context/auth-context';
import { Tenant } from '../models/tenant';


@injectable()
export class AuthService {
    constructor(@inject(TYPES.AuthContext) private authContext: AuthContext, @inject(TYPES.Context) private context: Context) { }

    public async authenticate(username: string, password: string, site: string) {
        this.context.setSite(site);
        username = username.toLowerCase();
        let userIdentity = await this.context.userIdentities.findOne({username: username});
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await this.context.users.findOne({username: username}).select('-notifications');
            const token = sign(JSON.stringify(user), config.secret);
            if(site == config.configurationDatabase){
                return {user, token, isAdmin: true };
            } else {
                return await {user, token}; 
            }
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
        let config = await this.authContext.tenants.find({site: site});
        return await (config != null);
    }

    public async createConfiguration(tenant: Tenant, user: User, password: string){
        if((await this.isSiteNotTaken(tenant.site))){
            user = await this.create(user, password);
            tenant.dbName = tenant.site;
            tenant.dateCreated = new Date();
            tenant.dateUpdated = new Date();
            await this.createConstants(tenant.site);
            await this.authContext.tenants.create(tenant);
            return await this.authenticate(user.username, password, tenant.site);
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