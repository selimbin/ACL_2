const mongoose = require('mongoose')
const {departmentSchema} = require('../models/academics.js') 
const {courseSchema} = require('../models/academics.js') 

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
module.exports = mongoose.model('Location',locationSchema)
module.exports.locationSchema=locationSchema  
const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3,
        required:true,
        auto:true

    },
    id:{
        type:String,
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
    department:{
        type:[departmentSchema]
    },
    course:{
        type:[courseSchema]
    },
    officeLocation:{
        type:String,
        // required:true,
        minlength:4
    }
},
{
    strict:false,
    timestamps:true
})
module.exports = mongoose.model('Staff', staffSchema)
module.exports.staffSchema=staffSchema
// module.exports= mongoose.model('Department', departmentSchema)
// module.exports = mongoose.model('Faculty', facultySchema)
// module.exports= mongoose.model('Course', courseSchema)
// module.exports= mongoose.model('Location', locationSchema)