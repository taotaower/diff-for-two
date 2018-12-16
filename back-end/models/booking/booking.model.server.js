var mongoose = require('mongoose');
var bookingSchema = require('./booking.schema.server');
var bookingModel = mongoose.model('BookingModel', bookingSchema);
var userModel = require('../user/user.model.server');
var flightModel = require('../flight/flight.model.server');

bookingModel.createBooking = createBooking;
bookingModel.findBookingById = findBookingById;
bookingModel.findAllBookingsForUser = findAllBookingsForUser;
bookingModel.findAllBookings = findAllBookings;
bookingModel.updateBooking = updateBooking;
bookingModel.deleteBooking = deleteBooking;
bookingModel.addFlight = addFlight;
bookingModel.deleteFlight = deleteFlight;

module.exports = bookingModel;

function createBooking(userId, booking) {
    booking._user = userId;
    return bookingModel.create(booking)
        .then(function (booking) {
            userModel.addBooking(userId, booking._id); // add reference of booking to user
            return booking;
        });
}

function findBookingById(bookingId) {
    return bookingModel.findById(bookingId);
}

function findAllBookingsForUser(userId) {
    return bookingModel.find({_user: userId})
        .populate('_user')
        .exec();
}

function findAllBookings() {
    return bookingModel.find();
}

function updateBooking(bookingId, newBooking) {
    return bookingModel.update({_id: bookingId}, {$set: newBooking});
}

function deleteBooking(bookingId) {
    return bookingModel
        .remove({_id: bookingId})
        .then(function (status) {
            userModel.deleteBooking(bookingId);
            flightModel.deleteBooking(bookingId);
            return status;
        });
}

// when you create a new booking, the existence of a flight is unknown, so add the reference of FLIGHT to BOOKING first,
// then add the reference of BOOKING to FLIGHT.
function addFlight(bookingId, flightId) {
    return bookingModel
        .findById(bookingId)
        .then(function (booking) {
            flightModel.addBooking(flightId, booking._id); // every time a booking is added, add its reference to flight
            booking.flights.push(flightId);
            // console.log(booking);
            return booking.save();
        });
}

// This function may not be executed.
// In most cases, flight shouldn't be deleted, so the reference of it in booking shouldn't be deleted, either.
// NOTE: "A flight is cancelled" !== "A flight is deleted"
function deleteFlight(flightId) {
    return bookingModel
        .find({flights:flightId})
        .then(function (bookings) {
            var booking = bookings[0];
            var index = booking.flights.indexOf(flightId);
            booking.flights.splice(index, 1);
            return booking.save();
        });
}
