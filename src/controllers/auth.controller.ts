import { controller, httpPost, httpGet, BaseHttpController, httpDelete, requestBody } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@controller('/auth')
export class AuthController extends BaseHttpController {
    constructor(@inject(TYPES.AuthService) private auth: AuthService){ super() }

    @httpPost('/token')
    public async authenticate(request: Request){
        const { username, password } = request.body;
        
        if(!username){
            return this.badRequest('Missing Username');
        }
        if(!password){
            return this.badRequest('Missing Password');
        }
        if(!request.headers.site){
            return this.badRequest('Missing Workplace');
        }

        let site = request.headers.site.toString().toLowerCase();

        try{
            return await this.auth.authenticate(username, password, site);
        } catch(error) {
            return this.internalServerError(error);
        }
    }

    @httpPost('/register')
    public async register(request: Request){
        const { password, ..._user } = request.body;
        const user = <User>{..._user};

        if(!password){
            return this.badRequest('Missing Password');
        }

        if(!user){
            return this.badRequest('Missing User Information');
        }

        if(!user.username){
            return this.badRequest('Missing Username');
        }

        if(!user.firstname){
            return this.badRequest('Missing First Name');
        }

        if(!user.lastname){
            return this.badRequest('Missing Last Name');
        }

        if(!user.email){
            return this.badRequest('Missing Email');
        }

        if(!request.headers.site){
            return this.badRequest('Missing Workplace');
        }

        user.site = request.headers.site.toString().toLowerCase();


        try{
            return await this.auth.create(user, password);
        } catch(error) {
            return this.internalServerError(error);
        }
    }

    @httpPost('/create')
    public async createConfiguration(request: Request){
        let configuration = request.body.configuration;
        let {user, password} = request.body.user;

        return await this.auth.createConfiguration(configuration, user, password);
    }
}