"use strict";

//Defines dependencies
var async = require("async");
var applicationStorage = require("core/application-storage");
var programSchema = require("programs/program-schema");
const databaseName = "programs";


/**
 * Create a new program
 * @param program
 * @param callback
 */
module.exports.insert = function (program, callback) {

    async.series([
        function (callback) {
            programSchema.validate(program, function (error) {
                callback(error);
            });
        },
        function (callback) {
            var collection = applicationStorage.mongo.collection(databaseName);
            collection.insertOne(program, function (error) {
                callback(error);
            });
        }
    ], function (error) {
        callback(error);
    });

};
