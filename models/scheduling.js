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
    month:{
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
    staff:{
        type:[String]
    },
    location:{
        type:[String]
    },
    type:{
        type:[String]
    },
    compensation:{
        type:[Boolean]
    },
    isEmpty:{
        type:Boolean,
        default:true
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
    month:{
        type:String,
        required:true
    },
    days:{
        type:[attendanceSchema]
    },
    missedDays:{
        type:Number,
        default:0
    },
    missedHours:{
        type:Number,
        default:0
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
    saturday:{
        type:[slotSchema]
    },
    sunday:{
        type:[slotSchema]
    },
    monday:{
        type:[slotSchema]
    },
    tuesday:{
        type:[slotSchema]
    },
    wednesday:{
        type:[slotSchema]
    },
    thursday:{
        type:[slotSchema]
    }
})
module.exports.scheduleSchema = scheduleSchema
module.exports = mongoose.model('Schedule', scheduleSchema)