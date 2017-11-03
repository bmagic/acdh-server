'use strict'
var randomString = require('randomstring')

// Defines dependencies
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
  var token = randomString.generate(20)
  collection.insertOne({email: email, password: hashAndSalt.hash, salt: hashAndSalt.salt, active: token}, function (error) {
    callback(error, token)
  })
}

/**
 * Find an user from it's email
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
 * Find an user from a token
 * @param token
 * @param callback
 */
module.exports.findOneByToken = function (token, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.findOne({active: token}, {_id: 0, email: 1}, function (error, user) {
    callback(error, user)
  })
}

module.exports.getViewList = function (email, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.findOne({email: email}, {viewList: 1}, function (error, user) {
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

/**
 * Activate an user (active=true)
 * @param email
 * @param callback
 */
module.exports.setActive = function (email, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.updateOne({email: email}, {$set: {active: true}}, function (error) {
    callback(error)
  })
}

/**
 * Delete user
 * @param email
 * @param callback
 */
module.exports.delete = function (email, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.deleteOne({email: email}, function (error) {
    callback(error)
  })
}

/**
 * Add view
 * @param id
 * @param callback
 */
module.exports.addView = function (email, id, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.updateOne({email: email}, {$addToSet: {viewList: id}}, function (error) {
    callback(error)
  })
}

module.exports.deleteView = function (email, id, callback) {
  var collection = applicationStorage.mongo.collection(databaseName)
  collection.updateOne({email: email}, {$pull: {viewList: id}}, function (error) {
    callback(error)
  })
}
