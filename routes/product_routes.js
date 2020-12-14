const express = require('express');
const user_model=require('../models/products')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { readdirSync } = require('fs');
require('dotenv').config()
router.route('/register')
.post(async (req, res)=>{
    const salt = await bcrypt.genSalt(10)
    const newPassword= await bcrypt.hash(req.body.password, salt)
    const newUser = new user_model({name: req.body.name,
        email: req.body.email,
        password: newPassword,
        role: req.body.role
    })
    await newUser.save()
    res.send(newUser)
})

router.route('/login')
.post(async (req,res)=>{
    const result = await user_model.findOne({email:req.body.email})
    if(!result){
        return res.send('You need to sign up first')
    }
    const correctPassword= await bcrypt.compare(req.body.password, result.password)
    if(correctPassword){
        const token=jwt.sign({_id:result._id, role:result.role}, 
            process.env.TOKEN_SECRET)
        res.header('token',token).send(token)
    }
    else{
        res.send('Incorrect Password')
    }
})
module.exports=router;