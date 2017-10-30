'use strict'

var path = require('path')
// Set module root directory and define a custom require function
require('app-module-path').addPath(path.join(__dirname, 'app'))

// Module dependencies
var async = require('async')
var mongo = require('mongodb').MongoClient

var winston = require('winston')
var applicationStorage = require('core/application-storage')
var httpServer = require('core/http-server')

// Load config file
applicationStorage.config = require('config/config.js')

async.waterfall([
  // Initialize the logger
  function (callback) {
    applicationStorage.logger = new (winston.Logger)({
      level: applicationStorage.config.log_level,
      transports: [new (winston.transports.Console)({handleExceptions: true})]
    })

    applicationStorage.logger.info('Logger initialized')
    callback()
  },
  // Connect to mongo
  function (callback) {
    console.log(applicationStorage.config.database)
    mongo.connect(applicationStorage.config.database, function (error, db) {
      applicationStorage.logger.info('Mongo connected')
      applicationStorage.mongo = db
      callback(error)
    })
  },
  // Start the HTTP server
  function (callback) {
    httpServer.start(applicationStorage.config.port, function () {
      applicationStorage.logger.info('Server HTTP listening on port %s', applicationStorage.config.port)
      callback()
    })
  }
], function (error) {
  if (error) { console.error(error) }
})

module.exports.httpServer = httpServer.app
module.exports.config = applicationStorage.config
