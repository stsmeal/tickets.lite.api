import { controller, httpPost, httpGet, BaseHttpController, httpDelete, requestBody } from 'inversify-express-utils';
import { Request } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification';

@controller('/notifications')
export class NotificationController extends BaseHttpController {
    constructor(@inject(TYPES.NotificationService) private notificationService: NotificationService) { super() }

    @httpGet('/')
    public async getNotifications(){
        return await this.notificationService.getNotifications();
    }

    @httpGet('/new')
    public async newNotifications(){
        return await this.notificationService.hasNewNotifications();
    }

    @httpPost('/update')
    public async updateNotifications(@requestBody() notifications: Notification[]){
        return await this.notificationService.updateNotifications(notifications);
    }
}