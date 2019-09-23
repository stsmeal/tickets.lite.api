import { controller, httpPost, httpGet, BaseHttpController } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user';

@controller('/user')
export class UserController extends BaseHttpController {

    constructor( @inject(TYPES.UserService) private userService: UserService) { super();}

    @httpGet('/')
    public async getUsers(){
        return await this.userService.getAll();
    }

    @httpPost('/authenticate')
    public async authenticate(request: Request){
        const { username, password } = request.body;
        
        if(!username){
            return this.badRequest('Missing Username');
        }
        if(!password){
            return this.badRequest('Missing Password');
        }

        try{
            return await this.userService.authenticate(username, password);
        } catch(error) {
            return this.internalServerError(error);
        }
    }

    @httpPost('/register')
    public async register(request: Request){
        const { password, ..._user } = request.body;
        const user = <IUser>{..._user};

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


        try{
            return await this.userService.create(user, password);
        } catch(error) {
            return this.internalServerError(error);
        }
    }

    @httpPost('/quicksearch')
    public async quickSearch(request: Request){
        let searchText = request.body.searchText;

        return await this.userService.quickSearch(searchText);
    }
}