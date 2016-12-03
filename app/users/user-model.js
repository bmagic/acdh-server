"use strict";

//Defines dependencies
var applicationStorage = require("core/application-storage");
var getHashAndSalt = require("core/utilities/password").getHashAndSalt;

const databaseName = "users";


/**
 * Create a new user object
 * @param username
 * @param password
 * @param callback
 */
module.exports.insert = function (username, password, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    var hashAndSalt = getHashAndSalt(password);
    collection.insertOne({username: username, password: hashAndSalt.hash, salt: hashAndSalt.salt}, function (error) {
        callback(error);
    });
};

/**
 * Find an user
 * @param username
 * @param callback
 */
module.exports.findOne = function (username, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.findOne({username: username}, {_id: 0}, function (error, user) {
        callback(error, user);
    });
};

/**
 * Update last login date
 * @param username
 * @param callback
 */
module.exports.updateLastLogin = function (username, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.updateOne({username: username}, {$set: {last_login: new Date().getTime()}}, function (error) {
        callback(error);
    });
};