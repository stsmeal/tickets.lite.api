import { injectable } from "inversify";
import { User } from "../models/user";

@injectable()
export class UserProvider{
    public user: User;

    constructor() {}
}