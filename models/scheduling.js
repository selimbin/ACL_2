const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')
// import staffSchema from '../models/staff.js'
// const {staffSchema} = require('../models/staff.js') 

const attendanceSchema = new mongoose.Schema({
    id:{
        type:String,
        minlength:3,
        required:true
    },
    signIn:{
        type:Timestamp,
        required:true
    },
    signOut:{
        type:Timestamp
    }
})
module.exports.attendanceSchema = attendanceSchema
module.exports = mongoose.model('Attendance', attendanceSchema)