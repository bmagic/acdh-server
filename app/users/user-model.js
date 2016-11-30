"use strict";

//Defines dependencies
var applicationStorage = require("core/application-storage");
var passwordUtils = require("core/passwordUtils");


/**
 * Create a new user object
 * @param username
 * @param password
 * @param callback
 */
module.exports.insert = function (username, password, callback) {
    var collection = applicationStorage.mongo.collection("users");
    var hash = passwordUtils.getHash(password);
    collection.insertOne({username: username, password: hash}, function (error) {
        callback(error);
    });
};

/**
 * Find an user
 * @param username
 * @param callback
 */
module.exports.findOne = function (username, callback) {
    var collection = applicationStorage.mongo.collection("users");
    collection.findOne({username: username}, {_id: 0}, function (error, user) {
        callback(error, user);
    });
};