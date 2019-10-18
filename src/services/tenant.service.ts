import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { Tenant } from '../models/tenant';
import { QueryCriteria } from '../models/query';
import { UserProvider } from '../providers/user-provider';
import { GetRegExp } from '../utils/helpers';
import { AuthContext } from '../context/auth-context';


@injectable()
export class TenantService {
    constructor(@inject(TYPES.AuthContext) private auth: AuthContext, @inject(TYPES.UserProvider) private userProvider: UserProvider){}

    public async getTenant(id: string){
        return await this.auth.tenants.findById(id);
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