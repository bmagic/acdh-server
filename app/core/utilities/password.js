"use strict";
var crypto = require("crypto");
var randomString = require("randomstring");

/**
 * Get the sha256 hash from a value
 * @param password
 * @returns {*}
 */
module.exports.getHashAndSalt = function (password) {
    var salt = randomString.generate();
    var hash = crypto.createHash('sha256').update(password + salt).digest('hex');
    return ({hash: hash, salt: salt} )
};

/**
 * Get the sha256 hash from a value
 * @param hash
 * @param salt
 * @param password
 * @returns {*}
 */
module.exports.validateHash = function (hash, salt, password) {
    return hash === crypto.createHash('sha256').update(password + salt).digest('hex');
};