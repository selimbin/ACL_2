const mongoose = require('mongoose')
const {departmentSchema} = require('../models/academics.js') 
const {courseSchema} = require('../models/academics.js') 

const staffcountSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true
    },
    HR:{
        type:Number,
        required:true
    },
    Academic:{
        type:Number,
        required:true
    }
})
module.exports.Staffcount = staffcountSchema
module.exports = mongoose.model('Staffcount', staffcountSchema)

const locationSchema = new mongoose.Schema({
    code:{
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
module.exports.locationSchema = locationSchema
module.exports = mongoose.model('Location', locationSchema)

const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true

    },
    id:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
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
    department:{
        type:String,
    },
    lastSalary:{
        type:Number
    },
    leaveBalance:{
        type:Number,
        default:2.5
    },
    course:{
        type:[String]
    },
    officeLocation:{
        type:String,
    },
    token:{
        type:String,
        default:null

    }
},
{
    strict:false,
    timestamps:true
})
module.exports = mongoose.model('Staff', staffSchema)
module.exports.staffSchema=staffSchema