"use strict";

// Set module root directory and define a custom require function
require('app-module-path').addPath(__dirname + '/app');


// Module dependencies
var path = require("path");
var async = require('async');
var mongo = require('mongodb').MongoClient;
var winston = require("winston");
var applicationStorage = require("core/application-storage");
var HttpServer = require("core/http-server");


//Load config file
var env = process.env.NODE_ENV || "development";
applicationStorage.config = require("config/config.json");

async.waterfall([
    //Initialize the logger
    function (callback) {
        //noinspection JSUnresolvedVariable
        var transports = [
            new (require("winston-daily-rotate-file"))({
                filename: applicationStorage.config.logger.folder + "/" + env + ".log",
                json: false,
                handleExceptions: true
            })];
        if (env == "development") {
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
        new HttpServer().start(applicationStorage.config.port, function () {
            applicationStorage.logger.info("Server HTTP listening on port %s", applicationStorage.config.port);
            callback();
        });
    }
]);