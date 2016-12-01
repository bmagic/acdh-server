"use strict";

//Defines dependencies
var async = require("async");
var applicationStorage = require("core/application-storage");
var programSchema = require("programs/program-schema");
var HttpError = require("core/utilities/HttpError");

const databaseName = "programs";


/**
 * Create a new program
 * @param program
 * @param callback
 */
module.exports.insert = function (program, callback) {
    async.waterfall([
        function (callback) {
            programSchema.validate(program, function (error, program) {
                callback(error, program);
            });
        },
        function (program, callback) {
            var collection = applicationStorage.mongo.collection(databaseName);
            collection.insertOne(program, function (error) {
                callback(error);
            });
        }
    ], function (error) {
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
    var logger = applicationStorage.logger;
    async.waterfall([
        function (callback) {
            programSchema.validate(program, function (error, program) {
                callback(error, program);
            });
        },
        function (program, callback) {
            var collection = applicationStorage.mongo.collection(databaseName);
            collection.updateOne({id: id}, program, function (error) {
                if (error) {
                    logger.error(error);
                    callback(new HttpError("INTERNAL_SERVER_ERROR", 500));
                } else {
                    callback(null);
                }
            });
        }
    ], function (error) {
        callback(error);
    });

};

/**
 * Find programs
 * @param limit
 * @param callback
 */
module.exports.find = function (limit, callback) {
    var collection = applicationStorage.mongo.collection(databaseName);
    collection.find({}).limit(limit).toArray(function (error, programs) {
        callback(error, programs);
    });
};
