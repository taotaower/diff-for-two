const mongoose = require('mongoose');
let flightSchema = require('./flight.schema.server');
let flightModel = mongoose.model('FlightModel', flightSchema);
let bookingModel = require('../reservation/reservation.model.server');

flightModel.createFlight = createFlight;
flightModel.createFlightOnly = createFlightOnly;
flightModel.findFlightById = findFlightById;
flightModel.findAllFlightsForBooking = findAllFlightsForBooking;
flightModel.findAllFlights = findAllFlights;
flightModel.updateFlight = updateFlight;
flightModel.deleteFlight = deleteFlight;
flightModel.findFlightByFlightInfo = findFlightByFlightInfo;
flightModel.addBooking = addBooking;
flightModel.deleteBooking = deleteBooking;
flightModel.addSchedule = addSchedule;
flightModel.deleteSchedule = deleteSchedule;

module.exports = flightModel;


function createFlight(bookingId, flight) { // A certain Flight will be created for once ONLY.
    return flightModel.create(flight)
        .then(function (flight) {// add reference of flight to booking
            return bookingModel.addFlight(bookingId, flight._id);
        });
}

function createFlightOnly(flight){
    return flightModel.create(flight)
}

function findFlightById(flightId) {
    return flightModel.findById(flightId);
}

function findAllFlightsForBooking(bookingId) {
    return flightModel.find({_booking: bookingId})
        .populate('_booking')
        .exec();
}

function findAllFlights() {
    return flightModel.find();
}

function updateFlight(flightId, newFlight) {
    return flightModel.update({_id: flightId}, {$set: newFlight});
}

function deleteFlight(flightId) {
    return flightModel
        .remove({_id: flightId})
        .then(function (status) {
            var bookingModel = require('../booking/booking.model.server');
            var scheduleModel = require('../schedule/schedule.model.server');
            bookingModel.deleteFlight(flightId);
            scheduleModel.deleteFlight(flightId);
            return status;
        });
}

function findFlightByFlightInfo(carrier, flightNumber, departureTime) {
    return flightModel
        .findOne(
            { $and : [
            { marketing_carrier : carrier },
            { marketing_flight_number : flightNumber },
            { departure_scheduled_time : departureTime }
            ]
        })
}

function addBooking(flightId, bookingId) {
    return flightModel
        .findById(flightId)
        .then(function (flight) {
            flight.bookings.push(bookingId);
            return flight.save();
        });
}

function deleteBooking(bookingId) {
    return flightModel
        .find({bookings:bookingId})
        .then(function (flights) {
            var flight = flights[0];
            var index = flight.bookings.indexOf(bookingId);
            flight.bookings.splice(index, 1);
            return flight.save();
        });
}

function addSchedule(flightId, scheduleId) {
    return flightModel
        .findById(flightId)
        .then(function (flight) {
            flight.schedules.push(scheduleId);
            return flight.save();
        });
}

function deleteSchedule(scheduleId) {
    return flightModel
        .find({schedules:scheduleId})
        .then(function (flights) {
            var flight = flights[0];
            var index = flight.schedules.indexOf(scheduleId);
            flight.schedules.splice(index, 1);
            return flight.save();
        });
}