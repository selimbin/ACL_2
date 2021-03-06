const { Binary } = require('mongodb')
const mongoose = require('mongoose')
const {staffSchema} = require('../models/staff.js')

const internalRequestSchema= new mongoose.Schema({
    type:{
        type:String,
        required:true,
        minlength:6
    },
    reason:{
        type:String
    },
    response:{
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
    replacement:{
        type:String
    },
    status:{
        type:String,
        required:true,
        default:"Pending"
    },
    date:{
        type:String
    },
    slot:{
        type:Number
    },
    location:{
        type:String
    },
    course:{
        type:String
    },
    amount:{
        type:Number
    },
    newDay:{
        type:String
    }
})
module.exports.internalRequestSchema = internalRequestSchema
module.exports = mongoose.model('IRS', internalRequestSchema)