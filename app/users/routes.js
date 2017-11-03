'use strict'

// Load dependencies
var auth = require('users/middlewares/auth')
var router = require('express').Router()
var passport = require('passport')
var userController = require('users/user-controller')

// Set middleware
require('users/middlewares/local-auth')

// Define routes
router.post('/register', userController.register)
router.post('/validate', userController.validate)
router.post('/login', passport.authenticate('local'), userController.login)
router.get('/profile', userController.profile)
router.get('/logout', auth.isAuthenticated, userController.logout)
router.delete('/', auth.isAuthenticated, userController.delete)
router.post('/views/:id', auth.isAuthenticated, userController.addView)
router.delete('/views/:id', auth.isAuthenticated, userController.deleteView)

module.exports = router
