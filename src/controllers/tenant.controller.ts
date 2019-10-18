import { controller, httpPost, httpGet, BaseHttpController, httpDelete } from 'inversify-express-utils';
import { Request } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { TenantService } from '../services/tenant.service';
import { Tenant } from '../models/tenant';
import { adminOnly } from '../utils/authentication/admin-middleware';

@controller('/tenants', adminOnly)
export class TenantController extends BaseHttpController {
    constructor(@inject(TYPES.TenantService) private tenantService: TenantService) { super() }

    @httpGet('/:id') 
    public async getTenant(request: Request){
        return await this.tenantService.getTenant(request.params.id);
    }

    @httpGet('/info/:id') 
    public async getTenantInfo(request: Request){
        return await this.tenantService.getTenantInfo(request.params.id);
    }

    @httpPost('/count')
    public async count(request: Request){
        const {tenantId, collection, filter} = request.body;
        if(tenantId == null){
            this.badRequest('Tenant Id Required');
        }

        let count = await this.tenantService.count(tenantId, collection, filter);
        this.ok(count);
    }

    @httpPost('/')
    public async saveTenant(request: Request) {
        let tenant = <Tenant>request.body;
        return await this.tenantService.saveTenant(tenant);
    }

    @httpPost('/notification')
    public async sendNotification(request: Request) {
        const {id, message }= request.body;
        return await this.tenantService.createNotifications(message, id);
    }

    @httpPost('/query')
    public async query(request: Request){
        let query = request.body;
        return await this.tenantService.query(query);
    }
}