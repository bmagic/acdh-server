"use strict";

// Set module root directory and define a custom require function
require('app-module-path').addPath(__dirname + '/app');


// Module dependencies
var path = require("path");
var async = require('async');
var mongo = require('mongodb').MongoClient;
var winston = require("winston");
var applicationStorage = require("core/application-storage");
var httpServer = require("core/http-server");

var app = null;


//Load config file
var env = process.env.NODE_ENV || "dev";
applicationStorage.config = require("config/config." + env + ".js");

async.waterfall([
    //Initialize the logger
    function (callback) {
        var transports = [
            new (require("winston-daily-rotate-file"))({
                filename: applicationStorage.config.logger.folder + "/" + env + ".log",
                json: false,
                handleExceptions: true
            })];
        if (env == "dev") {
            transports.push(new (winston.transports.Console)({handleExceptions: true}));
        }

        applicationStorage.logger = new (winston.Logger)({
            level: applicationStorage.config.logger.level,
            transports: transports
        });

        applicationStorage.logger.info("Logger initialized");
        callback();
    },
    //Connect to database
    function (callback) {
        mongo.connect(applicationStorage.config.database, function (error, db) {
            applicationStorage.logger.info("Mongo connected");
            applicationStorage.mongo = db;
            callback(error);
        });
    },
    //Start the HTTP server
    function (callback) {
        httpServer.start(applicationStorage.config.port, function () {
            applicationStorage.logger.info("Server HTTP listening on port %s", applicationStorage.config.port);
            callback();
        });
    }
]);

module.exports.httpServer = httpServer.app;
module.exports.config = applicationStorage.config;