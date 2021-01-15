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
const {scheduleAttendance} = require('./models/scheduling.js') 
const scheduleAttendance_model = mongoose.model('ScheduleAttendance', scheduleAttendance)
const {attendanceSchema} = require('./models/scheduling.js') 
const attendance_model = mongoose.model('Attendance', attendanceSchema)
const { nextTick } = require('process')
var schedule = require('node-schedule');
const app =express()
let cors = require('cors');
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
                let slot1;
                let slot;
                if(dayName == 'Sunday'){
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Monday'){
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Tuesday'){
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Wednesday'){
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Thursday'){
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
                }
                if(dayName == 'Saturday'){
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.location.pull(currentrequest.location)
                    await slot.course.pull(currentrequest.course)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    let index;
                    for(var i = 0;i<slot.location.length; i = i + 1){
                        if(slot.location[i] == currentrequest.location){
                            index = i;
                        }
                    }
                    await slot.location.splice(index,1)
                    await slot.staff.splice(index,1)
                    await slot.type.splice(index,1)
                    await slot.compensation.splice(index,1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                    }
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.course.pull(currentrequest.course)
                    await slot.staff.pull(currentrequest.reciever)
                    await slot.type.pull("compensation")
                    await slot.compensation.pull(true)
                    await slot.compensation.push(false)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
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
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Monday'){
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Tuesday'){
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Wednesday'){
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Thursday'){
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Saturday'){
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.location.push(currentrequest.location)
                    await slot.course.push(currentrequest.course)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    if(slot.location.length == 0){
                        await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    }
                    await slot.location.push(currentrequest.location)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.push(true)
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.location})
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.splice((currentrequest.slot-1),1)
                    await slot.course.push(currentrequest.course)
                    await slot.staff.push(currentrequest.reciever)
                    await slot.type.push("compensation")
                    await slot.compensation.pull(false)
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save() 
                }
            }
        }

    }
});

app.use(cors());
app.use('/seed', seed_routes)
app.use(async(req, res, next)=>{
    const token= req.headers.token
    var today =  new Date()
    try{
        const staff = await staff_model.find()
        
        var tester = null
        if(today.getDate()<11){
            
            if(today.getMonth()==0){
                tester = "12" 
            }else{
                if(today.getMonth()<10){
                    tester = "0"+(parseInt(today.toISOString().substring(5,7),10)-1).toString()
                }
                else{
                    tester = (parseInt(today.toISOString().substring(5,7),10)-1).toString()
                }
            }
        }
        else{
            tester = today.toISOString().substring(5,7)
        }
        
        var num = new Date(today.getFullYear(), (today.getMonth()+1), 0).getDate()
        var schedule = null

        for(var i in staff){
            schedule = await scheduleAttendance_model.findOne({id:staff[i].id,month:tester})

            if(!schedule){
                schedule = new scheduleAttendance_model({
                    id:staff[i].id,
                    month:tester
                })

                await schedule.save()
            }
            
            
            var now = today.getDate()
            var missingDays=0
            var attendance = null
            var last = null
            if(now<11){

                last= today
                last.setMonth(today.getMonth())
                for(var j=11; j<num;j++){
                    last.setDate(j)
                    if(last.toUTCString().substring(0,3)!=staff[i].dayOff&&last.toUTCString().substring(0,3)!="Fri"){
                        attendance= await attendance_model.findOne({"id":staff[i].id,"date":last.toISOString().substring(0,10)})
                        if(!attendance){
                            missingDays = missingDays + 1
                        }
                    }
                
                }
                last = today
                for(var k=1; k<now;k++){
                    last.setDate(k)
                    if(last.toUTCString().substring(0,3)!=staff[i].dayOff&&last.toUTCString().substring(0,3)!="Fri"){
                        attendance= await attendance_model.findOne({"id":staff[i].id,"date":last.toISOString().substring(0,10)})

                        if(!attendance){
                            missingDays = missingDays + 1
                        }
                    }
                
                }

                schedule.missedDays = missingDays 
                await scheduleAttendance_model.findOneAndUpdate({"id":staff[i].id,"month":tester},schedule)


            }
            else{
                last= today
                
                for(var j=11; j<=now;j++){
                    last.setDate(j)
                    
                    if(last.toUTCString().substring(0,3)!=staff[i].dayOff&&last.toUTCString().substring(0,3)!="Fri"){
                        attendance= await attendance_model.findOne({"id":staff[i].id,"date":last.toISOString().substring(0,10)})
                        if(!attendance){
                            missingDays = missingDays + 1
                        }
                    }
                
                }
                schedule.missedDays = missingDays 
                await scheduleAttendance_model.findOneAndUpdate({"id":staff[i].id,"month":tester},schedule)

            }
        }
        
        next()
    }
    catch(error){
        res.status(400).send({error:error.message})
    }
})

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
            return res.status(40).status('Please login Again')
        }
        next()
    }
    catch(err){
        return res.status(400).send('Invalid Request')
    }
})

app.use('/staff' ,staff_routes)
module.exports.app = app
