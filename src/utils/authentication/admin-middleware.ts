import { Request, Response } from "express";
import { User } from "../../models/user.js";
import { verify } from 'jsonwebtoken';
import * as config from '../../config.json';

function authMiddlewareFactory() {
    return (req: Request, res: Response, next: any): void => {
        const auth = (req.headers["authorization"] || "").toString().split(' ') || "";
        let user: User = null;
        if(auth && auth.length == 2 && auth[1]){
            user = <User>verify(auth[1], config.secret);
        }
        if (user == null || user.site != config.configurationDatabase) {
            res.status(403).json({ err: 'You are not allowed' });
            return;
        }
        next();
    }
}

const adminOnly = authMiddlewareFactory();
export { adminOnly };