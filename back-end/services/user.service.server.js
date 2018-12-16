const app = require('../../express');
const userModel = require('../models/user/user.model.server');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get    ('/api/lufthansa/user/:userId', findUserById);
app.get    ('/api/lufthansa/user', findUserByUsername);
app.get    ('/api/lufthansa/users', isAdmin, findAllUsers);

app.get    ('/api/lufthansa/crew', isAdmin, findAllCrew);
app.get    ('/api/lufthansa/checkers', isAdmin, findAllTicketCheckers);

app.get    ('/api/lufthansa/user', findUserByCredentials);
app.post   ('/api/lufthansa/user', createUser);

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
app.post   ('/api/lufthansa/user/findAllPassenger',findAllPassenger);
app.post    ('/api/lufthansa/user/checkinPassenger', checkinPassenger);

app.post    ('/api/lufthansa/user/search', searchUsers);


//
function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'ADMIN') {
        next(); // continue to next middleware;
    } else {
        res.sendStatus(401);
    }
}

function searchUsers(req, res) {
     let user = req.body;
     userModel.find(user)
         .then(function (user) {
         res.json(user);
     }, function (err) {
         res.send(err);
     });
}

function findAllUsers(req, res) {
    userModel
        .findAllUsers()
        .then(function (users) {
            res.json(users);
        })
}

function findAllTicketCheckers(req, res) {
    userModel
        .findAllTicketChecker()
        .then(function (crew) {
            res.json(crew);
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
            user =>{
                console.log("findUserByCredentials");
                done(null,user);
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
    let user = req.user;
    res.json(user);
}

function logout(req, res) {
    req.logOut();
    res.sendStatus(200);
}

function loggedin(req, res) {
    console.log("req.isAuthenticated()",req.isAuthenticated());
    res.send(req.isAuthenticated() ? req.user : '0');
}

function checkAdmin(req, res) {
    res.send(req.isAuthenticated() && req.user.role === 'ADMIN' ? req.user : '0');
}

function register(req, res) {
    let userObj = req.body;
    console.log("userObj",userObj);

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
    let userId = req.params['userId'];
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
    console.log(user);
    userModel
        .createUser(user)
        .then(function (user) {
            res.json(user);
        }, function (err) {
            res.send(err);
        });
}

function updateUser (req, res) {
    let newUser = req.body;
    let userId = req.params.userId;
    console.log("req.params.userId", userId);

    userModel
        .updateUser(userId, newUser)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteUser (req, res) {
    let userId = req.params.userId;

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

function findAllPassenger(req, res){
    let passengerId = req.body;
    userModel
        .findAllPassenger(passengerId)
        .then(
           passengers =>{
               res.json(passengers);
           }, err => {
               res.send(err)
            }
        );
}


function checkinPassenger(req, res){

    let passengerId = req.body.passengerId;
    userModel
        .checkinPassenger(passengerId)
        .then(
            response => {res.json({msg: "success"});
            }
        )
}

