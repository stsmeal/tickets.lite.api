import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { jwt } from './utils/authentication/authentication';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import { MongoDBClient } from './utils/mongodb/client';
import * as mongoose from 'mongoose';
import * as compression from 'compression';
import * as config from './config.json';

import TYPES from './constant/types';

import './controllers/user.controller';
import './controllers/ticket.controller';
import './controllers/inventory.controller';
import './utils/mongodb/client';

import { UserService } from './services/user.service';
import { TicketService } from './services/ticket.service';
import { InventoryService } from './services/inventory.service';

// set up container
let container = new Container();

mongoose.connect(config.connectionString + '/' + config.dbName, { useNewUrlParser: true});
//set up bindings
container.bind<MongoDBClient>(TYPES.MongoDBClient).to(MongoDBClient);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<TicketService>(TYPES.TicketService).to(TicketService);
container.bind<InventoryService>(TYPES.InventoryService).to(InventoryService);

//create server 
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors());
  //add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(jwt());
  app.use(compression());
});

let app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');