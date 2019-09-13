
import { Db, ObjectID, FindOneOptions, Collection } from 'mongodb';
import { injectable } from 'inversify';
import { MongoDBConnection } from './connection';

@injectable()
export class MongoDBClient {
    public db: Db;

    constructor() {
        MongoDBConnection.getConnection((connection) => {
            this.db = connection;
        });
    }

    public find(collection: string, filter: Object, result: (error, data) => void): void {
        this.db.collection(collection).find(filter).toArray((error, find) => {
            return result(error, find);
        });
    }

    public async findAsync(collection, filter: Object) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(filter).toArray((error, find) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(find);
                }
            });
        });
    }

    public findOne(collection: string, filter: Object, result: (error, data) => void): void {
        this.db.collection(collection).find(filter).toArray((error, find) => {
            return result(error, find);
        });
    }

    public async findOneAsync(collection, filter: Object) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(filter).limit(1).toArray(
                (error, find) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(find[0]);
                    }
                });
        });
    }

    public findOneById(collection: string, objectId: string, result: (error, data) => void): void {
        this.db.collection(collection).find({ _id: new ObjectID(objectId) }).limit(1).toArray((error, find) => {
            return result(error, find[0]);
        });
    }

    public async findOneByIdAsync(collection, objectId: string) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find({ _id: new ObjectID(objectId) }).limit(1).toArray(
                (error, find) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(find);
                    }
                });
        });
    }

    public insert(collection: string, model: any, result: (error, data) => void): void {
        this.db.collection(collection).insertOne(model, (error, insert) => {
            return result(error, insert.ops[0]);
        });
    }

    
    public async insertAsync(collection: string, model: any) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).insertOne(model,
                (error, insert) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(insert.ops[0]);
                    }
                });
        });
    }

    public update(collection: string, objectId: string, model: any, result: (error, data) => void): void {
        this.db.collection(collection).updateOne(
            { _id: new ObjectID(objectId) },
            { $set: model },
            (error, update) => result(error, model)
        );
    }

    public remove(collection: string, objectId: string, result: (error, data) => void): void {
        this.db.collection(collection).deleteOne({ _id: new ObjectID(objectId) }, (error, remove) => {
            return result(error, remove);
        });
    }
}