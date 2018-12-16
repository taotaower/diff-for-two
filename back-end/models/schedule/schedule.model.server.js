const mongoose = require('mongoose');
const scheduleSchema = require('./schedule.schema.server');
const scheduleModel = mongoose.model('ScheduleModel', scheduleSchema);
const userModel = require('../user/user.model.server');
const flightModel = require('../flight/flight.model.server');

scheduleModel.createSchedule = createSchedule;
scheduleModel.findScheduleById = findScheduleById;
scheduleModel.findAllSchedulesForUser = findAllSchedulesForUser;
scheduleModel.findAllSchedules = findAllSchedules;
scheduleModel.updateSchedule = updateSchedule;
scheduleModel.deleteSchedule = deleteSchedule;
scheduleModel.addFlight = addFlight;
scheduleModel.deleteFlight = deleteFlight;
scheduleModel.createScheduleOnly = createScheduleOnly;
scheduleModel.findSchedulesByCrew = findSchedulesByCrew;
scheduleModel.findSchedulesByChecker = findSchedulesByChecker;

module.exports = scheduleModel;

function createSchedule(userId, flightId, schedule) {
    return scheduleModel.create(schedule)
        .then(function (schedule) {
            userModel.addSchedule(userId, schedule._id); // add reference of schedule to user
            flightModel.addSchedule(flightId, schedule._id);
            return schedule;
        });
}

function findSchedulesByCrew(id){

    return scheduleModel.find({
        crews: id
    }).populate('flight')

}

function findSchedulesByChecker(id){
    console.log("id",id);
    return scheduleModel.find({
        ticket_checkers: id
    }).populate('flight')
}

function createScheduleOnly(schedule){
    return scheduleModel.create(schedule);
}

function findScheduleById(scheduleId) {
    return scheduleModel.findById(scheduleId);
}

function findAllSchedulesForUser(userId) {
    return scheduleModel.find({_user: userId})
        .populate('_user')
        .exec();
}

function findAllSchedules() {
    return scheduleModel.find()
        .populate('flight', "departure_scheduled_time departure_terminal departure_gate marketing_carrier marketing_flight_number")
        .populate('crews', "first_name last_name username phone email")
        .populate('ticket_checkers', "first_name last_name username phone email")

}

function updateSchedule(scheduleId, newSchedule) {
    return scheduleModel.update({_id: scheduleId}, {$set: newSchedule});
}

function deleteSchedule(scheduleId) {
    return scheduleModel
        .remove({_id: scheduleId})
        .then(function (status) {
            userModel.deleteSchedule(scheduleId);
            flightModel.deleteSchedule(scheduleId);
            return status;
        });
}

// when you create a new schedule, the existence of a flight is unknown, so add the reference of FLIGHT to schedule first,
// then add the reference of schedule to FLIGHT.
function addFlight(scheduleId, flightId) {
    return scheduleModel
        .findById(scheduleId)
        .then(function (schedule) {
            flightModel.addSchedule(flightId, scheduleId); // every time a schedule is added, add its reference to flight
            schedule.flights.push(flightId);
            return schedule.save();
        });
}

// This function may not be executed.
// In most cases, flight shouldn't be deleted, so the reference of it in schedule shouldn't be deleted, either.
// NOTE: "A flight is cancelled" !== "A flight is deleted"
function deleteFlight(flightId) {
    return scheduleModel
        .find({flights:flightId})
        .then(function (schedules) {
            var schedule = schedules[0];
            var index = schedule.flights.indexOf(flightId);
            schedule.flights.splice(index, 1);
            return schedule.save();
        });
}
