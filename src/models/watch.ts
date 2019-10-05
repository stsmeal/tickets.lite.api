import { User } from "./user";

export enum WatchType {
    statusOnly = 1,
    all = 2,
    ignore = 3
}

export class Watch {
    user: User;
    type: WatchType;
}