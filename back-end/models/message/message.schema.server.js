var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: String,
    from: String,
    to: String,
    date: {type: Date, default: Date.now}
}, {collection: "message"});

module.exports = messageSchema;
