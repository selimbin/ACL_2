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
    course:{
        type:String
    },
    location:{
        type:String
    },
    staff:{
        type:[String]
    },
    compensation:{
        type:Boolean
    }
})
module.exports.slotSchema = slotSchema
module.exports = mongoose.model('Slot', slotSchema)

const daySchema = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        auto:true
    },
    month:{
        type:String
    },
    first:{
        type:Boolean
    },
    second:{
        type:Boolean
    },
    third:{
        type:Boolean
    },
    fourth:{
        type:Boolean
    },
    fifth:{
        type:Boolean
    }
})
module.exports.daySchema = daySchema
module.exports = mongoose.model('Day', daySchema)

const scheduleAttendance = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        required:true
    },
    days:{
        type:[daySchema]
    }
})
module.exports.scheduleAttendance = scheduleAttendance
module.exports = mongoose.model('ScheduleAttendance', scheduleAttendance)

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
    }
})
module.exports.scheduleSchema = scheduleSchema
module.exports = mongoose.model('Schedule', scheduleSchema)