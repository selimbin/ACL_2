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

app.use(cors());
app.use('/seed', seed_routes)

app.use('/Login',async(req, res, next)=>{
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

app.use('/staff/viewschedule',async(req, res, next)=>{
    var today =  new Date()
    try{
        const currentuser = await staff_model.findById(req.user._id)
        const currentuserschedule = await schedule_model.findOne({id:currentuser.id});

        if(currentuserschedule){
            let day = currentuserschedule.saturday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.saturday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.saturday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.saturday[i].location.length; j++){
                        if(courseschedule.saturday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.saturday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.saturday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.saturday[i].course.length; j++){
                        if(locationschedule.saturday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.saturday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.saturday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }
            day = currentuserschedule.sunday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.sunday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.sunday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.sunday[i].location.length; j++){
                        if(courseschedule.sunday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.sunday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.sunday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.sunday[i].course.length; j++){
                        if(locationschedule.sunday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.sunday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.sunday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }

            day = currentuserschedule.monday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.monday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.monday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.monday[i].location.length; j++){
                        if(courseschedule.monday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.monday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.monday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.sunday[i].course.length; j++){
                        if(locationschedule.sunday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.sunday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.saturday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }
            day = currentuserschedule.tuesday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.tuesday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.tuesday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.tuesday[i].location.length; j++){
                        if(courseschedule.tuesday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.tuesday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.tuesday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.sunday[i].course.length; j++){
                        if(locationschedule.sunday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.sunday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.saturday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }
            day = currentuserschedule.wednesday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.wednesday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.wednesday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.wednesday[i].location.length; j++){
                        if(courseschedule.wednesday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.wednesday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.wednesday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.wednesday[i].course.length; j++){
                        if(locationschedule.wednesday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.wednesday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.wednesday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }
            day = currentuserschedule.thursday
            for(var i = 0;i< day.length;i++){
                if(day[i].type == "compensation"){
                    let course = day[i].course[0];
                    let location = day[i].location[0];
                    await currentuserschedule.thursday.pull(day[i])
                    let currslot = await slot_model.findByIdAndUpdate(day[i]._id,{course:[],location:[],type:[],isEmpty:true,compensation:[]},{new:true})
                    await currentuserschedule.thursday.splice(i,0,currslot)
                    await currentuserschedule.save()
                    const courseschedule = await schedule_model.findOne({id:course});
                    for(var j = 0;j < courseschedule.thursday[i].location.length; j++){
                        if(courseschedule.thursday[i].location[j] == location){
                            const courseslot = await slot_model.findById(courseschedule.thursday[i]._id);
                            courseslot.staff.splice(j,1);
                            courseslot.location.splice(j,1);
                            courseslot.type.splice(j,1);
                            courseslot.compensation.splice(j,1);
                            courseslot.isEmpty = true;
                            await courseslot.save()
                            courseschedule.pull(courseschedule.thursday[i]);
                            courseschedule.splice(j,0,courseslot);
                            await courseschedule.save()
                        }
                    }
                    const locationschedule = await schedule_model.findOne({id:location});
                    for(var j = 0;j < locationschedule.thursday[i].course.length; j++){
                        if(locationschedule.thursday[i].course[j] == course){
                            const locationslot = await slot_model.findById(locationschedule.thursday[i]._id);
                            locationslot.staff.splice(j,1);
                            locationslot.course.splice(j,1);
                            locationslot.type.splice(j,1);
                            locationslot.compensation.splice(j,1);
                            locationslot.isEmpty = true;
                            await locationslot.save()
                            locationschedule.pull(locationschedule.thursday[i]);
                            locationschedule.splice(j,0,locationslot);
                            await locationschedule.save()
                        }
                    }
                }
            }
        }
        var today = new Date()
        var end1 = new Date()
        var end2 = new Date()
        if(today.getDay() == 0){
            end1.setDate(end2.getDate() - 1);
            end2.setDate(end2.getDate() + 4);
        }
        else if(today.getDay() == 1){
            end1.setDate(end2.getDate() - 2);
            end2.setDate(end2.getDate() + 3);
        }
        else if(today.getDay() == 2){
            end1.setDate(end2.getDate() - 3);
            end2.setDate(end2.getDate() + 2);
        }
        else if(today.getDay() == 3){
            end1.setDate(end2.getDate() - 2);
            end2.setDate(end2.getDate() + 1);
        }
        else if(today.getDay() == 4){
            end1.setDate(end2.getDate() - 1);
        }
        else if(today.getDay() == 5){
            end1.setDate(end2.getDate() + 1);
            end2.setDate(end2.getDate() + 6);
        }
        else if(today.getDay() == 6){
            end2.setDate(end2.getDate() + 5);
        }
        let allstaffrequests = await requests_model.find({requester:currentuser.id,reason:"CompensationLeave",status:"accepted"});
        while(allstaffrequests.length != 0){
            let currentrequest = allstaffrequests.shift();
            if(currentrequest.date.getDate() <= end2.getDate() && currentrequest.date.getDate() >= end1.getDate()){
                let currentschedule = await schedule_model.findOne({id:currentuser.id})
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var d = new Date(currentrequest.date);
                var dayName = days[d.getDay()];
                let slot;
                let slot1;
                if(dayName == 'Sunday'){
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.sunday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.sunday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.sunday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Monday'){
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.monday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.monday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.monday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.monday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Tuesday'){
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.tuesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.tuesday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.tuesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Wednesday'){
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.wednesday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.wednesday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.wednesday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Thursday'){
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.thursday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.thursday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.thursday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
                if(dayName == 'Saturday'){
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.pull(slot1)
                    let currslot = await slot_model.findByIdAndUpdate(slot1._id,{course:[currentrequest.course],location:[currentrequest.location],type:["compensation"],isEmpty:false,compensation:[true]},{new:true})
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,currslot)
                    await currentschedule.save()
                    currentschedule = await schedule_model.findOne({id:currentrequest.course})
                    slot1 = await currentschedule.saturday[(currentrequest.slot-1)]
                    slot = await slot_model.findById(slot1._id);
                    await currentschedule.saturday.pull(slot1)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
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
                    await slot.compensation.push(true)
                    await slot_model.findByIdAndUpdate(slot._id,{isEmpty:false},{new:true})
                    await slot.save()
                    await currentschedule.saturday.splice((currentrequest.slot-1),0,slot)
                    await currentschedule.save()
                }
            }
        }
        
        next()
    }
    catch(error){
        res.status(400).send({error:error.message})
    }
})

app.use('/staff' ,staff_routes)
module.exports.app = app
