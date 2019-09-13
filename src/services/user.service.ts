import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import { MongoDBClient } from '../utils/mongodb/client';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import * as config from '../config.json';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';
import Ticket, { ITicket } from '../models/ticket';
import { Note } from '../models/note';
import Asset, { IAsset } from '../models/asset';
import UserIdentity, { IUserIdentity } from '../models/user-identity';
import User, { IUser } from '../models/user';


@injectable()
export class UserService {

    constructor(@inject(TYPES.MongoDBClient) private mongoClient: MongoDBClient) {}

    public async authenticate(username: string, password: string) {
        username = username.toLowerCase();
        let userIdentity = await UserIdentity.findOne({username: username}).exec();
        if(userIdentity && await compare(password, userIdentity.hash)) {
            let user = await User.findOne({username: username}).exec();
            const token = sign(JSON.stringify(user), config.secret);
            return await {user, token}; 
        } else {
            throw 'Incorrect Username or Password';
        }
    }

    public async getAll() {
        return await User.find({}).exec();
    }

    public async create(user: IUser, password: string) {
        user.username = user.username.toLowerCase();
        if(await User.findOne({username: user.username}).exec()){
            throw 'Username is Taken';
        }
        
        let userIdentity = new UserIdentity(); 

        userIdentity.username = user.username;
        userIdentity.hash = await hash(password, 10);

        await userIdentity.save();
        
        return await (new User(user)).save();        
    }

    /*
    public async createShit() {
        
        let ticket = <Ticket> {
            number: 1,
            description: "Stuff in description",
            notes: [
            <Note>{
                type: 1,
                message: "First Note",
                dateCreated: new Date()
            },<Note>{
                type: 1,
                message: "Second Note",
                dateCreated: new Date()
            }]
        }

        let asset1 = <Asset> {
            number: "Asset 1",
            description: "Description of Asset 1",
            notes: [
            <Note>{
                type: 1,
                message: "First Note",
                dateCreated: new Date()
            },<Note>{
                type: 1,
                message: "Second Note",
                dateCreated: new Date()
            }],
            dateCreated: new Date()            
        };

        let asset2 = <Asset> {
            number: "Asset 1",
            description: "Description of Asset 2",
            notes: [
            <Note>{
                type: 1,
                message: "First Note",
                dateCreated: new Date()
            },<Note>{
                type: 1,
                message: "Second Note",
                dateCreated: new Date()
            }],
            dateCreated: new Date()            
        };

        let asset3 = <Asset> {
            number: "Asset 3",
            description: "Description of Asset 3",
            notes: [
            <Note>{
                type: 1,
                message: "First Note",
                dateCreated: new Date()
            },<Note>{
                type: 1,
                message: "Second Note",
                dateCreated: new Date()
            }],
            dateCreated: new Date()            
        };


        let db = this.mongoClient.db;

        await db.collection('Inventory').insertMany([asset1, asset2, asset3]);
        let assets = <Asset[]>(await db.collection('Inventory').find({}).toArray());

        ticket.assets = assets.map(a => a._id);

        await db.collection('Tickets').insert(ticket);
        let result = await db.collection('Tickets').aggregate([
            {
                $lookup:
                {
                    from: "Inventory",
                    localField: "assets",
                    foreignField: "_id",
                    as: 'assets'
                }
            }
        ]).limit(1).toArray();
        
        return await result;
    }

    public async reateShit() {
        let asset1 = new Asset({
            number: "Asset 1",
            description: "Asset Description 1"
        });
        
        let asset2 = new Asset({
            number: "Asset 2",
            description: "Asset Description 2"
        });
        
        let asset3 = new Asset({
            number: "Asset 3",
            description: "Asset Description 3"
        });

        await asset1.save();
        await asset2.save();
        await asset3.save();

        let assets = await Asset.find({}).exec();

        let ticket = new Ticket({
            number: 1,
            description: "Stuff in description",
            assets: assets
        });

        await ticket.save();

        let a = await Asset.findOne({number: "Asset 3"}).exec();
        a.description = "Changed description";
        await Asset.updateOne({number: "Asset 3"},a).exec();
        

        let result = await Ticket.find({}).populate('assets').exec();

        return await result;
    }

    public async eateShit() {
        let ticket = (await Ticket.find({}).populate('assets').exec())[0];

        ticket.assets = null;
        await ticket.save();

        ticket.assets[0].description = "New Changed the Asset Description from ticket";
        ticket.assets.splice(ticket.assets.length - 1, 1);

        let result = await ticket.save();

        return await result;
    }

    public async createShit() {
        let ticket = <ITicket>{
            number: 3,
            description: "Brand ticket",
            assets: [
            <IAsset>{
                number: "Asset 6",
                description: "New Asset 4",
            },<IAsset>{
                number: "Asset 7",
                description: "New Asset 5",
            }]
        };

        Ticket.find({}).populate('assets');
        
        ticket.assets = await Asset.insertMany(ticket.assets);

        let result = await (new Ticket(ticket)).save();

        return await result.toObject();
    }
    */
}