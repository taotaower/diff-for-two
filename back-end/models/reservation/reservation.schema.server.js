const mongoose = require('mongoose');

let reservationSchema = mongoose.Schema({

    createUser : {type: mongoose.Schema.ObjectId, ref: "UserModel"},
    passenger: {type: mongoose.Schema.ObjectId, ref: "UserModel"}, //passenger who owns this reservation
    price: Number,
    flight: {type: mongoose.Schema.ObjectId, ref: "FlightModel"},
    date_created: {type: Date, default: Date.now},
    date_updated: {type: Date, default: Date.now},
    status:
        {type: String,
            default: 'ACTIVE',
            enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'USED']},

}, {collection: "reservations"});

module.exports = reservationSchema;