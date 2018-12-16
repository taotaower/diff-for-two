const mongoose = require('mongoose');

let userSchema = mongoose.Schema({

    role: {type: String,
        default: 'PASSENGER',
        enum: ['PASSENGER', 'STAFF', 'ADMIN', 'MEMBER']}, // 4 types of user

    // all types of user have attributes below
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    passport_number: {type: String, unique: false},
    date_of_birth: {type: Date, default: Date.now},
    date_created: {type: Date, default: Date.now},

    // registered type user ['CREW', 'ADMIN', 'MEMBER'] have attributes below
    username: {type: String, unique: true},
    password: String,

    // MEMBER type user has attributes below
    points: Number,
    level: {
       type: String,
       default: 'BROWN',
       enum: ['BROWN','SILVER','GOLD','PLATINUM']
    },
    representative: {type: mongoose.Schema.ObjectId, ref: 'UserModel'}, // one member has one representative

    // STAFF type user has attributes  below
    duty: {type: String,
            default: 'TICKET_CHECKER',
            enum: ['TICKET_CHECKER', 'CREW', 'REPRESENTATIVE']},
    schedules: [{type: mongoose.Schema.ObjectId, ref: "ScheduleModel"}],
    // **TICKET_CHECKER STAFF has passengers to check-in
    passengers: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}],

    // **REPRESENTATIVE STAFF has members to serve Q&A
    members: [{type: mongoose.Schema.ObjectId, ref: "UserModel"}],

    //PASSENGER type user has attributes below
    check_in: Boolean,
    reservations: [{type: mongoose.Schema.ObjectId, ref: "ReservationModel"}],


}, {collection: "users"});

module.exports = userSchema;
