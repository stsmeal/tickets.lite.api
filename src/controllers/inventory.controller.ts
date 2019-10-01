import { controller, httpPost, httpGet, BaseHttpController, httpDelete } from 'inversify-express-utils';
import { Request } from 'express';
import { inject } from 'inversify';
import TYPES from '../constant/types';
import { InventoryService } from '../services/inventory.service';
import { Asset } from '../models/asset';

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
        let asset = <Asset>request.body;
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

    @httpPost('/quicksearch')
    public async quickSearch(request: Request){
        let searchText = request.body.searchText;

        return await this.inventoryService.quickSearch(searchText);
    }

    @httpPost('/query')
    public async query(request: Request){
        let query = request.body;
        return await this.inventoryService.query(query);
    }
}