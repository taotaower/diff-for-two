const mongoose = require('mongoose');

const flightSchema = mongoose.Schema({
    tickets: [{type: mongoose.Schema.ObjectId, ref: "TicketModel"}],
    schedules: [{type: mongoose.Schema.ObjectId, ref: "ScheduleModel"}],
    departure_airport: String,
    departure_scheduled_time: {type: Date, default: Date.now},
    departure_actual_time: {type: Date, default: Date.now},
    departure_terminal: String,
    departure_gate: String,
    departure_status: String,
    arrival_airport: String,
    arrival_scheduled_time: {type: Date, default: Date.now},
    arrival_actual_time: {type: Date, default: Date.now},
    arrival_terminal: String,
    arrival_gate: String,
    arrival_status: String,
    marketing_carrier: String,
    marketing_flight_number: String,
    operating_carrier: String,
    operating_flight_number: String,
    equipment: String,
    journey_duration: String,
    flight_status: String,
    date_created: {type: Date, default: Date.now},
    date_updated: {type: Date, default: Date.now}
}, {collection: "flights"});

module.exports = flightSchema;