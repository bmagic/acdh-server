'use strict'
var async = require('async')
var programModel = require('programs/program-model.js')
var programSchema = require('programs/program-schema')
var HttpStatus = require('http-status-codes')
var applicationStorage = require('core/application-storage')

module.exports.getProgram = function (req, res) {
  var logger = applicationStorage.logger
  programModel.findOne(req.params.id, function (error, program) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else if (program) {
      res.status(HttpStatus.OK).json(program)
    } else {
      res.status(HttpStatus.NOT_FOUND).send(HttpStatus.getStatusText(HttpStatus.NOT_FOUND))
    }
  })
}

module.exports.getPrograms = function (req, res) {
  var logger = applicationStorage.logger
  var itemNumber = 10
  var criteria = {}
  var projection = {title: 1, date: 1, url: 1}
  var sort = {date: -1}
  if (req.query.search) {
    criteria = {$text: {$search: req.query.search}}
    sort = {score: {$meta: 'textScore'}}
    projection.score = {$meta: 'textScore'}
  }

  var skip = 0
  if (req.query.page) {
    var page = parseInt(req.query.page, 10)
    if (!isNaN(page)) {
      if (page > 0) {
        skip = page * itemNumber
      }
    }
  }

  async.parallel({
    programs: function (callback) {
      programModel.find(criteria, projection, sort, itemNumber, skip, function (error, programs) {
        callback(error, programs)
      })
    },
    count: function (callback) {
      programModel.count(criteria, function (error, count) {
        callback(error, count)
      })
    }
  }, function (error, results) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.OK).json(results)
    }
  })
}

module.exports.getTags = function (req, res) {
  var logger = applicationStorage.logger
  var criteria = {}
  if (req.query.search) {
    criteria = {$or: [{tags: {$regex: req.query.search, $options: 'i'}}]}
  }
  programModel.findTags(criteria, function (error, programs) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.OK).json(programs)
    }
  })
}

module.exports.createProgram = function (req, res) {
  var logger = applicationStorage.logger
  async.waterfall([
    function (callback) {
      programSchema.validate(req.body, function (error, program) {
        if (error) {
          logger.error(error)
          res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
        } else {
          callback(null, program)
        }
      })
    },
    function (program) {
      programModel.insert(program, function (error) {
        if (error) {
          logger.error(error)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
        } else {
          res.status(HttpStatus.CREATED).json(program)
        }
      })
    }
  ])
}

module.exports.updateProgram = function (req, res) {
  var logger = applicationStorage.logger
  async.waterfall([
    function (callback) {
      programSchema.validate(req.body, function (error, program) {
        if (error) {
          logger.error(error)
          res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
        } else {
          callback(null, program)
        }
      })
    },
    function (program) {
      programModel.update(req.params.id, program, function (error) {
        if (error) {
          logger.error(error)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
        } else {
          res.status(HttpStatus.NO_CONTENT).send(HttpStatus.getStatusText(HttpStatus.NO_CONTENT))
        }
      })
    }
  ])
}

module.exports.deleteProgram = function (req, res) {
  var logger = applicationStorage.logger
  programModel.delete(req.params.id, function (error) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.NO_CONTENT).send(HttpStatus.getStatusText(HttpStatus.NO_CONTENT))
    }
  })
}
