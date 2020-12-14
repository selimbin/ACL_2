const express = require('express')
const staff_routes = require('./routes/staff_routes')
const jwt=require('jsonwebtoken')
const { nextTick } = require('process')
const app =express()
app.use(express.json())
app.use('',staff_routes)
require('dotenv').config()

app.use((req,res,next)=>{
    const token =req.headers.token

    const result = jwt.verify(token,process.env.TOKEN_SECRET)
    console.log(result)
    req.staff=result
    next()
})

app.get('/staff',(req,res)=>{
    if(req.staff.role=='admin'){
        res.send('staff !')
    }
    else{
        res.status(403).send('Access Denied')
    }
    
})
module.exports.app = app