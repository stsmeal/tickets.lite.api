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
        this.authContext.MasterConfiguration;
        this.context.setSite(site);
        username = username.toLowerCase();
        let userIdentity = await this.context.UserIdentity.findOne({username: username});
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await this.context.User.findOne({username: username});
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async create(user: User, password: string) {
        this.context.setSite(user.site);
        user.username = user.username.toLowerCase();
        if(await this.context.User.findOne({username: user.username})){
            throw 'Username is Taken';
        }

        await this.context.UserIdentity.create(<UserIdentity>{
            username: user.username,
            hash: await hash(password, 10)
        });
        
        return await this.context.User.create(user);       
    }

    public async isSiteTaken(site: string){
        site = site.toLowerCase();
        let config = await this.authContext.MasterConfiguration.find({site: site});
        return await (config != null);
    }

    public async createConfiguration(configuration: MasterConfiguration, user: User, password: string){
        if(!(await this.authContext.MasterConfiguration.find({site: configuration.site}))){
            user = await this.create(user, password);
            configuration.dbName = configuration.site;
            return await this.authenticate(user.username, password, configuration.site);
        } else {
            throw "Workplace is taken";
        }
    }
}