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
        type:[String]
    },
    TA:{
        type:[String]
    },
    courseCoordinator:{
        type:String
    }
})
module.exports.courseSchema = courseSchema
module.exports = mongoose.model('Course', courseSchema)

const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
    },
    facultyname:{
        type:String,
        minlength:3,
        required:true
    },
    head:{
        type:String,
    },
    courses:{
        type:[courseSchema]
    }
})
module.exports.departmentSchema = departmentSchema
module.exports= mongoose.model('Department', departmentSchema)

const facultySchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    departments:{
        type:[departmentSchema]
    }
})

module.exports.facultySchema = facultySchema
module.exports = mongoose.model('Faculty', facultySchema)
