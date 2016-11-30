"use strict";
var async = require("async");
var constants = require("core/constants");
var userModel = require("users/user-model");
/**
 * Register route
 * @param req
 * @param res
 */
module.exports.register = function (req, res) {
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
                    res.status(409).send(constants.USER_ALREADY_EXIST);
                } else if (error) {
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                } else {
                    res.status(201).send(constants.USER_CREATED)
                }
            }
        );
    } else {
        res.status(400).send(constants.MISSING_PARAMETER);
    }
};

/**
 * Login route
 * @param req
 * @param res
 */
module.exports.login = function (req, res) {


    userModel.updateLastLogin(req.user.username, function (error) {
        if (error) {
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        } else {
            res.status(200).send(constants.USER_CONNECTED);
        }
    });


};

/**
 * Profile route
 * @param req.logger
 * @param res
 */
module.exports.profile = function (req, res) {
    res.json(req.user);
};

/**
 * Logout route
 * @param req
 * @param res
 */
module.exports.logout = function (req, res) {
    req.logout();
    res.status(204).send();
};