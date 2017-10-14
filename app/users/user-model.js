'use strict'

//Defines dependencies
var applicationStorage = require('core/application-storage')
var getHashAndSalt = require('core/utilities/password').getHashAndSalt

const databaseName = 'users'

/**
 * Create a new user object
 * @param email
 * @param password
 * @param callback
 */
module.exports.insert = function (email, password, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  var hashAndSalt = getHashAndSalt(password)
  collection.insertOne({email: email, password: hashAndSalt.hash, salt: hashAndSalt.salt}, function (error) {
    callback(error)
  })
}

/**
 * Find an user
 * @param email
 * @param callback
 */
module.exports.findOne = function (email, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.findOne({email: email}, {_id: 0}, function (error, user) {
    callback(error, user)
  })
}

/**
 * Update last login date
 * @param email
 * @param callback
 */
module.exports.updateLastLogin = function (email, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.updateOne({email: email}, {$set: {last_login: new Date().getTime()}}, function (error) {
    callback(error)
  })
}