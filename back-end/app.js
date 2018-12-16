const mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

let connectionString = 'mongodb://localhost/db-project'; // for local


if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
    let username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
    let password = process.env.MLAB_PASSWORD_WEBDEV;

    connectionString = 'mongodb://' + username + ':' + password;
    connectionString += '@ds117250.mlab.com:17250/heroku_rbdgfw80';
}

mongoose.connect(connectionString);

require('./services/user.service.server');
require('./services/booking.service.server');
require('./services/flight.service.server');
require('./services/schedule.service.server');