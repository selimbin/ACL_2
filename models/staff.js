const mongoose = require('mongoose')

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
    department:departmentSchema,
    lecturer:[staffSchema],
    TA:[staffSchema]
})
const facultySchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    departments:[departmentSchema],
    dean:staffSchema
})
const departmentSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        unique:true
    },
    head:staffSchema,
    TA:[staffSchema]
})
const locationSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:2,
        required:true,
        unique:true
    },
    building:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    }
})
const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true

    },
    id:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    salary:{
        type:Number
    },
    dayOff:{
        type:String
    },
    hoursSpent:{
        type:Number
    },
    accumelatedHours:{
        type:Number
    },
    department:[departmentSchema],
    course:[courseSchema]
},
{
    strict:false,
    timestamps:true
})
module.exports = mongoose.model('Staff', staffSchema)
module.exports= mongoose.model('Department', departmentSchema)
module.exports = mongoose.model('Faculty', facultySchema)
module.exports= mongoose.model('Course', courseSchema)
module.exports= mongoose.model('Location', locationSchema)