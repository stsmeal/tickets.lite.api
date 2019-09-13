"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cors = require("cors");
require("reflect-metadata");
var inversify_1 = require("inversify");
var inversify_express_utils_1 = require("inversify-express-utils");
var user_service_1 = require("./services/user.service");
var types_1 = require("./constant/types");
var authentication_1 = require("./utils/authentication/authentication");
require("./controllers/user.controller");
require("./controllers/ticket.controller");
require("./utils/mongodb/client");
var client_1 = require("./utils/mongodb/client");
var mongoose = require("mongoose");
var config = require("./config.json");
var ticket_service_1 = require("./services/ticket.service");
var compression = require("compression");
var container = new inversify_1.Container();
mongoose.connect(config.connectionString + '/' + config.dbName, { useNewUrlParser: true });
container.bind(types_1.default.MongoDBClient).to(client_1.MongoDBClient);
container.bind(types_1.default.UserService).to(user_service_1.UserService);
container.bind(types_1.default.TicketService).to(ticket_service_1.TicketService);
var server = new inversify_express_utils_1.InversifyExpressServer(container);
server.setConfig(function (app) {
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(authentication_1.jwt());
    app.use(compression());
});
var app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');
//# sourceMappingURL=app.js.map