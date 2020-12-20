const express = require('express')
const staff_routes = require('./routes/staff_routes')
const jwt=require('jsonwebtoken')
const { nextTick } = require('process')
const app =express()
app.use(express.json())
app.use('',staff_routes)
require('dotenv').config()

const AuthenticationRoutes= require('./routes/auth')
app.use('', AuthenticationRoutes)

app.use((req, res, next)=>{
    try{
        const token= req.headers.token
        if(!token)  
        {
            res.status(401).status('Access deined')
        }
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        if(!verified){
            return res.status(401).json({msg:"unauthorized"});
        }
        req.user= verified
        next()
    }
    catch(err){
        res.status(500).json({error:error.message});
    }
})
app.use('/staff' ,staff_routes)
module.exports.app = app