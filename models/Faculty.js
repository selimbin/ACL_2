const mongoose = require('mongoose')
const Departments_model=require('../models/Department')

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true
    },
    code:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    teachingSlot:{
        type:Number
    },
})
const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    HOD:{
        type:String,
        required:true
    },
    Course:[courseSchema]
})
const facultySchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    departments:[departmentSchema],
})