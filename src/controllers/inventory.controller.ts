import { controller, httpPost, httpGet, BaseHttpController, httpDelete } from 'inversify-express-utils';
import { Request } from 'express';
import { inject } from 'inversify';
import { InventoryService } from '../services/inventory.service';
import { IAsset } from '../models/asset';
import TYPES from '../constant/types';

@controller('/inventory')
export class InventoryController extends BaseHttpController {
    constructor(@inject(TYPES.InventoryService) private inventoryService: InventoryService) { super() }

    @httpGet('/') 
    public async getAssets(){
        return await this.inventoryService.getAssets();
    }

    @httpGet('/:id') 
    public async getAsset(request: Request){
        return await this.inventoryService.getAsset(request.params.id);
    }

    @httpPost('/')
    public async saveAsset(request: Request) {
        let asset = <IAsset>request.body;
        return await this.inventoryService.saveAsset(asset);
    }

    @httpDelete('/:id')
    public async deleteAsset(request: Request){
        let id = request.params.id;
        if(!id){
            return this.badRequest('Missing Id');
        }

        return await this.inventoryService.deleteAsset(id);
    }
}