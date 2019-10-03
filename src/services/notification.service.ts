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
            let user = await this.context.User.findById(this.userProvider.user._id).select('notifications');
            return await user.notifications;
        }
        else {
            return await null;
        }
    }

    public async hasNewNotifications() {
        if(this.userProvider.user && this.userProvider.user._id){
            let user = await this.context.User.findById(this.userProvider.user._id).select('notifications');
            if(!user.notifications){
                return false;
            }
            let ix = user.notifications.findIndex(n => !n.read);
            return await ix > -1;
        }
        else {
            return await false;
        }
    }

    public async updateNotifications(notifications: Notification[]) {
        if(this.userProvider.user && this.userProvider.user._id){
            await this.context.User.findOneAndUpdate({_id: this.userProvider.user._id}, {notifications: notifications});
            let user = await this.context.User.findById(this.userProvider.user._id).select('notifications');
            return await user.notifications;
        }
        else {
            return await null;
        }
    }
}