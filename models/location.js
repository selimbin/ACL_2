var mongoose = require('mongoose')
var locationSchema = new mongoose.Schema({
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
module.exports= mongoose.model('Location', locationSchema)
