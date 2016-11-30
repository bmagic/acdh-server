"use strict";

var constants = require("core/constants");

/**
 * Check if user is authenticated
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAuthenticated = function (req, res, next) {
    if (req.user) {
        return next();
    }
    res.status(403).send(constants.ACCESS_DENIED);
};

/**
 * Check if user is admin
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports.isAdmin = function (req, res, next) {
    if (req.user && req.user.admin === true) {
        return next();
    }
    res.status(403).send(constants.ACCESS_DENIED);
};