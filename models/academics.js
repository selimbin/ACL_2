const mongoose = require('mongoose')
// import staffSchema from '../models/staff.js'
const {staffSchema} = require('../models/staff.js') 

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true
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
module.exports.Course = courseSchema
module.exports = mongoose.model('Course', courseSchema)

const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
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