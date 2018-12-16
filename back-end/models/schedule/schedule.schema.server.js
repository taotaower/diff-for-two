var mongoose = require('mongoose');

var scheduleSchema = mongoose.Schema({
    _user: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}], // crew reference
    flights: [{type: mongoose.Schema.ObjectId, ref: "FlightModel"}],
    dateCreated: {type: Date, default: Date.now}
}, {collection: "schedule"});

module.exports = scheduleSchema;