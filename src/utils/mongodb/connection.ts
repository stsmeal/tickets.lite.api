import { Db, MongoClient } from 'mongodb';
import * as config from '../../config.json';

export class MongoDBConnection {
    private static isConnected: boolean = false;
    private static db: Db;

    public static getConnection(result: (connection) => void) {
        if (this.isConnected) {
          return result(this.db);
        } else {
          this.connect((error, db: Db) => {
            return result(this.db);
          });
        }
      }
    
      private static connect(result: (error, db: Db) => void) {
        MongoClient.connect(config.connectionString, (err, client) => {
          this.db = client.db(config.configurationDatabase);
          this.isConnected = true;
          return result(err, this.db);
        });
      }
}