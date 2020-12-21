const express = require('express')
const staff_routes = require('./routes/staff_routes')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const {staffSchema} = require('./models/staff.js') 
const staff_model=require('./models/staff')
const { nextTick } = require('process')
const app =express()
app.use(express.json())
app.use('',staff_routes)
require('dotenv').config()

const AuthenticationRoutes= require('./routes/auth')
// const { staffSchema } = require('./models/staff')
app.use('', AuthenticationRoutes)

app.use(async(req, res, next)=>{
    const token= req.headers.token

    if(!token)  
    {
        return res.status(401).status('Access denied')
    }
    try{
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        req.user= verified
        const user = await staff_model.findById(req.user._id)
        if(user.token!=token){
            res.send("login again")
        }
        next()
    }
    catch(err){
        res.status(400).send('Invalid Request')
    }
})
app.use('/staff' ,staff_routes)
module.exports.app = app