'use strict'
var async = require('async')
var HttpStatus = require('http-status-codes')
var userModel = require('users/user-model')
var programModel = require('programs/program-model')
var applicationStorage = require('core/application-storage')
var validateEmail = require('core/utilities/email').validateEmail
var Mailjet = require('node-mailjet').connect(applicationStorage.config.mailjet.key, applicationStorage.config.mailjet.secret)
var fs = require('fs')

/**
 * Register route
 * @param req
 * @param res
 */
module.exports.register = function (req, res) {
  var logger = applicationStorage.logger
  if (req.body.email && req.body.password && validateEmail(req.body.email)) {
    async.waterfall([
      function (callback) {
        userModel.findOne(req.body.email, function (error, user) {
          if (user) {
            // eslint-disable-next-line
            callback(true)
          } else {
            callback(error)
          }
        })
      },
      function (callback) {
        userModel.insert(req.body.email, req.body.password, function (error, token) {
          callback(error, token)
        })
      },
      function (token, callback) {
        var emailData = {
          'FromEmail': 'noreply@acdh.fr',
          'FromName': 'ACDH.fr',
          'Subject': 'Bienvenue sur ACDH.fr',
          'HTML-part': fs.readFileSync('app/core/mails/validation.html', 'utf8').replace(/TOKEN/g, token),
          'Recipients': [{'Email': req.body.email}]
        }

        var sendEmail = Mailjet.post('send')
        sendEmail.request(emailData, function (error) {
          callback(error)
        })
      }
    ], function (error) {
      if (error && error === true) {
        res.status(HttpStatus.CONFLICT).send(HttpStatus.getStatusText(HttpStatus.CONFLICT))
      } else if (error) {
        logger.error(error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
      } else {
        // req.login({email: req.body.email}, function (error) {
        //   if (error) {
        //     logger.error(error)
        //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
        //   } else {
        //     res.status(HttpStatus.CREATED).json(req.user)
        //   }
        // })
        res.status(HttpStatus.NO_CONTENT).send()
      }
    }
    )
  } else {
    res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
  }
}

module.exports.validate = function (req, res) {
  var logger = applicationStorage.logger
  if (req.body.token && req.body.token.length === 20) {
    async.waterfall([
      function (callback) {
        userModel.findOneByToken(req.body.token, function (error, user) {
          if (error) {
            callback(error)
          } else {
            if (user) {
              callback(null, user.email)
            } else {
              // eslint-disable-next-line
              callback(true)
            }
          }
        })
      },
      function (email, callback) {
        userModel.setActive(email, function (error) {
          callback(error, email)
        })
      },
      function (email, callback) {
        var emailData = {
          'FromEmail': 'noreply@acdh.fr',
          'FromName': 'ACDH.fr',
          'Subject': 'Bienvenue sur ACDH.fr',
          'HTML-part': fs.readFileSync('app/core/mails/welcome.html', 'utf8'),
          'Recipients': [{'Email': email}]
        }

        var sendEmail = Mailjet.post('send')
        sendEmail.request(emailData, function (error) {
          callback(error, email)
        })
      }
    ], function (error, email) {
      if (error && error === true) {
        res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
      } else if (error) {
        logger.error(error)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
      } else {
        req.login({email: email}, function (error) {
          if (error) {
            logger.error(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
          } else {
            res.status(HttpStatus.CREATED).json(req.user)
          }
        })
      }
    }
    )
  } else {
    res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
  }
}

/**
 * Login route
 * @param req
 * @param res
 */
module.exports.login = function (req, res) {
  var logger = applicationStorage.logger
  userModel.updateLastLogin(req.user.email, function (error) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.OK).json(req.user)
    }
  })
}

/**
 * Profile route
 * @param req
 * @param res
 */
module.exports.profile = function (req, res) {
  var response = {}
  if (req.user) {
    response = req.user
  }
  res.status(HttpStatus.OK).json(response)
}

/**
 * Logout route
 * @param req
 * @param res
 */
module.exports.logout = function (req, res) {
  req.logout()
  res.status(HttpStatus.NO_CONTENT).send()
}

/**
 * Logout route
 * @param req
 * @param res
 */
module.exports.delete = function (req, res) {
  var logger = applicationStorage.logger
  userModel.delete(req.user.email, function (error) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      req.logout()
      res.status(HttpStatus.NO_CONTENT).send()
    }
  })
}

/**
 * Add View
 * @param req
 * @param res
 */
module.exports.addView = function (req, res) {
  var logger = applicationStorage.logger

  async.waterfall([
    function (callback) {
      programModel.exist(req.params.id, function (error, exist) {
        if (!exist) {
          // eslint-disable-next-line
          callback(true)
        } else {
          callback(error)
        }
      })
    },
    function (callback) {
      userModel.addView(req.user.email, req.params.id, function (error) {
        callback(error)
      })
    },
    function (callback) {
      userModel.getViewList(req.user.email, function (error, viewList) {
        callback(error, viewList)
      })
    }], function (error, result) {
    if (error && error === true) {
      res.status(HttpStatus.BAD_REQUEST).send(HttpStatus.getStatusText(HttpStatus.BAD_REQUEST))
    } else if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.OK).json(result.viewList)
    }
  })
}

/**
 * Add View
 * @param req
 * @param res
 */
module.exports.deleteView = function (req, res) {
  var logger = applicationStorage.logger

  async.waterfall([

    function (callback) {
      userModel.deleteView(req.user.email, req.params.id, function (error) {
        callback(error)
      })
    },
    function (callback) {
      userModel.getViewList(req.user.email, function (error, viewList) {
        callback(error, viewList)
      })
    }], function (error, result) {
    if (error) {
      logger.error(error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR))
    } else {
      res.status(HttpStatus.OK).json(result.viewList)
    }
  })
}
