const mongoose = require('mongoose');

let scheduleSchema = mongoose.Schema({

    crews: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}],    // one schedule will be shared with
    ticket_checkers: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}],    // multiple crew or ticket-checkers
    flight: {type: mongoose.Schema.ObjectId, ref: "FlightModel"},   // one schedule for one flight
    date_created: {type: Date, default: Date.now},
    date_updated: {type: Date, default: Date.now},
}, {collection: "schedules"});

module.exports = scheduleSchema;