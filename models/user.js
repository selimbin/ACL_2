const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:3
    },

    email:{
        type:String,
        require:true,
        unique:true
    },

    password:{
        type:String,
        require:true
    },
    
    role:{
        type:String,
        require:true
    }
    
},
{
    timestamps:true //not necessary, only if we need create/delete/update times; there are other options
})

module.exports = mongoose.model('User', userSchema)