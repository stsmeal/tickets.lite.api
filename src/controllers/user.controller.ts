import { controller, httpPost, httpGet, BaseHttpController, httpDelete } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@controller('/user')
export class UserController extends BaseHttpController {

    constructor( @inject(TYPES.UserService) private userService: UserService) { super();}

    @httpGet('/')
    public async getUsers(){
        return await this.userService.getAll();
    }

    @httpGet('/:id')
    public async getUser(request: Request){
        return await this.userService.get(request.params.id);
    }
    
    @httpGet('/laborcharges/:id')
    public async getLaborCharges(request: Request){
        return await this.userService.getLaborCharges(request.params.id);
    }
    
    @httpGet('/tickets/:id')
    public async getTickets(request: Request){
        return await this.userService.getTickets(request.params.id);
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

        user.site = request.headers.site.toString();


        try{
            return await this.userService.create(user, password);
        } catch(error) {
            return this.internalServerError(error);
        }
    }
    
    @httpPost('')
    public async update(request: Request){
        const user = <User>request.body;

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
            return await this.userService.update(user);
        } catch(error) {
            return this.internalServerError(error);
        }
    }

    @httpPost('/quicksearch')
    public async quickSearch(request: Request){
        let searchText = request.body.searchText;

        return await this.userService.quickSearch(searchText);
    }

    @httpDelete('/:id')
    public async delete(request: Request){
        return await this.userService.delete(request.params.id);
    }
}