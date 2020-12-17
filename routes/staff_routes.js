const express = require('express');
const staff_model= require('../models/staff')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { readdirSync } = require('fs');
require('dotenv').config()

router.route('/register')
.post(async (req, res)=>{
    const salt = await bcrypt.genSalt(10)
    const newPassword= await bcrypt.hash(req.body.password, salt)
    const newStaff = new staff_model({name: req.body.name,
        email: req.body.email,
        password: newPassword,
        role: req.body.role,
        id: req.body.id
    })
    await newStaff.save()
    res.send(newStaff)
})

router.route('/login')
.post(async (req,res)=>{
    const result = await staff_model.findOne({email:req.body.email})
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
router.route('/logout')
.post(async(req,res)=>{
    const token=null
})

router.route('/view')
.post(async (req,res)=>{

})


module.exports=router;