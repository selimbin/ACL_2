const mongoose = require('mongoose')

// const courseSchema = new mongoose.Schema({
//     name:String
// })

const staffSchema= new mongoose.Schema({
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
    }

    // course:[courseSchema]
},
{
    strict:false,
    timestamps:true
})
module.exports = mongoose.model('Staff', staffSchema)