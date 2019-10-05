import { controller, httpPost, httpGet, BaseHttpController, httpDelete, requestBody, httpPut } from 'inversify-express-utils';
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

    @httpGet('/unreadCount')
    public async unreadNotificationsCount(){
        let count = await this.notificationService.unreadNotificationsCount();
        return this.ok(count);
    }

    @httpPut('/')
    public async updateNotifications(@requestBody() notification: Notification){
        return await this.notificationService.updateNotification(notification);
    }
}