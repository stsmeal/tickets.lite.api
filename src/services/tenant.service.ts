import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Tenant } from '../models/tenant';
import { QueryCriteria } from '../models/query';
import { UserProvider } from '../providers/user-provider';
import { GetRegExp } from '../utils/helpers';
import { AuthContext } from '../context/auth-context';
import { Context } from '../context/context';
import { Collection } from 'mongoose';


@injectable()
export class TenantService {
    constructor(
        @inject(TYPES.Context) private context: Context,
        @inject(TYPES.AuthContext) private auth: AuthContext, 
        @inject(TYPES.UserProvider) private userProvider: UserProvider){}

    public async getTenant(id: string){
        return await this.auth.tenants.findById(id);
    }

    public async getTenantInfo(id: string){
        let tenant = await this.auth.tenants.findById(id);
        if(tenant){
            this.context.setSite(tenant.site);
            //get total users
            let totalUsers = await this.context.users.find({}).count();
            //get total active users
            let totalActiveUsers = await this.context.users.find({status: 1}).count();
            //get total tickets
            let totalTickets = await this.context.tickets.find({}).count();
            //get total active tickets
            let totalActiveTickets = await this.context.tickets.find({status: 1}).count();
            //get tickets over past day by hour
            let startDate = new Date();
            let endDate = new Date();
            let labels: string[] = [];
            let ticketCounts: number[] = [];
            let loginCounts: number[] = [];
            let apiRequestCounts: number[] = [];
            for(let i = 0; i < 24; i++){
                startDate.setHours(startDate.getHours() - 1);
                let count = await this.context.tickets.find({dateCreated: {
                    $gte: startDate,
                    $lt: endDate
                }}).count();
                if(!count){
                    count = 0;
                }
                ticketCounts.push(count);
                count = await this.context.loginAudits.find({time: {
                    $gte: startDate,
                    $lt: endDate
                }}).count();
                if(!count){
                    count = 0;
                }
                loginCounts.push(count);
                count = await this.context.apiRequests.find({dateCreated: {
                    $gte: startDate,
                    $lt: endDate
                }}).count();
                if(!count){
                    count = 0;
                }
                apiRequestCounts.push(count);


                let labelTime = endDate;
                labelTime.setMinutes(endDate.getMinutes() - 30);
                labels.push(labelTime.toLocaleTimeString());
            }

            labels = labels.reverse();
            ticketCounts = ticketCounts.reverse();
            loginCounts = loginCounts.reverse();
            apiRequestCounts = apiRequestCounts.reverse();

            return await {
                totalUsers: totalUsers, 
                totalActiveUsers: totalActiveUsers,
                totalTickets: totalTickets,
                totalActiveTickets: totalActiveTickets,
                ticketsPastDay: {
                    chartData: [{
                        data: ticketCounts,
                        label: 'Tickets Created'
                    },{
                        data: loginCounts,
                        label: 'User logins'
                    },{
                        data: apiRequestCounts,
                        label: 'API Requests'
                    }],
                    chartLabels: labels
                }
            };
        }
        return null;
    }

    public async saveTenant(tenant: Tenant){
        if(!tenant._id){
            tenant.dateCreated = new Date();
            tenant.userCreated = this.userProvider.user;
            tenant.dateUpdated = new Date();
            tenant.userUpdated = this.userProvider.user;
            return await this.auth.tenants.create(tenant);
        } else {
            tenant.dateUpdated = new Date();
            tenant.userUpdated = this.userProvider.user;
            await this.auth.tenants.findByIdAndUpdate(tenant._id, tenant);
            return await this.auth.tenants.findById(tenant._id);
        }
    }

    public async count(tenantId: string, collection: string, filter: any){
        let tenant = await this.auth.tenants.findById(tenantId);
        let collections = ["tickets", "inventory", "users"];
        filter = (filter) ? filter : {};
        if(collections.findIndex(c => c == collection) > -1 && tenant){
            this.context.setSite(tenant.site);
            return this.context[collection].find(filter).count();
        } 
        return 0;
    }

    public async query(queryCriteria: QueryCriteria) {
        let filter = (queryCriteria.filter)? queryCriteria.filter : {};
        let direction = (queryCriteria.sortDirection == "desc")? -1: 1;
        let sort = (queryCriteria.sortColumn && queryCriteria.sortDirection)? { [queryCriteria.sortColumn]: direction} : {};
        let data = { total: 0, items: []};
        let wildCardFilter = {};
        if(queryCriteria.wildcardFilter){
            let aggregate = (await this.auth.tenants.aggregate([{
                $project: { description: { 
                    $concat: [
                        "$site",
                        " ",
                        "$companyName",
                        " ",
                        "$description"
                    ]
                }}
            },{
                $match: { description: GetRegExp(queryCriteria.wildcardFilter)}
            }])).map(a => a._id);

            wildCardFilter = {_id: {$in: aggregate}};
        }

        data.total = await this.auth.tenants.find(filter).find(wildCardFilter).count();
        data.items = await this.auth.tenants.find(filter).find(wildCardFilter).sort(sort).skip(queryCriteria.page * queryCriteria.pageSize).limit(queryCriteria.pageSize);
        return await data;
    }
}