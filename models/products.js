const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true,
        min:1
    },
    name:{
        type:String,
        minlength:4,
        maxlength:30
    },
    quantity:{
        type:Number
    },
    price:{
        type:Number
    }
})