var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var userModel = require("users/user-model");
var logger = require("core/application-storage").logger;
var validateHash = require("core/utilities/password").validateHash;

passport.use(new LocalStrategy(
    function (username, password, done) {
        userModel.findOne(username, function (error, user) {
            if (error) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            if (!validateHash(user.password, user.salt, password)) {
                return done(null, false);
            }
            delete user.password;
            delete user.salt;
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
            delete user.salt;
            done(null, user);
        } else {
            done(null, false);
        }
    });
});
