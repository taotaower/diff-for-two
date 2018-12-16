var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

var connectionString = 'mongodb://localhost/zhou-guiheng-webdev-project'; // for local
if(process.env.MLAB_USERNAME_WEBDEV) { // check if running remotely
    var username = process.env.MLAB_USERNAME_WEBDEV; // get from environment
    var password = process.env.MLAB_PASSWORD_WEBDEV;
    connectionString = 'mongodb://' + username + ':' + password;
    connectionString += '@ds139665.mlab.com:39665/heroku_kn1vs4tc'; // user yours
}

mongoose.connect(connectionString);

require('./services/user.service.server');
require('./services/message.service.server');
require('./services/booking.service.server');
require('./services/flight.service.server');
require('./services/schedule.service.server');