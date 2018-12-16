var app = require('../../express');
var bookingModel = require('../models/reservation/reservation.model.server');

app.post('/api/user/booking', createBooking);
app.get('/api/user/:userId/booking', findAllBookingsForUser);
app.get('/api/booking/:bookingId', findBookingById);
app.get('/api/bookings', isAdmin, findAllBookings);
app.put('/api/booking/:bookingId', updateBooking);
app.delete('/api/booking/:bookingId', deleteBooking);
app.post('/api/booking/addFlight/update', addFlight);
app.delete('/api/booking/:flightId', deleteFlight);

app.post('/api/booking/flight/reservations', findBookingsByFlightWithPass);


function isAdmin(req, res, next) {
    if(req.isAuthenticated() && req.user.role ==='ADMIN') {
        next(); // continue to next middleware;
    } else {
        res.sendStatus(401);
    }
}

function findBookingsByFlightWithPass(req, res){
    let flight = req.body.flight;
    bookingModel
        .findBookingsByFlightWithPass(flight)
        .then(
            bookings => {
                res.json(bookings);
            },
            err => {
                res.send(err);
            }

        )
}

function createBooking(req, res) {
    var booking = req.body;
    // var userId = req.params.userId;
    bookingModel
        .createReservation(booking)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function findAllBookingsForUser(req, res) {
    var userId = req.params.userId;
    bookingModel
        .findAllReservationsForUser(userId)
        .then(function (bookings) {
            res.json(bookings);
        }, function (err) {
            res.send(err);
        });
}

function findBookingById(req, res) {
    var bookingId = req.params.bookingId;
    bookingModel
        .findReservationById(bookingId)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function findAllBookings(req, res) {
    bookingModel
        .findAllReservations()
        .then(function (bookings) {
            res.json(bookings);
        })
}

function updateBooking(req, res) {
    var newBooking = req.body;
    var bookingId = req.params.bookingId;
    bookingModel
        .updateReservation(bookingId, newBooking)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function deleteBooking(req, res) {
    var bookingId = req.params.bookingId;

    bookingModel
        .deleteReservation(bookingId)
        .then(function () {
            res.sendStatus(200);
        }, function (err) {
            res.send(err);
        });
}

function addFlight(req, res) {
    var bookingId = req.body.bookingId;
    var flightId = req.body.flightId;

    bookingModel
        .addFlight(bookingId, flightId)
        .then(function (booking) {
            res.json(booking);
        }, function (err) {
            res.send(err);
        });
}

function deleteFlight(req, res) {
    // var flightId = req.params.flightId;
    //
    // bookingModel
    //     .deleteFlight(flightId)
    //     .then(function () {
    //         res.sendStatus(200);
    //     }, function (err) {
    //         res.send(err);
    //     });
}