const express = require('express')
const user_routes = require('./routes/user_routes')
const jwt=require('jsonwebtoken')
const { nextTick } = require('process')
const app =express()
app.use(express.json())
app.use('',user_routes)
require('dotenv').config()

app.use((req,res,next)=>{
    const token =req.headers.token

    const result = jwt.verify(token,process.env.TOKEN_SECRET)
    console.log(result)
    req.user=result
    next()
})

app.get('/students',(req,res)=>{
    if(req.user.role=='admin'){
        res.send('students !')
    }
    else{
        res.status(403).send('Access Denied')
    }
    
})
module.exports.app = app