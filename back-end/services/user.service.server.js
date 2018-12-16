var app = require('../../express');
var userModel = require('../models/user/user.model.server');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt-nodejs");
passport.use(new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

var FacebookStrategy = require('passport-facebook').Strategy;
var facebookConfig = {
    clientID     : process.env.FACEBOOK_CLIENT_ID,
    clientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL  : process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['email']
};
passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleConfig = {
    clientID     : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL  : process.env.GOOGLE_CALLBACK_URL
};
passport.use(new GoogleStrategy(googleConfig, googleStrategy));


app.get    ('/api/lufthansa/user/:userId', findUserById);
app.get    ('/api/lufthansa/user', findUserByUsername);
app.get    ('/api/lufthansa/users', isAdmin, findAllUsers);
app.get    ('/api/lufthansa/crew', isAdmin, findAllCrew);
app.get    ('/api/lufthansa/user', findUserByCredentials);
app.post   ('/api/lufthansa/user', isAdmin, createUser);
app.delete ('/api/lufthansa/user/:userId', isAdmin, deleteUser);
app.put    ('/api/lufthansa/user/:userId', updateUser); // to be protected
app.post   ('/api/lufthansa/login', passport.authenticate('local'), login);
app.post   ('/api/lufthansa/logout', logout);
app.get    ('/api/lufthansa/loggedin', loggedin);
app.get    ('/api/lufthansa/checkAdmin', checkAdmin);
app.post   ('/api/lufthansa/register', register);
app.post   ('/api/lufthansa/unregister', unregister);
app.post   ('/api/lufthansa/user/:userId/schedule/:scheduleId', isAdmin, addSchedule);
app.delete ('/api/lufthansa/schedule/:scheduleId', isAdmin, deleteSchedule);

app.get ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/project/index.html#!/profile',
        failureRedirect: '/project/index.html#!/login'
    }));

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/project/index.html#!/profile',
        failureRedirect: '/project/index.html#!/login'
    }));

function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.roles.indexOf('ADMIN') > -1) {
        next(); // continue to next middleware;
    } else {
        res.sendStatus(401);
    }
}

function findAllUsers(req, res) {
    userModel
        .findAllUsers()
        .then(function (users) {
            res.json(users);
        })
}

function findAllCrew(req, res) {
    userModel
        .findAllCrew()
        .then(function (crew) {
            res.json(crew);
        })
}


function localStrategy(username, password, done) {
    userModel
        .findUserByCredentials(username, password)
        .then(
            function(user) {
                if(user && bcrypt.compareSync(password, user.password)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            },
            function(err) {
                done(err, false);
            }
        );
}

function serializeUser(user, done) {
    done(null, user);
}

function deserializeUser(user, done) {
    userModel
        .findUserById(user._id)
        .then(
            function(user){
                done(null, user);
            },
            function(err){
                done(err, null);
            }
        );
}

function login(req, res) {
    var user = req.user;
    res.json(user);
}

function logout(req, res) {
    req.logOut();
    res.sendStatus(200);
}

function loggedin(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
}

function checkAdmin(req, res) {
    res.send(req.isAuthenticated() && req.user.roles.indexOf('ADMIN') > -1 ? req.user : '0');
}

function register(req, res) {
    var userObj = req.body;
    userObj.password = bcrypt.hashSync(userObj.password);

    userModel
        .createUser(userObj)
        .then(function (user) {
            req.login(user, function (status) {
                res.send(status);
            });
        });
}

function unregister(req, res) {
    userModel
        .deleteUser(req.user._id)
        .then(function (user) {
            req.logout();
            res.sendStatus(200);
        });
}


// all parameters send to req
function findUserById (req, res) {
    userId = req.params['userId'];

    userModel
        .findUserById(userId)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.send(err);
        });
}

function findUserByCredentials (req, res) {
    var username = req.query['username'];
    var password = req.query['password'];

    userModel
        .findUserByCredentials(username, password)
        .then(function (user) {
            res.json(user);
        }, function () {
            res.sendStatus(404);
        });
}

function createUser (req, res) {
    var user = req.body;
    userModel
        .createUser(user)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.send(err);
        });
}

function updateUser (req, res) {
    var newUser = req.body;
    var userId = req.params.userId;

    userModel
        .updateUser(userId, newUser)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteUser (req, res) {
    var userId = req.params.userId;

    userModel
        .deleteUser(userId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function findUserByUsername (req, res) {
    var username = req.query['username'];

    userModel
        .findUserByUsername(username)
        .then(function (user) {
            res.json(user);
        }, function () {
            user = null;
            res.send(user);
        });
}

function addSchedule (req, res) {
    var userId = req.params.userId;
    var scheduleId = req.params.scheduleId;

    userModel
        .addSchedule(userId, scheduleId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteSchedule (req, res) {
    var scheduleId = req.params.scheduleId;
    userModel
        .deleteSchedule(scheduleId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function facebookStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByFacebookId(profile.id)
        .then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newFacebookUser = {
                        username:  emailParts[0],
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     email,
                        facebook: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newFacebookUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
        .then(
            function(user){
                return done(null, user);
            },
            function(err){
                if (err) { return done(err); }
            }
        );
}

function googleStrategy(token, refreshToken, profile, done) {
    userModel
        .findUserByGoogleId(profile.id)
        .then(
            function(user) {
                if(user) {
                    return done(null, user);
                } else {
                    var email = profile.emails[0].value;
                    var emailParts = email.split("@");
                    var newGoogleUser = {
                        username:  emailParts[0],
                        firstName: profile.name.givenName,
                        lastName:  profile.name.familyName,
                        email:     email,
                        google: {
                            id:    profile.id,
                            token: token
                        }
                    };
                    return userModel.createUser(newGoogleUser);
                }
            },
            function(err) {
                if (err) { return done(err); }
            }
        )
        .then(
            function(user){
                return done(null, user);
            },
            function(err){
                if (err) { return done(err); }
            }
        );
}