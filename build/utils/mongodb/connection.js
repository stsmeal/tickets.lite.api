"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var config = require("../../config.json");
var MongoDBConnection = (function () {
    function MongoDBConnection() {
    }
    MongoDBConnection.getConnection = function (result) {
        var _this = this;
        if (this.isConnected) {
            return result(this.db);
        }
        else {
            this.connect(function (error, db) {
                return result(_this.db);
            });
        }
    };
    MongoDBConnection.connect = function (result) {
        var _this = this;
        mongodb_1.MongoClient.connect(config.connectionString, function (err, client) {
            _this.db = client.db(config.dbName);
            _this.isConnected = true;
            return result(err, _this.db);
        });
    };
    MongoDBConnection.isConnected = false;
    return MongoDBConnection;
}());
exports.MongoDBConnection = MongoDBConnection;
//# sourceMappingURL=connection.js.map