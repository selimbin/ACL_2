const express = require('express')
const staff_routes = require('./routes/staff_routes')
const seed_routes = require('./routes/seed_routes')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const {staffSchema} = require('./models/staff.js') 
const staff_model=require('./models/staff')
const {internalRequestSchema} = require('../models/requests.js') 
const requests_model = mongoose.model('IRS', internalRequestSchema)
const {scheduleSchema} = require('../models/scheduling.js') 
const schedule_model=mongoose.model("Schedule",scheduleSchema)
const {slotSchema} = require('../models/scheduling.js') 
const slot_model=mongoose.model("Slot",slotSchema)
const { nextTick } = require('process')
var schedule = require('node-schedule');
const app =express()
app.use(express.json())
// app.use('',staff_routes)
require('dotenv').config()

const AuthenticationRoutes= require('./routes/auth')
var j = schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 5}, async function(){
    var today = new Date()
    var week = new Date()
    var day = today.getDate() + 6
    week.setDate(day)
    let allstaff = await staff_model.find();
    while(allstaff.length != 0){
        let currentstaff = allstaff.shift();
        let allstaffrequests = await requests_model.find({requester:currentstaff.id,reason:"CompensationLeave",status:"accepted"});
        while(allstaffrequests){
            let currentrequest = allstaffrequests.shift();
            if(currentrequest.date >= today && currentrequest.date <= week){
                let currentschedule = await schedule_model.findOne({id:currentstaff.id})
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var d = new Date(currentrequest.date);
                var dayName = days[d.getDay()];
                let slot;
                if(dayname == 'Sunday'){
                    slot = await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,newslot)
                }
                if(dayname == 'Monday'){
                    slot = await currentschedule.monday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,newslot)
                }
                if(dayname == 'Tuesday'){
                    slot = await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,newslot)
                }
                if(dayname == 'Wednesday'){
                    slot = await currentschedule.wednesday.splice((currentrequest.slot-1),1) 
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,newslot)
                }
                if(dayname == 'Thursday'){
                    slot = await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,newslot) 
                }
                if(dayname == 'Saturday'){
                    slot = await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,newslot)
                }
            }
        }

    }
  });
app.use('/seed', seed_routes)
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