import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyExpressServer, interfaces, TYPE } from 'inversify-express-utils';
import { jwt } from './utils/authentication/authentication';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as mongoose from 'mongoose';
import * as compression from 'compression';
import * as config from './config.json';

import TYPES from './constant/types';

import './controllers/auth.controller';
import './controllers/user.controller';
import './controllers/ticket.controller';
import './controllers/inventory.controller';
import './controllers/notification.controller';
import './utils/mongodb/client';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TicketService } from './services/ticket.service';
import { InventoryService } from './services/inventory.service';
import { Context } from './context/context';
import { AuthProvider } from './utils/authentication/auth-provider';
import { AuthContext } from './context/auth-context';
import { UserProvider } from './providers/user-provider';
import { NotificationService } from './services/notification.service';

// set up container
let container = new Container();

mongoose.connect(config.connectionString + '/' + config.dbName, { useNewUrlParser: true});
//set up bindings
container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<TicketService>(TYPES.TicketService).to(TicketService);
container.bind<InventoryService>(TYPES.InventoryService).to(InventoryService);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);

container.bind<AuthContext>(TYPES.AuthContext).to(AuthContext);

container.bind<Context>(TYPES.Context).toDynamicValue((ctx) => {
  const httpContext = ctx.container.get<interfaces.HttpContext>(TYPE.HttpContext);
  let context = new Context();
  if(httpContext && httpContext.user && httpContext.user.details){
    context.setSite(httpContext.user.details.site.toLowerCase());
  }
  
  return context;
}).inRequestScope();

container.bind<UserProvider>(TYPES.UserProvider).toDynamicValue((ctx) => {
  const httpContext = ctx.container.get<interfaces.HttpContext>(TYPE.HttpContext);
  let userProvider = new UserProvider();
  if(httpContext && httpContext.user && httpContext.user.details){
    userProvider.user = httpContext.user.details;
  } else {
    userProvider.user = null;
  }
  
  return userProvider;
}).inRequestScope();

//create server 
let server = new InversifyExpressServer(container, null, null, null, AuthProvider);
server.setConfig((app) => {
  app.use(cors());
  //add body parser
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(jwt());
  app.use(compression());
});

let app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');