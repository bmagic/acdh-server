"use strict";

//Load dependencies
var router = require("express").Router();
var passport = require("passport");
var auth = require("users/middlewares/auth");
var userController = require("users/user-controller");

//Set middleware
require("users/middlewares/local-auth");


//Define routes
router.post("/register", userController.register);
router.post('/login', passport.authenticate('local'), userController.login);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);

module.exports = router;

