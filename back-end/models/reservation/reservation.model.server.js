const mongoose = require('mongoose');
const reservationSchema = require('./reservation.schema.server');
const reservationModel = mongoose.model('ReservationModel', reservationSchema);

function createReservation(reservation){
    return reservationModel.create(reservation);
}

function findAllReservationsForUser(userId){
    return reservationModel.find({'createUser':userId}).populate('flight');
}

function findReservationById(reservationId){
    return reservationModel.findById(reservationId);
}

function findAllReservations(){
    return reservationModel.find().populate('flight');
}

function updateReservation(reservationId, reservation){
    return reservationModel.update({_id: reservationId}, {$set: reservation});
}

function deleteReservation(reservationId){
    return reservationModel.remove({_id: reservationId});
}

function addFlight(reservationId, flightId){
    return reservationModel.update({_id: reservationId}, {$set: {flight:flightId}});
}

function findBookingsByFlightWithPass(flightId){
    return reservationModel.find({flight :flightId}).populate('passenger');
}

module.exports = {createReservation, findAllReservationsForUser, findReservationById,
    findAllReservations, updateReservation, deleteReservation, addFlight, findBookingsByFlightWithPass}