const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
const {locationSchema} = require('../models/staff.js') 
const {staffSchema} = require('../models/staff.js') 
const {courseSchema} = require('../models/academics.js') 

const attendanceSchema = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    day:{
        type:String
    },
    signIn:{
        type:[Date]
    },
    signOut:{
        type:[Date]
    }
})
module.exports.attendanceSchema = attendanceSchema
module.exports = mongoose.model('Attendance', attendanceSchema)

const slotSchema = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        required:true
    },
    course:{
        type:[courseSchema]
    },
    location:{
        type:[locationSchema]
    },
    staff:{
        type:[staffSchema]
    }
})
module.exports.slotSchema = slotSchema
module.exports = mongoose.model('Slot', slotSchema)

const scheduleSchema = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        required:true
    },
    Saturday:{
        type:[slotSchema]
    },
    Sunday:{
        type:[slotSchema]
    },
    Monday:{
        type:[slotSchema]
    },
    Tuesday:{
        type:[slotSchema]
    },
    Wednesday:{
        type:[slotSchema]
    },
    Thursday:{
        type:[slotSchema]
    },
    Friday:{
        type:[slotSchema]
    }
})
module.exports.scheduleSchema = scheduleSchema
module.exports = mongoose.model('Schedule', scheduleSchema)