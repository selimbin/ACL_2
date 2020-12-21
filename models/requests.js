const { Binary } = require('mongodb')
const mongoose = require('mongoose')
const {staffSchema} = require('../models/staff.js')

const internalRequestSchema= new mongoose.Schema({
    id:{
        type:String,
        required:true,
        minlength:6,
        auto:true
    },
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
    reciever:{
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
    newDay:{
        type:String
    }
})
module.exports.internalRequestSchema = internalRequestSchema
module.exports = mongoose.model('IRS', internalRequestSchema)