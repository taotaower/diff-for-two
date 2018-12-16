const mongoose = require('mongoose');
const userSchema = require('./user.schema.server');
const userModel = mongoose.model('UserModel', userSchema);

// create user
userModel.createUser = createUser;

// find all user
userModel.findAllUsers = findAllUsers;
userModel.findAllSpecificUser = findAllSpecificUser;


userModel.findUserByUsername = findUserByUsername;
userModel.findUserById = findUserById;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findUsersByIds = findUsersByIds;
userModel.findAllCrew = findAllCrew;
userModel.findAllTicketChecker = findAllTicketChecker;
userModel.findAllRepresnt = findAllRepresnt;

userModel.updateUser = updateUser;
userModel.deleteUser = deleteUser;
userModel.addMessage = addMessage;
userModel.addBooking = addBooking;
userModel.deleteBooking = deleteBooking;
userModel.addSchedule = addSchedule;
userModel.deleteSchedule = deleteSchedule;
userModel.findAllPassenger = findAllPassenger;
userModel.checkinPassenger = checkinPassenger;


module.exports = userModel;


function createUser(user) {
    return userModel.create(user);
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function findAllUsers() {
    return userModel.find({ role: { $ne: "PASSENGER" } } );
}

function findAllSpecificUser(role) {
    return userModel.find({role:role});
}


function findAllCrew(){
    return userModel.find({role:"STAFF", duty:"CREW"});
}

function findAllTicketChecker(){
    return userModel.find({role:"STAFF", duty:"TICKET_CHECKER"});
}

function findAllRepresnt(){
    userModel.find({role:"STAFF", duty:"REPRESENTATIVE"});
}



function findUserByUsername(username){
    console.log(username);
    return userModel.find({username:username});
}

function findUserByCredentials(username, password) {

    return userModel.findOne({
        username: username,
        password: password
    });
}

function findUsersByIds(ids){
    return userModel.find({
    _id: {$in:ids}
    });
}

function updateUser(userId, newUser) {
    // if you don't allow to update certain fields,
    // delete the corresponding fields.
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

function findAllPassenger(ids){
    return userModel
        .find({
            $and : [{_id: {$in:ids}}, {check_in: false}]
        })
}

function checkinPassenger(id){
    return userModel.update({_id: id}, {$set: {check_in: true}});
}