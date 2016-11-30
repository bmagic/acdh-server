var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userModel = require("users/user-model");
var logger = require("core/application-storage").logger;
var passwordUtils = require("core/passwordUtils");

passport.use(new LocalStrategy(
    function (username, password, done) {
        userModel.findOne(username, function (error, user) {

            if (error) {
                return done(err);
            }
            if (!user) {
                return done(null, false,{message:"test"});
            }
            if (!passwordUtils.validateHash(user.password,password)) {
                return done(null, false,{message:"test"});
            }
            return done(null, user);
        });
    }
));

//noinspection JSUnresolvedFunction
passport.serializeUser(function (user, done) {
    logger.silly("serializeUser %s", user.username);
    done(null, user.username);
});


//noinspection JSUnresolvedFunction
passport.deserializeUser(function (username, done) {
    logger.silly("deserializeUser for username:%s", username);
    userModel.findOne(username, function (error, user) {
        if (user) {
            delete user.password;
            done(null, user);
        } else {
            done(null, false);
        }
    });
});
