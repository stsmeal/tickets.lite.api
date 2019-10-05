import { Audit } from "./audit";
import { User } from "./user";

export enum NotificationType {
    general = 1,
    ticket = 2
}

export class NotificationData {
    type: number;
    id: string;
    name: string;
}

export class Notification extends Audit {
    id: string;
    user: User;
    message: string;
    data: NotificationData;
    read: boolean;
}