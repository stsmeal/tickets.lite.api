import { injectable, Container, } from "inversify";
import { interfaces } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import * as config from '../../config.json';


export class Principal implements interfaces.Principal {
    public details: any;
    public constructor(details: any) {
        this.details = details;
    }
    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(true);
    }
    public isResourceOwner(resourceId: any): Promise<boolean> {
        return Promise.resolve(resourceId === 1111);
    }
    public isInRole(role: string): Promise<boolean> {
        return Promise.resolve(role === "admin");
    }
}

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
    public async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<interfaces.Principal> {
        const auth = (req.headers["authorization"] || "").toString().split(' ') || "";
        let user = null;
        if(auth && auth.length == 2 && auth[1]){
            try{
                user = verify(auth[1], config.secret);
            } catch(error){
                console.log(error);
            }
        }

        return new Principal(user);
    }

}