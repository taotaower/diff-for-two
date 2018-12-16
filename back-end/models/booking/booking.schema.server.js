var mongoose = require('mongoose');

var bookingSchema = mongoose.Schema({
    _user: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}],
    food: String,
    lounge: String,
    price: Number,
    flights: [{type: mongoose.Schema.ObjectId, ref: "FlightModel"}],
    dateCreated: {type: Date, default: Date.now}
}, {collection: "booking"});

module.exports = bookingSchema;