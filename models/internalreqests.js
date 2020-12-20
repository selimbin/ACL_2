const { Binary } = require('mongodb')
const mongoose = require('mongoose')
const {staffSchema} = require('../models/staff.js')
const internalreqestsschema= new mongoose.Schema({
    type:{
        type:String,
        required:true,
        minlength:12
    },
    requester:{
        type:[staffSchema],
        required:true
    },
    reciever:{
        type:[staffSchema],
        required:true
    },
    status:{
        type:String,
        required:true
    },
    Date:{
        type:Date
    }
   

})
module.exports = mongoose.model('IRS', internalreqestsschema)