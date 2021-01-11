const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')

const express= require('express');
const router= express.Router()
const staff_model=require('../models/staff')
const {staffSchema} = require('../models/staff.js') 


/*router.route('/register')
.post(async (req, res)=>{
    if(! req.body.email){
        res.send('You must sign up with email')
    }
    if(! req.body.password){
        res.send('You must sign up with password')
    }
    const user= await staff_model.find({email: req.body.email})
    if(user.length>0){
        res.send('This email is already signed up')
    }
    const salt= await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt) 
    const newUser= await staff_model(req.body).save()
    res.send(newUser)
})*/

router.route('/login')
.post(async (req,res)=>{
    const result = await staff_model.findOne({email:req.body.email})
    if(!result){
        return res.status.json({msg:"You need to sign up first or incorrect email"})
    }
    const correctPassword= await bcrypt.compare(req.body.password, result.password)
    if(correctPassword){
        const token=jwt.sign({_id:result._id, role:result.role}, 
            process.env.TOKEN_SECRET)
        // result=token;
        result.token = token
        await staff_model.findOneAndUpdate({"_id":result._id},result)
        res.header('token',token).send(token)
    }
    else{
        return res.status(400).json({msg:"Incorrect Password"})
    }
})

module.exports= router