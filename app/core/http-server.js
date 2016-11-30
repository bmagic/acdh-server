"use strict";

//Load dependencies
var http = require('http');
var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var passport = require("passport");
var compression = require('compression');
var applicationStorage = require('core/application-storage');


/**
 * HttpServer
 * @class HttpServer
 * @constructor
 */
function HttpServer() {
    var config = applicationStorage.config;
    var logger = applicationStorage.logger;

    this.app = express();
    this.server = http.createServer(this.app);

    //Create sessionStore inside Mongodb
    var sessionStore = new mongoStore({db: applicationStorage.mongo});

    this.app.use(compression({threshold: 0}));

    //Update Session store with opened database connection
    //Allowed server to restart without loosing any session
    //noinspection JSUnresolvedVariable
    this.app.use(session({
        key: 'acdh.sid',
        cookie: {maxAge: 3600000 * 24 * 14},
        secret: config.session_secret,
        store: sessionStore,
        saveUninitialized: true,
        resave: true
    }));

    this.app.use(cookieParser());

    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    //noinspection JSUnresolvedFunction
    this.app.use(passport.initialize());
    //noinspection JSUnresolvedFunction
    this.app.use(passport.session());


    //Log all other request and send 404
    this.app.use(function (req, res, next) {
        //noinspection JSUnresolvedVariable
        logger.info("ip:%s method:%s path:%s params:%s body:%s query:%s ", req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params), JSON.stringify(req.body), JSON.stringify(req.query));
        next();
    });

    //Initialize api v1 routes
    this.app.use('/api/v1/users', require("users/routes.js"));

    //Catch all error and log them
    this.app.use(function (error, req, res) {
        logger.error("Error on request", error);
        res.status(error.statusCode).json({error: error.statusCode, message: "Internal Server Error"});
    });

    //Log all other request and send 404
    this.app.use(function (req, res) {
        logger.error("Error 404 on request %s", req.url);
        res.status(404).send();
    });

}

/**
 * Starts the HTTP server.
 * @method start
 */
HttpServer.prototype.start = function (port, callback) {
    // Start server
    this.server.listen(port, function () {
        callback();
    });
};


module.exports = HttpServer;

