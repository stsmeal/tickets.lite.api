import { IAudit } from "./audit";

export class Note extends IAudit {
    type: number;
    message: string;
}