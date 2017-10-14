'use strict'

// Set module root directory and define a custom require function
require('app-module-path').addPath(__dirname + '/app')

// Module dependencies
var path = require('path')
var async = require('async')
var mongo = require('mongodb').MongoClient
var elasticsearch = require('elasticsearch')

var winston = require('winston')
var applicationStorage = require('core/application-storage')
var httpServer = require('core/http-server')

var app = null

//Load config file
var env = process.env.NODE_ENV || 'dev'
applicationStorage.config = require('config/config.' + env + '.js')

async.waterfall([
  //Initialize the logger
  function (callback) {
    applicationStorage.logger = new (winston.Logger)({
      level: applicationStorage.config.logger.level,
      transports: [new (winston.transports.Console)({handleExceptions: true})]
    })

    applicationStorage.logger.info('Logger initialized')
    callback()
  },
  //Connect to mongo
  function (callback) {
    mongo.connect(applicationStorage.config.database, function (error, db) {
      applicationStorage.logger.info('Mongo connected')
      applicationStorage.mongo = db
      callback(error)
    })
  },
  //Connect to elasticsearch
  // function (callback) {
  //     applicationStorage.logger.info("ElasticSearch connected");
  //     applicationStorage.elasticsearch = elasticsearch.Client({
  //         host: 'localhost:9200'
  //     });
  //
  //     applicationStorage.elasticsearch.ping({
  //         requestTimeout: 3000
  //     }, function(error) {
  //         callback(error)
  //     });
  //
  // },
  //Start the HTTP server
  function (callback) {
    httpServer.start(applicationStorage.config.port, function () {
      applicationStorage.logger.info('Server HTTP listening on port %s', applicationStorage.config.port)
      callback()
    })
  }
], function (error) {
  if (error)
    console.error(error)
})

module.exports.httpServer = httpServer.app
module.exports.config = applicationStorage.config