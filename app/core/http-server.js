'use strict'

// Load dependencies
var http = require('http')
var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var passport = require('passport')
var compression = require('compression')
var applicationStorage = require('core/application-storage')
var HttpStatus = require('http-status-codes')

var app = express()

/**
 * HttpServer
 * @class HttpServer
 * @constructor
 */
module.exports.start = function (port, callback) {
  var config = applicationStorage.config
  var logger = applicationStorage.logger

  var server = http.createServer(app)

  // Create sessionStore inside Mongodb
  var sessionStore = new MongoStore({db: applicationStorage.mongo})

  app.use(compression({threshold: 0}))

  // Update Session store with opened database connection
  // Allowed server to restart without loosing any session
  // noinspection JSUnresolvedVariable
  this.app.use(session({
    key: 'acdh.sid',
    cookie: {maxAge: 3600000 * 24 * 14},
    secret: config.session_secret,
    store: sessionStore,
    saveUninitialized: true,
    resave: true
  }))

  app.use(cookieParser())

  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  // noinspection JSUnresolvedFunction
  app.use(passport.initialize())
  // noinspection JSUnresolvedFunction
  app.use(passport.session())

  this.app.use(function (req, res, next) {
    if (req.headers.origin) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, CONNECT')
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
      res.setHeader('Access-Control-Expose-Headers', 'X-count')
      res.setHeader('Access-Control-Allow-Credentials', true)
    }
    next()
  })

  // Log all other request and send 404
  app.use(function (req, res, next) {
    // noinspection JSUnresolvedVariable
    if (applicationStorage.env === 'dev') {
      logger.info('ip:%s method:%s path:%s params:%s body:%s query:%s', req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path, JSON.stringify(req.params), JSON.stringify(req.body), JSON.stringify(req.query))
    } else {
      logger.info('ip:%s method:%s ', req.headers['x-forwarded-for'] || req.connection.remoteAddress, req.method, req.path)
    }
    next()
  })

  // Initialize api v1 routes
  app.use('/api/v1/users', require('users/routes.js'))
  app.use('/api/v1/programs', require('programs/routes.js'))

  // Log all other request and send 404
  app.use(function (req, res) {
    logger.error('Error 404 on request %s', req.url)
    res.status(HttpStatus.NOT_FOUND).send(HttpStatus.getStatusText(HttpStatus.NOT_FOUND))
  })

  server.listen(port, function () {
    callback()
  })
}

module.exports.app = app
