import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Context } from '../context/context';
import { UserProvider } from '../providers/user-provider';
import { Notification } from '../models/notification';


@injectable()
export class NotificationService {
    constructor(@inject(TYPES.Context) private context: Context, @inject(TYPES.UserProvider) private userProvider: UserProvider) {}

    public async getNotifications() {
        if(this.userProvider.user && this.userProvider.user._id){
            let user = await this.context.users.findById(this.userProvider.user._id).select('notifications');
            return await user.notifications;
        }
        else {
            return await null;
        }
    }

    public async unreadNotificationsCount() {
        let count = 0;
        if(this.userProvider.user && this.userProvider.user._id){
            let user = await this.context.users.findById(this.userProvider.user._id).select('notifications');
            if(!user.notifications){
                return await count;
            }
            count = user.notifications.filter(n => !n.read).length || 0;
        }
        return await count;
    }

    public async updateNotification(notification: Notification) {
        if(this.userProvider.user && this.userProvider.user._id){
            let user = await this.context.users.findById(this.userProvider.user._id).select('notifications');
            let ix = user.notifications.findIndex(n => n.id == notification.id);
            if(ix > -1){
                user.notifications[ix] = notification;
            }
            await this.context.users.findOneAndUpdate({_id: this.userProvider.user._id}, {notifications: user.notifications});
            return await user.notifications;
        }
        else {
            return await null;
        }
    }
}