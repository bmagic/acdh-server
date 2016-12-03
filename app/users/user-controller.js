"use strict";
var async = require("async");
var HttpStatus = require('http-status-codes');
var userModel = require("users/user-model");
var applicationStorage = require("core/application-storage");

/**
 * Register route
 * @param req
 * @param res
 */
module.exports.register = function (req, res) {
    var logger = applicationStorage.logger;
    if (req.body.username && req.body.password) {
        async.series([
                function (callback) {
                    userModel.findOne(req.body.username, function (error, user) {
                        if (user) {
                            callback(true);
                        } else {
                            callback(error);
                        }
                    });
                },
                function (callback) {
                    userModel.insert(req.body.username, req.body.password, function (error) {
                        callback(error);
                    });
                }
            ], function (error) {
                if (error && error === true) {
                    res.status(HttpStatus.CONFLICT).send(HttpStatus.getStatusText(HttpStatus.CONFLICT));
                } else if (error) {
                    logger.error(error);
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
                } else {
                    res.status(HttpStatus.CREATED).send(HttpStatus.getStatusText(HttpStatus.CREATED));
                }
            }
        );
    } else {
        res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST));
    }
};

/**
 * Login route
 * @param req
 * @param res
 */
module.exports.login = function (req, res) {
    var logger = applicationStorage.logger;
    userModel.updateLastLogin(req.user.username, function (error) {
        if (error) {
            logger.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR));
        } else {
            res.status(HttpStatus.OK).send(HttpStatus.getStatusText(HttpStatus.OK));
        }
    });
};

/**
 * Profile route
 * @param req.logger
 * @param res
 */
module.exports.profile = function (req, res) {
    res.status(HttpStatus.OK).json(req.user);
};

/**
 * Logout route
 * @param req
 * @param res
 */
module.exports.logout = function (req, res) {
    req.logout();
    res.status(HttpStatus.NO_CONTENT).send();
};