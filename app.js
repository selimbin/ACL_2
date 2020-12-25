const express = require('express')
const staff_routes = require('./routes/staff_routes')
const seed_routes = require('./routes/seed_routes')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const {staffSchema} = require('./models/staff.js') 
const staff_model=require('./models/staff')
const {internalRequestSchema} = require('./models/requests.js') 
const requests_model = mongoose.model('IRS', internalRequestSchema)
const {scheduleSchema} = require('./models/scheduling.js') 
const schedule_model=mongoose.model("Schedule",scheduleSchema)
const {slotSchema} = require('./models/scheduling.js') 
const slot_model=mongoose.model("Slot",slotSchema)
const { nextTick } = require('process')
var schedule = require('node-schedule');
const app =express()
app.use(express.json())
// app.use('',staff_routes)
require('dotenv').config()

const AuthenticationRoutes= require('./routes/auth')
schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 5}, async function(){
    var today = new Date()
    var week1 = new Date()
    var day = today.getDate() - 7
    week1.setDate(day)
    let allstaff = await staff_model.find();
    while(allstaff.length != 0){
        let currentstaff = allstaff.shift();
        let allstaffrequests = await requests_model.find({requester:currentstaff.id,reason:"CompensationLeave",status:"accepted"});
        while(allstaffrequests){
            let currentrequest = allstaffrequests.shift();
            if(currentrequest.date < today && currentrequest.date >= week1){
                let currentschedule = await schedule_model.findOne({id:currentstaff.id})
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var d = new Date(currentrequest.date);
                var dayName = days[d.getDay()];
                let slot;
                if(dayName == 'Sunday'){
                    slot = await currentschedule.sunday[(currentrequest.slot-1)]
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.sunday[(currentrequest.slot-1)]
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.sunday[(currentrequest.slot-1)]
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Monday'){
                    slot = await currentschedule.monday[(currentrequest.slot-1)]
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.monday[(currentrequest.slot-1)]
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.monday[(currentrequest.slot-1)]
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Tuesday'){
                    slot = await currentschedule.tuesday[(currentrequest.slot-1)]
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.tuesday[(currentrequest.slot-1)]
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.tuesday[(currentrequest.slot-1)]
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Wednesday'){
                    slot = await currentschedule.wednesday[(currentrequest.slot-1)]
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.wednesday[(currentrequest.slot-1)]
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.wednesday[(currentrequest.slot-1)]
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Thursday'){
                    slot = await currentschedule.thuresday[(currentrequest.slot-1)]
                    await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.thuresday[(currentrequest.slot-1)]
                    await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.thuresday[(currentrequest.slot-1)]
                    await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
                }
                if(dayName == 'Saturday'){
                    slot = await currentschedule.saturday[(currentrequest.slot-1)]
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot.isEmpty.pull(false)
                    await slot.isEmpty.push(true)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.saturday[(currentrequest.slot-1)]
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.saturday[(currentrequest.slot-1)]
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.isEmpty.pull(false)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
                }
            }
        }

    }
    allstaff = await staff_model.find();
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
                if(dayName == 'Sunday'){
                    slot = await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.sunday[(currentrequest.slot-1)]
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.sunday[(currentrequest.slot-1)]
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Monday'){
                    slot = await currentschedule.monday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.monday[(currentrequest.slot-1)]
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.monday[(currentrequest.slot-1)]
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Tuesday'){
                    slot = await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.tuesday[(currentrequest.slot-1)]
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.tuesday[(currentrequest.slot-1)]
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Wednesday'){
                    slot = await currentschedule.wednesday.splice((currentrequest.slot-1),1) 
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.wednesday[(currentrequest.slot-1)]
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.wednesday[(currentrequest.slot-1)]
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Thursday'){
                    slot = await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.thuresday[(currentrequest.slot-1)]
                    await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.thuresday[(currentrequest.slot-1)]
                    await currentschedule.thuresday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.thuresday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
                }
                if(dayName == 'Saturday'){
                    slot = await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    const newslot = await slot_model({course:currentrequest.course,location:currentrequest.location,staff:currentrequest.reciever,type:"compensation",
                    compensation:true,isEmpty:false})
                    await newslot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,newslot)
                    await slot_model.findByIdAndDelete(slot._id)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot = await currentschedule.saturday[(currentrequest.slot-1)]
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot = await currentschedule.saturday[(currentrequest.slot-1)]
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.isEmpty.push(false)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
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
