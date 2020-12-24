const { Binary } = require('mongodb')
const mongoose = require('mongoose')
const {staffSchema} = require('../models/staff.js')

const internalRequestSchema= new mongoose.Schema({
/*id:{
        type:String,
        required:true,
        minlength:6,
        auto:true
    },*/
    type:{
        type:String,
        required:true,
        minlength:6
    },
    reason:{
        type:String
    },
    requester:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"Pending"
    },
    date:{
        type:Date
    },
<<<<<<< HEAD
    slot:{
        type:Number
    },
    location:{
        type:String
    },
    course:{
        type:String
    },
=======
    amount:{
        type:Number
    },
>>>>>>> e1655176d152d4abd3d3df79350657e9059beca8
    newDay:{
        type:String
    }
})
module.exports.internalRequestSchema = internalRequestSchema
module.exports = mongoose.model('IRS', internalRequestSchema)