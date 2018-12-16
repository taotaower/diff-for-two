var app = require('../../express');
var bookingModel = require('../models/booking/booking.model.server');

app.post('/api/user/:userId/booking', createBooking);
app.get('/api/user/:userId/booking', findAllBookingsForUser);
app.get('/api/booking/:bookingId', findBookingById);
app.get('/api/bookings', isAdmin, findAllBookings);
app.put('/api/booking/:bookingId', updateBooking);
app.delete('/api/booking/:bookingId', deleteBooking);
app.post('/api/booking/:bookingId/:flightId', addFlight);
app.delete('/api/booking/:flightId', deleteFlight);


function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.roles.indexOf('ADMIN') > -1) {
        next(); // continue to next middleware;
    } else {
        res.sendStatus(401);
    }
}

function createBooking(req, res) {
    var booking = req.body;
    var userId = req.params.userId;
    bookingModel
        .createBooking(userId, booking)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function findAllBookingsForUser(req, res) {
    var userId = req.params.userId;
    bookingModel
        .findAllBookingsForUser(userId)
        .then(function (bookings) {
            res.json(bookings);
        }, function (err) {
            res.send(err);
        });
}

function findBookingById(req, res) {
    var bookingId = req.params.bookingId;
    bookingModel
        .findBookingById(bookingId)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function findAllBookings(req, res) {
    bookingModel
        .findAllBookings()
        .then(function (bookings) {
            res.json(bookings);
        })
}

function updateBooking(req, res) {
    var newBooking = req.body;
    var bookingId = req.params.bookingId;
    bookingModel
        .updateBooking(bookingId, newBooking)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteBooking(req, res) {
    var bookingId = req.params.bookingId;

    bookingModel
        .deleteBooking(bookingId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function addFlight(req, res) {
    var bookingId = req.params.bookingId;
    var flightId = req.params.flightId;

    bookingModel
        .addFlight(bookingId, flightId)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function deleteFlight(req, res) {
    var flightId = req.params.flightId;

    bookingModel
        .deleteFlight(flightId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}