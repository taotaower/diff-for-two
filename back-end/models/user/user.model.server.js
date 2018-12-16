var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.findAllUsers = findAllUsers;
userModel.findAllCrew = findAllCrew;
userModel.findUserByUsername = findUserByUsername;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findUserByFacebookId = findUserByFacebookId;
userModel.findUserByGoogleId = findUserByGoogleId;
userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.addMessage = addMessage;
userModel.deleteMessage = deleteMessage;
userModel.addBooking = addBooking;
userModel.deleteBooking = deleteBooking;
userModel.addSchedule = addSchedule;
userModel.deleteSchedule = deleteSchedule;

module.exports = userModel;

function createUser(user) {
    if (user.roles) {
        user.roles = user.roles.split(',');
    } else {
        user.roles = ['PASSENGER'];
    }
    return userModel.create(user);
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function findAllUsers() {
    return userModel.find();
}

function findAllCrew() {
    return userModel.find({roles:'CREW'});
}

function findUserByUsername(username) {
    return userModel.findOne({username: username});
}

function findUserByCredentials(username, password) {
    return userModel.findOne({
        username: username
        // password: password
    });
}

function findUserByFacebookId(facebookId) {
    return userModel
        .findOne({'facebook.id': facebookId});
}

function findUserByGoogleId(googleId) {
    return userModel
        .findOne({'google.id': googleId});
}

function updateUser(userId, newUser) {
    // if you don't allow to update certain fields,
    // delete the corresponding fields.
    delete newUser.username;
    delete newUser.password;
    if (typeof newUser.roles === 'string') {
        newUser.roles = newUser.roles.split(',');
    }
    return userModel.update({_id: userId}, {$set: newUser});
}

function deleteUser(userId) {
    return userModel.remove({_id: userId});
}

function addMessage(username, messageId) {
    return userModel
        .findOne({username: username})
        .then(function (user) {
            user.messages.push(messageId);
            return user.save();
        });
}

function deleteMessage(messageId) {
    return userModel
        .find({messages:messageId})
        .then(function (users) {
            var user1 = users[0];
            var user2= users[1];
            var index1 = user1.messages.indexOf(messageId);
            user1.messages.splice(index1, 1);
            var index2 = user2.messages.indexOf(messageId);
            user2.messages.splice(index2, 1);
            user1.save();
            user2.save();
        });
}

function addBooking(userId, bookingId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.bookings.push(bookingId);
            return user.save();
        });
}

function deleteBooking(bookingId) {
    return userModel
        .find({bookings:bookingId})
        .then(function (users) {
            var user = users[0];
            var index = user.bookings.indexOf(bookingId);
            user.bookings.splice(index, 1);
            return user.save();
        });
}

function addSchedule(userId, scheduleId) {
    return userModel
        .findById(userId)
        .then(function (user) {
            user.schedules.push(scheduleId);
            return user.save();
        });
}

function deleteSchedule(scheduleId){
    return userModel
        .find({schedules:scheduleId})
        .then(function (users) {
            var user = users[0];
            var index = user.schedules.indexOf(scheduleId);
            user.schedules.splice(index, 1);
            return user.save();
        });
}