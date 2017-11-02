var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var userModel = require('users/user-model')
var logger = require('core/application-storage').logger
var validateHash = require('core/utilities/password').validateHash

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    userModel.findOne(email, function (error, user) {
      if (error) {
        return done(error)
      }
      if (!user) {
        return done(null, false)
      }

      if (!validateHash(user.password, user.salt, password) && user.active === true) {
        return done(null, false)
      }
      delete user.password
      delete user.salt
      return done(null, user)
    })
  }
))

// noinspection JSUnresolvedFunction
passport.serializeUser(function (user, done) {
  logger.silly('serializeUser %s', user.email)
  done(null, user.email)
})

// noinspection JSUnresolvedFunction
passport.deserializeUser(function (email, done) {
  logger.silly('deserializeUser for email:%s', email)
  // eslint-disable-next-line
  userModel.findOne(email, function (error, user) {
    if (user) {
      delete user.password
      delete user.salt
      done(null, user)
    } else {
      done(null, false)
    }
  })
})
