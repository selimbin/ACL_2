const express = require('express')
const staff_routes = require('./routes/staff_routes')
const jwt=require('jsonwebtoken')
const { nextTick } = require('process')
const app =express()
app.use(express.json())
app.use('',staff_routes)
require('dotenv').config()

const AuthenticationRoutes= require('./routes/auth')
const verify= require('./routes/tokenverification')
app.use('', AuthenticationRoutes)

app.use((req, res, next)=>{
    const token= req.headers.token
    if(!token)  
    {
        return res.status(401).status('Access deined')
    }
    try{
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        req.user= verified
        next()
    }
    catch(err){
        res.status(400).send('Invalid Request')
    }
})

// app.get('/staff',(req,res)=>{
//     if(req.staff.role=='admin'){
//         res.send('staff !')
//     }
//     else{
//         res.status(403).send('Access Denied')
//     }
    
// })
app.use('/staff' ,staff_routes)
module.exports.app = app