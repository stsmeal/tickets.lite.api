import { Audit } from "./audit";

export class Note extends Audit {
    type: number;
    message: string;
}