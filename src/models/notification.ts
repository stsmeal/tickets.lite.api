import { Audit } from "./audit";

export class Notification extends Audit {
    message: string;
    data: any;
    read: boolean;
}