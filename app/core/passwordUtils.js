"use strict";
var crypto = require("crypto");
var applicationStorage = require("core/application-storage");

/**
 * Get the sha256 hash from a value
 * @param password
 * @returns {*}
 */
module.exports.getHash = function (password) {
    var config = applicationStorage.config;
    return crypto.createHash('sha256').update(password + config.password_salt).digest('hex');
};

/**
 * Get the sha256 hash from a value
 * @param password
 * @returns {*}
 */
module.exports.validateHash = function (hash, password) {
    var config = applicationStorage.config;
    return hash === crypto.createHash('sha256').update(password + config.password_salt).digest('hex');
};