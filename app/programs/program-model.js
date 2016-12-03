"use strict";

//Defines dependencies
var async = require("async");
var applicationStorage = require("core/application-storage");

const databaseName = "programs";


/**
 * Create a new program
 * @param program
 * @param callback
 */
module.exports.insert = function (program, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.insertOne(program, function (error) {
        callback(error);
    });
};


/**
 * Update program
 * @param id
 * @param program
 * @param callback
 */
module.exports.update = function (id, program, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.updateOne({id: id}, program, function (error) {
        callback(error);
    });
};

/**
 * Find programs
 * @param criteria
 * @param limit
 * @param callback
 */
module.exports.find = function (criteria, limit, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.find(criteria, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(limit).toArray(function (error, programs) {
        callback(error, programs);
    });
};



