var app = require('../../express');
var scheduleModel = require('../models/schedule/schedule.model.server');

app.post('/api/schedule/createSchedule', isAdmin, createSchedule);
app.get('/api/user/:userId/schedule', findAllSchedulesForUser);
app.get('/api/schedule/:scheduleId', findScheduleById);
app.get('/api/schedules', isAdmin, findAllSchedules);
app.put('/api/schedule/:scheduleId', isAdmin, updateSchedule);
app.delete('/api/schedule/:scheduleId', isAdmin, deleteSchedule);
app.post('/api/schedule/:scheduleId/:flightId', isAdmin, addFlightIntoSchedule);
app.delete('/api/schedule/:flightId', isAdmin, deleteFlight);
app.get('/api/schedules/checker/:id', checkerSchedules);
app.get('/api/schedules/crew/:id', crewSchedules);


function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.role === 'ADMIN') {
        next(); // continue to next middleware;
    } else {
        res.sendStatus(401);
    }
}

function checkerSchedules(req, res){
    let id = req.params.id;
    scheduleModel
        .findSchedulesByChecker(id)
        .then(
            function (schedules) {
                res.json(schedules);
            }, function (err) {
                res.send(err);
            }
        )
}
function crewSchedules(req, res){
    let id = req.params.id;
    scheduleModel
        .findSchedulesByCrew(id)
        .then(
            function (schedules) {
                res.json(schedules);
            }, function (err) {
                res.send(err);
            }
        )
}

function createSchedule(req, res) {
    console.log("sadadasdasdas");
    let schedule = req.body;
    scheduleModel
        .createScheduleOnly(schedule)
        .then(function (schedule) {
            res.json(schedule);
        }, function (err) {
            res.send(err);
        });
}

function findAllSchedulesForUser(req, res) {
    var userId = req.params.userId;
    scheduleModel
        .findAllSchedulesForUser(userId)
        .then(function (schedules) {
            res.json(schedules);
        }, function (err) {
            res.send(err);
        });
}

function findScheduleById(req, res) {
    var scheduleId = req.params.scheduleId;
    scheduleModel
        .findScheduleById(scheduleId)
        .then(function (schedule) {
            res.json(schedule);
        }, function (err) {
            res.send(err);
        });
}

function findAllSchedules(req, res) {
    scheduleModel
        .findAllSchedules()
        .then(function (schedules) {
            res.json(schedules);
        })
}

function updateSchedule(req, res) {
    var newSchedule = req.body;
    var scheduleId = req.params.scheduleId;
    scheduleModel
        .updateSchedule(scheduleId, newSchedule)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteSchedule(req, res) {
    var scheduleId = req.params.scheduleId;

    scheduleModel
        .deleteSchedule(scheduleId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function addFlightIntoSchedule(req, res) {
    var scheduleId = req.params.scheduleId;
    var flightId = req.params.flightId;

    scheduleModel
        .addFlightIntoSchedule(scheduleId, flightId)
        .then(function (schedule) {
            res.json(schedule);
        }, function (err) {
            res.send(err);
        });
}

function deleteFlight(req, res) {
    var flightId = req.params.flightId;

    scheduleModel
        .deleteFlight(flightId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}