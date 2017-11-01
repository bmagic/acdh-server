'use strict'

// Defines dependencies
var applicationStorage = require('core/application-storage')
var ObjectID = require('mongodb').ObjectID

const databaseName = 'programs'

/**
 * Create a new program
 * @param program
 * @param callback
 */
module.exports.insert = function (program, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.insertOne(program, function (error) {
    callback(error)
  })
}

/**
 * Update program
 * @param id
 * @param program
 * @param callback
 */
module.exports.update = function (id, program, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.updateOne({_id: ObjectID(id)}, {$set: program}, function (error) {
    callback(error)
  })
}

/**
 * Find programs
 * @param criteria
 * @param limit
 * @param skip
 * @param callback
 */
module.exports.find = function (criteria, projection, limit, skip, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.find(criteria, projection).sort({date: -1}).limit(limit).skip(skip).toArray(function (error, programs) {
    callback(error, programs)
  })
}

/**
 * Find a program
 * @param id
 * @param callback
 */
module.exports.findOne = function (id, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.findOne({_id: ObjectID(id)}, function (error, program) {
    callback(error, program)
  })
}

/**
 * Count programs
 * @param criteria
 * @param callback
 */
module.exports.count = function (criteria, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.count(criteria, function (error, count) {
    callback(error, count)
  })
}

/**
 * Delete program
 * @param id
 * @param callback
 */
module.exports.delete = function (id, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.deleteOne({_id: ObjectID(id)}, function (error) {
    callback(error)
  })
}
