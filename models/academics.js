const mongoose = require('mongoose')
// import staffSchema from '../models/staff.js'
const {staffSchema} = require('../models/staff.js') 

const courseSchema = new mongoose.Schema({
    code:{
        type:String,
        minlength:3,
        required:true
    },
    departmentname:{
        type:String,
        minlength:3,
        required:true,
    },
    coverage:{
        type:Number
    },
    lecturer:{
        type:[staffSchema]
    },
    TA:{
        type:[staffSchema]
    },
    courseCoordinator:{
        type:String
    }
})
module.exports.courseSchema = courseSchema
module.exports = mongoose.model('Course', courseSchema)

const departmentSchema = new mongoose.Schema({
    facultyname:{
        type:String,
        minlength:3,
        required:true,
    },
    name:{
        type:String,
        minlength:3,
        required:true,
    },
    courses:[courseSchema]
})
module.exports= mongoose.model('Department', departmentSchema)
const facultySchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    departments:[departmentSchema]
})
module.exports = mongoose.model('Faculty', facultySchema)