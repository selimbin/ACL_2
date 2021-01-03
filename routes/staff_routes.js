const express = require('express');
const mongoose = require('mongoose')
// const staff_model=require('../models/staff')

const {internalRequestSchema} = require('../models/requests.js') 
const request_model = mongoose.model('IRS', internalRequestSchema)

const {scheduleSchema} = require('../models/scheduling.js') 
const schedule_model=mongoose.model("Schedule",scheduleSchema)

const {slotSchema} = require('../models/scheduling.js') 
const slot_model=mongoose.model("Slot",slotSchema)

// Department Schema and model ----------------------------------------
const {departmentSchema, find, findOne, findOneAndUpdate} = require('../models/academics.js')
const department_model = mongoose.model('Department', departmentSchema)
// Course Schema and model ----------------------------------------
const {courseSchema} = require('../models/academics.js') 
const course_model = mongoose.model('Course', courseSchema)

// Faculty Schema and model ----------------------------------------
const {facultySchema} = require('../models/academics.js') 
const Faculty_model = mongoose.model('Faculty', facultySchema)
// Location Schema and model ----------------------------------------
const {locationSchema} = require('../models/staff.js') 
const Location_model = mongoose.model('Location', locationSchema)
// Staff Schema and model ----------------------------------------
const {staffSchema} = require('../models/staff.js') 
const staff_model = mongoose.model('Staff', staffSchema)
// Staffcount Schema and model --------------------------------------
const {Staffcount} = require('../models/staff.js') 
const Staffcount_model = mongoose.model('Staffcount', Staffcount)
// scheduleAttendance Schema and model --------------------------------------
const {scheduleAttendance} = require('../models/scheduling.js') 
const scheduleAttendance_model = mongoose.model('ScheduleAttendance', scheduleAttendance)
// attendanceSchema Schema and model --------------------------------------
const {attendanceSchema} = require('../models/scheduling.js') 
const attendance_model = mongoose.model('Attendance', attendanceSchema)

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { readdirSync } = require('fs');

const { timeStamp } = require('console');
const { stringify } = require('querystring');
const scheduling = require('../models/scheduling.js');
const { Router } = require('express');
const { resolveSoa } = require('dns');
require('dotenv').config()

//------------------------------------------------------------------
// Add a location --------------------------------------------------
router.route('/AddLocation')
.post(async (req, res)=>{
    const {Code,Building,Type,Capacity}=req.body;
    try {
        if (req.user.role == "HR") {
            if(!Code){
                return res.status(400).json({msg:"Please enter a valid code"});
            }
            if(!Building){
                return res.status(400).json({msg:"Please enter a valid building"});
            }
            if(!Type){
                return res.status(400).json({msg:"Please enter a valid type"});
            }
            else if(Type != "office" && Type != "lab" && Type != "hall" && Type != "classroom"){
                return res.status(400).json({msg:"Please enter a valid type"});
            }
            if(!Capacity){
                return res.status(400).json({msg:"Please enter a valid capacity"});
            }
            const existinglocation = await Location_model.findOne({code:Code});
            if(existinglocation){
                return res.status(400).json({msg:"This Location already exists"});
            }
            const newLocation = new Location_model({code:Code,building:Building,type:Type,capacity:Capacity});
            await newLocation.save();
            const newLocationschedule = new schedule_model({id:Code})
            let newLocationslot;
            for(var i = 1; i < 6; i = i + 1){
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.sunday.push(newLocationslot)
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.saturday.push(newLocationslot)
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.monday.push(newLocationslot)
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.tuesday.push(newLocationslot)
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.wednesday.push(newLocationslot)
                newLocationslot = new slot_model({location:Code})
                await newLocationslot.save();
                await newLocationschedule.thursday.push(newLocationslot)
            }
            await newLocationschedule.save()
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//------------------------------------------------------------------
// Update a location -----------------------------------------------

router.route('/UpdateLocation')
.put(async (req, res)=>{
    const {Code,newCode,Building,Type,Capacity}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Code){
                return res.status(400).json({msg:"Please enter a valid Location code"});
            }
            const existinglocation1 = await Location_model.findOne({code:Code});
            if(!existinglocation1){
                return res.status(400).json({msg:"This Location doesn't exist"});
            }
            let Updatebuilding = Building, Updatetype = Type, Updatecapacity = Capacity, UpdateCode = newCode;
            if(!Building){
                Updatebuilding = existinglocation1.building;
            }
            if(!Type){
                Updatetype = existinglocation1.type;
            }
            else if(existinglocation1.type == "office" && Type != "office"){
                const staffinlocation = staff_model.findOne({officeLocation:existinglocation1.code})
                if(staffinlocation){
                    return res.status(400).json({msg:"The office needs to be empty before it can be changed!"});
                }
            }
            if(!Capacity){
                Updatecapacity = existinglocation1.capacity;
            }
            else{
                let stafflocation = await staff_model.find({officeLocation:existinglocation1.code})
                while(stafflocation.length != 0){
                    if(Updatecapacity == 0){
                        return res.status(400).json({msg:"The capacity isnt enough for the staff in this office!"});
                    }
                    else{
                        Updatecapacity = Updatecapacity - 1;
                        await stafflocation.shift();
                    }
                }
            }
            if(!newCode){
                UpdateCode = Code;
            }
            else{
                const locationschedule = schedule_model.findOne({id:Code})
                await schedule_model.findByIdAndUpdate(locationschedule._id,{id:newCode},{new:true})
                await locationschedule.save();
                const existinglocation2 = await Location_model.findOne({code:newCode});
                if(existinglocation2){
                    return res.status(400).json({msg:"The new Location id already exists"});
                }
                else{
                    let stafflocation = await staff_model.findOne({officeLocation:existinglocation1.code})
                    while(stafflocation){
                        let Updatestaff = await staff_model.findByIdAndUpdate(stafflocation._id,{officeLocation:UpdateCode},{new:true})
                        await Updatestaff.save();
                        stafflocation = await staff_model.findOne({officeLocation:existinglocation1.code})
                    }
                }
            }
            const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation1._id,
                {code:UpdateCode,building:Updatebuilding,type:Updatetype,capacity:Updatecapacity},{new:true});
            await Updatedlocation.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//------------------------------------------------------------------
// Delete a location -----------------------------------------------

router.route('/DeleteLocation')
.delete(async (req, res)=>{
    const {Code}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Code){
                return res.status(400).json({msg:"Please enter a valid Location code"});
            }
            const existinglocation = await Location_model.findOne({code:Code});
            if(!existinglocation){
                return res.status(400).json({msg:"This Location doesn't exist"});
            }
            let stafflocation = await staff_model.findOne({officeLocation:existinglocation.code})
            let updatedstaff;
            while(stafflocation){
                updatedstaff = await staff_model.findByIdAndUpdate(stafflocation._id,{officeLocation:""},{new:true});
                await updatedstaff.save();
                stafflocation = await staff_model.findOne({officeLocation:existinglocation.code});
            }
            const locationschedule = await schedule_model.findOne({id:Code})
            for(var i = 0; i<6; i=i+1){
                if(i == 0){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.saturday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.saturday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.saturday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.saturday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.saturday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.saturday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.saturday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
                if(i == 1){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.sunday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.sunday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.sunday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.sunday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.sunday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.sunday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.sunday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
                if(i == 2){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.monday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.monday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.monday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.monday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.monday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.monday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.monday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
                if(i == 3){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.tuesday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.tuesday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.tuesday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.tuesday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.tuesday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.tuesday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.tuesday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
                if(i == 4){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.wednesday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.wednesday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.wednesday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.wednesday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.wednesday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.wednesday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.wednesday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
                if(i == 5){
                    for(var j = 0; j<5; j=j+1){
                        let slot = locationschedule.thursday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.thursday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.thursday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.thursday.splice(j,0,slot)
                            await courseinslot.save()
                            let staffinslot = await schedule_model.findOne({id:slot.staff[0]})
                            let slot2 = await staffinslot.thursday[j]
                            slot = await slot_model.findById(slot2._id);
                            await staffinslot.thursday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await staffinslot.thursday.splice(j,0,slot)
                            await staffinslot.save()
                        }
                    }
                }
            }
            await schedule_model.findByIdAndDelete(locationschedule._id);
            await slot_model.deleteMany({location:Code})
            const deletedlocation = await Location_model.findByIdAndDelete(existinglocation._id);
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Add a faculty ----------------------------------------------------

router.route('/AddFaculty')
.post(async (req, res)=>{
    const {Name}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Name){
                return res.status(400).json({msg:"Please enter a valid Faculty name"});
            }
            const existingfaculty = await Faculty_model.findOne({name:Name});
            if(existingfaculty){
                return res.status(400).json({msg:"This Faculty already exists"});
            }
            const newFaculty = new Faculty_model({name:Name});
            await newFaculty.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Update a faculty -------------------------------------------------

router.route('/UpdateFaculty')
.put(async (req, res)=>{
    const {Name,newName}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Name||!newName){
                return res.status(400).json({msg:"Please enter a valid Faculty name"});
            }
            const existingfaculty1 = await Faculty_model.findOne({name:Name});
            const existingfaculty2 = await Faculty_model.findOne({name:newName});
            if(!existingfaculty1){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            if(existingfaculty2){
                return res.status(400).json({msg:"The new name already exists"});
            }
            let UpdateName = newName;
            if(!newName){
                UpdateName = existingfaculty1.name;
            }
            let departmentfaculty = await department_model.findOne({facultyname:Name})
            let updateddepartment;
            while(departmentfaculty){
                updateddepartment = await department_model.findByIdAndUpdate(departmentfaculty._id,{facultyname:newName},{new:true});
                await updateddepartment.save();
                departmentfaculty = await department_model.findOne({facultyname:Name})
            }
            const Updatedfaculty = await Faculty_model.findByIdAndUpdate(existingfaculty1._id,{name:UpdateName},{new:true});
            await Updatedfaculty.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Delete a faculty -------------------------------------------------

router.route('/DeleteFaculty')
.delete(async (req, res)=>{
    const {Name}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Name){
                return res.status(400).json({msg:"Please enter a valid Faculty name"});
            }
            const existingfaculty = await Faculty_model.findOne({name:Name});
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            let existingdepartment = await department_model.findOne({facultyname:Name})
            while(existingdepartment){
                let existingstaff = await staff_model.findOne({department:existingdepartment.name})
                while(existingstaff){
                    let updatestaff = await staff_model.findByIdAndUpdate(existingstaff._id,{department:""},{new:true})
                    await updatestaff.save();
                    existingstaff = await staff_model.findOne({department:existingdepartment.name})
                }
                let existingcourse = await course_model.findOne({departmentname:existingdepartment.name})
                while(existingcourse){
                    let lecturers = await existingcourse.lecturer
                    let TAs = await existingcourse.TA
                    while(lecturers.length != 0){
                        let lecturerid = lecturers.shift();
                        const lect = await staff_model.findOne({id:lecturerid})
                        await lect.course.pull(existingcourse.code)
                        await lect.save();
                    }
                    while(TAs.length != 0){
                        let TAid = TAs.shift();
                        const ta = await staff_model.findOne({id:TAid})
                        await ta.course.pull(existingcourse.code)
                        await ta.save();
                    }
                    await course_model.findByIdAndDelete(existingcourse._id)
                    existingcourse = await course_model.findOne({departmentname:existingdepartment.name})
                }
                await department_model.deleteOne({facultyname:Name});
                existingdepartment = await department_model.findOne({facultyname:Name})
            }
            const deletedfaculty = await Faculty_model.findByIdAndDelete(existingfaculty._id);
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Add a department under a faculty ---------------------------------

router.route('/AddDepartment')
.post(async (req, res)=>{
    const {FacultyName,DepartmentName,Head}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!FacultyName||!DepartmentName){
                return res.status(400).json({msg:"Please enter a valid Faculty and department names"});
            }
            const existingdepartment = await department_model.findOne({name:DepartmentName});
            if(existingdepartment){
                return res.status(400).json({msg:"This Department already exists"});
            }
            let Addhead = Head;
            if(Head){
                const existingstaff = await staff_model.findOne({id:Head,department:DepartmentName})
                if(!existingstaff){
                    return res.status(400).json({msg:"Please assign a valid HOD"});
                }
            }
            else{
                Addhead = "";
            }
            const newDepartment = new department_model({facultyname:FacultyName,name:DepartmentName,head:Addhead})
            await newDepartment.save()
            const existingfaculty = await Faculty_model.findOne({name:FacultyName})
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            await existingfaculty.departments.push(newDepartment)
            await existingfaculty.save()
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Update a department under a faculty ------------------------------

router.route('/UpdateDepartment')
.put(async (req, res)=>{
    const {FacultyName,DepartmentName,newDepartmentName,newFacultyname,newHead}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!DepartmentName || !FacultyName){
                return res.status(400).json({msg:"Please enter a valid Department and Faculty names"});
            }
            const existingfaculty = await Faculty_model.findOne({name:FacultyName});
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty Doesn't exist"});
            }
            const existingdepartment1 = await department_model.findOne({name:DepartmentName});
            const existingdepartment2 = await department_model.findOne({name:newDepartmentName});
            if(!existingdepartment1){
                return res.status(400).json({msg:"This Department Doesn't exist"});
            }
            if(existingdepartment2){
                return res.status(400).json({msg:"The new Department name already exists"});
            }
            if(existingdepartment1.facultyname != FacultyName){
                return res.status(400).json({msg:"please enter a vlaid faculty for this department"});
            }
            let UpdateDepartment = newDepartmentName, UpdateFaculty = newFacultyname,UpdateHead = newHead;
            if(newHead){
                const existingstaff = await staff_model.findOne({id:newHead,department:newDepartmentName})
                if(!existingstaff){
                    return res.status(400).json({msg:"Please assign a valid HOD"});
                }
            }
            else{
                UpdateHead = existingdepartment1.head;
            }
            if(!newFacultyname){
                UpdateFaculty = FacultyName;
            }
            else{
                const newfaculty = await Faculty_model.findOne({name:UpdateFaculty})
                if(!newfaculty){
                    return res.status(400).json({msg:"The entered Faculty doesn't exist"});
                }
            }
            if(!newDepartmentName){
                UpdateDepartment = DepartmentName;
            }
            else if(newDepartmentName != DepartmentName){
                let coursedepartment = await course_model.findOne({departmentname:DepartmentName})
                while(coursedepartment){
                    const updatedcourse = await course_model.findByIdAndUpdate(coursedepartment._id,{departmentname:UpdateDepartment},{new:true});
                    await updatedcourse.save();
                    coursedepartment = await course_model.findOne({departmentname:DepartmentName})
                }
                let staffindepartment = await staff_model.findOne({department:DepartmentName});
                while(staffindepartment){
                    const updatestaffindepartment = await staff_model.findByIdAndUpdate(staffindepartment._id,{department:UpdateDepartment},{new:true});
                    await updatestaffindepartment.save();
                    staffindepartment = await staff_model.findOne({department:DepartmentName});   
                }
            }
            const UpdatedDepartment = await department_model.findByIdAndUpdate(existingdepartment1._id,{facultyname:UpdateFaculty,name:UpdateDepartment,head:UpdateHead},{new:true})
            await UpdatedDepartment.save()
            if(UpdateFaculty != FacultyName){
                const prevfaculty = await Faculty_model.findOne({name:FacultyName})
                await prevfaculty.departments.pull(existingdepartment1);
                await prevfaculty.save()
                
                const newfaculty = await Faculty_model.findOne({name:UpdateFaculty})
                await newfaculty.departments.push(UpdatedDepartment)
                await newfaculty.save()
            }
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Delete a department under a faculty ------------------------------

router.route('/DeleteDepartment')
.delete(async (req, res)=>{
    const {FacultyName,Name}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Name || !FacultyName){
                return res.status(400).json({msg:"Please enter a valid Department and Faculty names"});
            }
            const existingfaculty = await Faculty_model.findOne({name:FacultyName});
            const existingdepartment = await department_model.findOne({name:Name});
            if(!existingdepartment){
                return res.status(400).json({msg:"This Department doesn't exist"});
            }
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            if(existingdepartment.facultyname != FacultyName){
                return res.status(400).json({msg:"This Department isn't in the choosen"});
            }
            if(existingdepartment.head){
                const existingstaff = await course_model.findOne({id:existingdepartment.head});
                const updatedstaff = await course_model.findByIdAndUpdate(existingstaff._id,{role:""},{new:true});
                await updatedstaff.save();
            }

            let existingstaff = await staff_model.findOne({department:Name})
            while(existingstaff){
                let updatestaff = await staff_model.findByIdAndUpdate(existingstaff._id,{department:""},{new:true})
                await updatestaff.save();
                existingstaff = await staff_model.findOne({department:Name})
            }
            let existingcourse = await course_model.findOne({departmentname:Name})
            while(existingcourse){
                let lecturers = await existingcourse.lecturer
                let TAs = await existingcourse.TA
                while(lecturers.length != 0){
                    let lecturerid = lecturers.shift();
                    const lect = await staff_model.findOne({id:lecturerid})
                    await lect.course.pull(existingcourse.code)
                    await lect.save();
                }
                while(TAs.length != 0){
                    let TAid = TAs.shift();
                    const ta = await staff_model.findOne({id:TAid})
                    await ta.course.pull(existingcourse.code)
                    await ta.save();
                }
                await course_model.findByIdAndDelete(existingcourse._id)
                existingcourse = await course_model.findOne({departmentname:Name})
            }
               
            const deleteddepartment = await department_model.findByIdAndDelete(existingdepartment._id);
            await existingfaculty.departments.pull(existingdepartment);
            await existingfaculty.save();
            let staffindepartment = await staff_model.findOne({department:Name});
            while(staffindepartment){
                const updatestaffindepartment = await staff_model.findByIdAndUpdate(staffindepartment._id,{department:""},{new:true});
                await updatestaffindepartment.save();
                staffindepartment = await staff_model.findOne({department:Name});   
            }
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//------------------------------------------------------------------
// Add a Course under a department ---------------------------------

router.route('/AddCourse')
.post(async (req, res)=>{
    const {Departmentname,Code,totalSlots}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentname||!Code){
                return res.status(400).json({msg:"Please enter a valid course code and department name"});
            }
            if(!totalSlots || totalSlots <= 0){
                return res.status(400).json({msg:"Please enter a valid number of total slots required"});
            }
            const existingcourse = await course_model.findOne({code:Code});
            if(existingcourse){
                return res.status(400).json({msg:"This Course exists already"});
            }
            const existingdepartment= await department_model.findOne({name:Departmentname})
            if(!existingdepartment){
                return res.status(400).json({msg:"This Department doesn't exist"});
            }
            const newCourse = new course_model({code:Code,departmentname:Departmentname,totalSlots:totalSlots})
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname})
            await existingfaculty.departments.pull(existingdepartment);
            await newCourse.save()
            await existingdepartment.courses.push(newCourse)
            await existingdepartment.save()

            await existingfaculty.departments.push(existingdepartment);
            await existingfaculty.save();
            let newcourseslot;
            const newcourseschedule = new schedule_model({id:Code})
            for(var i = 1; i < 6; i = i + 1){
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.sunday.push(newcourseslot)
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.saturday.push(newcourseslot)
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.monday.push(newcourseslot)
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.tuesday.push(newcourseslot)
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.wednesday.push(newcourseslot)
                newcourseslot = new slot_model({course:Code})
                await newcourseslot.save();
                await newcourseschedule.thursday.push(newcourseslot)
            }
            await newcourseschedule.save()
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Update a Course under a department -------------------------------

router.route('/UpdateCourse')
.put(async (req, res)=>{
    const {Departmentname,Code,newDepartmentname,newCode,totalslots}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentname || !Code){
                return res.status(400).json({msg:"Please enter a valid Department name and course code"});
            }
            const existingdepartment1 = await department_model.findOne({name:Departmentname});
            const existingcourse1 = await course_model.findOne({code:Code});
            const existingcourse2 = await course_model.findOne({code:newCode});
            if(!existingdepartment1){
                return res.status(400).json({msg:"This Department Doesn't exist"});
            }
            if(existingcourse2){
                return res.status(400).json({msg:"Can't change to a course code that already exists"});
            }
            if(!existingcourse1){
                return res.status(400).json({msg:"This course doesn't exist"});
            }
            if(existingcourse1.departmentname != Departmentname){
                return res.status(400).json({msg:"please enter a vlaid department for this course"});
            }
            let UpdateCode = newCode, Updateslots = totalslots, UpdateDepartment = newDepartmentname;
            if(!totalslots){
                Updateslots= existingcourse1.totalSlots;
            }
            else{
                Updateslots = totalslots - (existingcourse1.totalSlots * existingcourse1.coverage);
                if(Updateslots <= 0){
                    return res.status(400).json({msg:"please enter a vlaid number of slots for this course"});
                }
            }
            if(!newDepartmentname){
                UpdateDepartment = Departmentname;
            }
            if(!newCode){
                UpdateCode = Code;
            }
            else if(newCode != Code){
                const courseschedule = schedule_model.findOne({id:Code})
                await schedule_model.findByIdAndUpdate(courseschedule._id,{id:newCode},{new:true})
                await courseschedule.save();
                let lecturers = await existingcourse1.lecturer
                let TAs = await existingcourse1.TA
                while(lecturers.length != 0){
                    let lecturerid = lecturers.shift();
                    const lect = await staff_model.findOne({id:lecturerid})
                    await lect.course.pull(existingcourse1.code)
                    await lect.course.push(newCode)
                    await lect.save();
                }
                while(TAs.length != 0){
                    let TAid = TAs.shift();
                    const ta = await staff_model.findOne({id:TAid})
                    await ta.course.pull(existingcourse1.code)
                    await ta.course.push(newCode)
                    await ta.save();
                }
            }
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment1.facultyname});
            await existingfaculty.departments.pull(existingdepartment1);
            await existingfaculty.save();
            await existingdepartment1.courses.pull(existingcourse1)
            await existingdepartment1.save()
            const existingdepartment2 = await department_model.findOne({name:UpdateDepartment});
            const UpdatedCourse = await course_model.findByIdAndUpdate(existingcourse1._id,{code:UpdateCode,departmentname:UpdateDepartment,
                totalSlots:Updateslots},{new:true})
            await UpdatedCourse.save()
            await existingdepartment2.courses.push(UpdatedCourse)
            await existingdepartment2.save()
            const existingfaculty2 = await Faculty_model.findOne({name:existingdepartment2.facultyname});
            await existingfaculty2.departments.push(existingdepartment2);
            await existingfaculty2.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//-------------------------------------------------------------------
// Delete a Course under a department -------------------------------

router.route('/DeleteCourse')
.delete(async (req, res)=>{
    const {Departmentname,Code}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentname || !Code){
                return res.status(400).json({msg:"Please enter a valid Department name and course code"});
            }
            const existingdepartment = await department_model.findOne({name:Departmentname});
            const existingcourse = await course_model.findOne({code:Code});
            if(!existingdepartment){
                return res.status(400).json({msg:"This Department Doesn't exist"});
            }
            if(!existingcourse){
                return res.status(400).json({msg:"This course doesn't exist"});
            }
            if(existingcourse.departmentname != Departmentname){
                return res.status(400).json({msg:"please enter a vlaid department for this course"});
            }
            let lecturers = await existingcourse.lecturer
            let TAs = await existingcourse.TA
            while(lecturers.length != 0){
                console.log(lecturers)
                let lecturerid = lecturers.shift();
                const lect = await staff_model.findOne({id:lecturerid})
                await lect.course.pull(Code)
                await lect.save();
            }
            while(TAs.length != 0){
                console.log(TAs)
                let TAid = TAs.shift();
                const ta = await staff_model.findOne({id:TAid})
                await ta.course.pull(Code)
                await ta.save();
            }
            const courseschedule = await schedule_model.findOne({id:Code})
            for(var i = 0; i<6; i=i+1){
                if(i == 0){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.saturday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.saturday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.saturday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.saturday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.saturday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.saturday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.saturday.splice(j,0,slot)                          
                            }
                        }
                    }
                }
                if(i == 1){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.sunday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.sunday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.sunday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.sunday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.sunday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.sunday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.sunday.splice(j,0,slot)                          
                            }
                        }                        
                    }
                }
                if(i == 2){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.monday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.monday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.monday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.monday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.monday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.monday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.monday.splice(j,0,slot)                          
                            }
                        }
                    }
                }
                if(i == 3){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.tuesday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.tuesday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.tuesday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.tuesday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.tuesday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.tuesday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.tuesday.splice(j,0,slot)                          
                            }
                        }
                    }
                }
                if(i == 4){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.wednesday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.wednesday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.wednesday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.wednesday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.wednesday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.wednesday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.wednesday.splice(j,0,slot)                          
                            }
                        }
                    }
                }
                if(i == 5){
                    for(var j = 0; j<5; j=j+1){
                        let slot = courseschedule.thursday[j]
                        if(!slot.isEmpty){
                            for(var n = 0; n < slot.location.length; n = n + 1){
                                let locationinslot = await schedule_model.findOne({id:slot.location[n]})
                                let slot1 = await locationinslot.thursday[j]
                                slot = await slot_model.findById(slot1._id);
                                await locationinslot.thursday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.staff.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await locationinslot.thursday.splice(j,0,slot)
                                await locationinslot.save()
                            }
                            for(var m = 0; m < slot.location.length; m = m + 1){
                                let staffinslot = await schedule_model.findOne({id:slot.staff[m]})
                                let slot2 = await staffinslot.thursday[j]
                                slot = await slot_model.findById(slot2._id);
                                await staffinslot.thursday.splice(j,1)
                                await slot.location.splice(0,1)
                                await slot.course.splice(0,1)
                                await slot.type.splice(0,1)
                                await slot.compensation.splice(0,1)
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                                slot.save()
                                await staffinslot.thursday.splice(j,0,slot)                          
                            }
                        }
                    }
                }
            }
            await schedule_model.findByIdAndDelete(courseschedule._id);
            await slot_model.deleteMany({location:Code})
            const deletedCourse = await course_model.findByIdAndDelete(existingcourse._id);
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname});
            await existingfaculty.departments.pull(existingdepartment);
            await existingfaculty.save();
            await existingdepartment.courses.pull(existingcourse);
            await existingdepartment.save();
            await existingfaculty.departments.push(existingdepartment);
            await existingfaculty.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//------------------------------------------------------------------
// Add a staff member ----------------------------------------------
router.route('/AddStaff')
.post(async (req,res)=>{
    const {name,email,salary,officelocation,role,dayOff,department,gender}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(role == "HR"){
                if(dayoff != "Sat"){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
            }
            if(!salary || salary <= 0){
                return res.status(400).json({msg:"Please enter a valid Salaray"});
            }
            if(!gender && gender != "M" && gender != "F"){
                return res.status(400).json({msg:"Please enter a valid gender"});
            }
            let Adddepartment;
            if(!department){
                Adddepartment = "";
            }
            else{
                if(role == "HR"){
                    return res.status(400).json({msg:"HR can't be assigned a department"});
                }
                Adddepartment = department;
            }
            if(dayoff != "Sunday" && dayoff != "Monday" && dayoff != "Tuesday" && dayoff != "Wednesday" && dayoff != "Thursday" && dayoff != "Saturday"){
                return res.status(400).json({msg:"Please enter a valid dayoff other than the weekend"});
            }
            const existinglocation = await Location_model.findOne({code:officelocation})
            if(!existinglocation){
                return res.status(400).json({msg:"Please enter a valid location"});
            }
            if(existinglocation.capacity == 0){
                return res.status(400).json({msg:"This office is full, please assign a different one"});
            }
            if(existinglocation.type != "office"){
                return res.status(400).json({msg:"The assigned location must be an office"});
            }
            const existingstaff = await staff_model.findOne({email:email})
            if(existingstaff){
                return res.status(400).json({msg:"This email is already taken"});
            }
            let password ="123456";
            const salt= await bcrypt.genSalt(10)
            password = await bcrypt.hash(password, salt)
            var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if(!email.match(mailformat)){
                return res.status(400).json({msg:"This email is invalid"});
            }
            let id;
            const newStaffcount = await Staffcount_model.findOne({id:"1"});
            if(role == "HR"){
                id = "hr-" + newStaffcount.HR;
                const Updatedcount = newStaffcount.HR + 1;
                const UpdatedStaffcount = await Staffcount_model.findByIdAndUpdate(newStaffcount._id,{HR:Updatedcount},{new:true});
                await UpdatedStaffcount.save();
            }
            else{
                id = "ac-" + newStaffcount.Academic;
                const Updatedcount = newStaffcount.Academic + 1;
                const UpdatedStaffcount = await Staffcount_model.findByIdAndUpdate(newStaffcount._id,{Academic:Updatedcount},{new:true});
                await UpdatedStaffcount.save();
            }
            const newStaff = new staff_model({id:id,name:name,email:email,password:password,role:role,salary:salary,dayOff:dayoff,officeLocation:officelocation,
            department:Adddepartment,gender:gender});
            await newStaff.save();
            const newCapacity = existinglocation.capacity - 1;
            const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation._id,{capacity:newCapacity},{new:true});
            await Updatedlocation.save();
            let newstaffslot;
            const newstaffschedule = new schedule_model({id:id})
            for(var i = 1; i < 6; i = i + 1){
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.sunday.push(newstaffslot)
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.saturday.push(newstaffslot)
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.monday.push(newstaffslot)
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.tuesday.push(newstaffslot)
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.wednesday.push(newstaffslot)
                newstaffslot = new slot_model({staff:id})
                await newstaffslot.save();
                await newstaffschedule.thursday.push(newstaffslot)
            }
            await newstaffschedule.save()
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// Update a staff member ---------------------------------------------

router.route('/Updatetaff')
.put(async (req,res)=>{
    const {id,name,email,officelocation,role,dayoff,department}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await staff_model.findOne({id:id})
            let Updatename = name,Updateemail = existingstaff.email,Updaterole = role,Updatelocation = officelocation,Updatedayoff = dayoff,Updatedepartment = department;
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            if(dayoff){
                if((dayoff != "Saturday" && role == "HR") || (dayoff != "Saturday" && existingstaff.role == "HR" && !role)){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
                else if(dayoff != "Saturday" && dayoff != "Sunday" && dayoff != "Monday" && dayoff != "Tuesday" && dayoff != "Wednesday" && dayoff != "Thursday"){
                    return res.status(400).json({msg:"Please enter a valid dayoff other than the weekend"});
                }
            }
            else{
                Updatedayoff = existingstaff.dayOff;
            }
            if(department){
                if(role == "HR" || (existingstaff.role == "HR" && !role)){
                    return res.status(400).json({msg:"HR can't be assigned a department"});
                }
                const existingdepartment = await department_model.findOne({name:department});
                if(!existingdepartment){
                    return res.status(400).json({msg:"This department doesn't exist"});
                }
            }
            else{
                Updatedepartment = existingstaff.department;
            }
            if(officelocation){
                const existinglocation1 = await Location_model.findOne({Code:existingstaff.officeLocation})
                const Updatedcapacity1 = existinglocation1.capacity + 1;
                const Updatedlocation1 = await Location_model.findByIdAndUpdate(existinglocation1._id,{capacity:Updatedcapacity1});
                Updatedlocation1.save();
                const existinglocation2 = await Location_model.findOne({code:officelocation})
                if(!existinglocation2){
                    return res.status(400).json({msg:"Please enter a valid location"});
                }
                if(existinglocation2.capacity == 0){
                    return res.status(400).json({msg:"This office is full, please assign a different one"});
                }
                if(existinglocation2.type != "office"){
                    return res.status(400).json({msg:"The assigned location must be an office"});
                }
                const Updatedcapacity2 = existinglocation2.capacity - 1;
                const Updatedlocation2 = await Location_model.findByIdAndUpdate(existinglocation._id,{capacity:Updatedcapacity2});
                Updatedlocation2.save();
            }
            else{
                Updatelocation = existingstaff.officeLocation;
            }
            if(email){
                const existingstaff = await staff_model.findOne({email:email})
                if(existingstaff){
                    return res.status(400).json({msg:"This email is already taken"});
                }
                var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if(!email.match(mailformat)){
                    return res.status(400).json({msg:"This email is invalid"});
                }
                Updateemail = email;
            }
            if(!name){
                Updatename = existingstaff.name;
            }
            if(!role){
                Updaterole = existingstaff.role;
            }
            const UpdatedStaff = await staff_model.findByIdAndUpdate(existingstaff._id,{name:Updatename,email:Updateemail,role:Updaterole,
            officelocation:Updatelocation,dayOff:Updatedayoff,department:Updatedepartment},{new:true});
            await UpdatedStaff.save();
            res.send();
        
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// Delete a staff member ---------------------------------------------

router.route('/DeleteStaff')
.delete(async (req,res)=>{
    const {id}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await staff_model.findOne({id:id});
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            const existinglocation = await Location_model.findOne({Code:existingstaff.officeLocation})
            if(existinglocation){
                const Updatedcapacity = existinglocation.capacity + 1;
                const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation._id,{capacity:Updatedcapacity});
                Updatedlocation.save();
            }
            let currentcourse = existingstaff.course.shift();
            if(currentcourse){
                let existingcourse = await course_model.findOne({code:currentcourse});
                let existingdepartment = await department_model.findOne({name:existingcourse.departmentname});
                const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname});
                await existingfaculty.departments.pull(existingdepartment);    
                await existingfaculty.save();
                while(currentcourse){
                    existingcourse = await course_model.findOne({code:currentcourse});
                    await existingdepartment.courses.pull(existingcourse); 
                    await existingdepartment.save();
                    if(existingstaff.role == "TA"){
                        await existingcourse.TA.pull(existingstaff.id);
                    }
                    else{
                        await existingcourse.lecturer.pull(existingstaff.id);
                    }
                    await existingcourse.save();
                    await existingdepartment.courses.push(existingcourse);
                    await existingdepartment.save();
                    currentcourse = existingstaff.course.shift();
                }
                await existingfaculty.departments.push(existingdepartment);
                await existingfaculty.save();
            }
            const staffschedule = await schedule_model.findOne({id:id})
            for(var i = 0; i<6; i=i+1){
                if(i == 0){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.saturday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.saturday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.saturday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.saturday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.saturday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.saturday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.saturday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
                if(i == 1){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.sunday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.sunday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.sunday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.sunday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.sunday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.sunday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.sunday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
                if(i == 2){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.monday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.monday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.monday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.monday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.monday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.monday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.monday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
                if(i == 3){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.tuesday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.tuesday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.tuesday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.tuesday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.tuesday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.tuesday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.tuesday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
                if(i == 4){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.wednesday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.wednesday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.wednesday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.wednesday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.wednesday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.wednesday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.wednesday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
                if(i == 5){
                    for(var j = 0; j<5; j=j+1){
                        let slot = staffschedule.thursday[j]
                        if(!slot.isEmpty){
                            let courseinslot = await schedule_model.findOne({id:slot.course[0]})
                            let slot1 = await courseinslot.thursday[j]
                            slot = await slot_model.findById(slot1._id);
                            await courseinslot.thursday.splice(j,1)
                            let index;
                            for(var k = 0;k<slot.location.length; k = k + 1){
                                if(slot.location[k] == Code){
                                    index = k;
                                }
                            }
                            await slot.location.splice(index,1)
                            await slot.staff.splice(index,1)
                            await slot.type.splice(index,1)
                            await slot.compensation.splice(index,1)
                            if(slot.location.length == 0){
                                await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            }
                            slot.save()
                            await courseinslot.thursday.splice(j,0,slot)
                            await courseinslot.save()
                            let locationinslot = await schedule_model.findOne({id:slot.location[0]})
                            let slot2 = await locationinslot.thursday[j]
                            slot = await slot_model.findById(slot2._id);
                            await locationinslot.thursday.splice(j,1)
                            await slot.location.splice(0,1)
                            await slot.course.splice(0,1)
                            await slot.type.splice(0,1)
                            await slot.compensation.splice(0,1)
                            await slot_model.findByIdAndUpdate(slot._id,{isEmpty:true},{new:true})
                            slot.save()
                            await locationinslot.thursday.splice(j,0,slot)
                            await locationinslot.save()
                        }
                    }
                }
            }
            await schedule_model.findByIdAndDelete(staffschedule._id);
            await slot_model.deleteMany({location:id})
            const deletedstaff = await staff_model.findByIdAndDelete(existingstaff._id);
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// Update Salary -----------------------------------------------------

router.route('/UpdateSalary')
.put(async (req,res)=>{
    const {id,promotion}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await staff_model.findOne({id:id});
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            let currentstaffattendance = await scheduleAttendance_model.findOne({id:id})
            let misseddays = currentstaffattendance.missedDays
            let missedhours = currentstaffattendance.missedHours - 3
            let newsalary = existingstaff.salary
            while(misseddays != 0){
                newsalary = newsalary - newsalary/60;
                misseddays = misseddays -1;
            }
            while(missedhours != 0 ){
                newsalary = newsalary - newsalary/180;
                missedhours = missedhours - 1;
            }
            missedhours = (missedhours*100) * 60;
            while(missedhours != 0){
                newsalary = newsalary - ((newsalary/180) * 60);
                missedhours = missedhours - 1;
            }
            if(promotion){
                if(promotion < 0){
                    return res.status(400).json({msg:"Please enter a valid id"});
                }
                newsalary = newsalary + promotion
            }
            const Updatedstaff = await staff_model.findByIdAndUpdate(existingstaff._id,{salary:newsalary},{new:true});
            await Updatedstaff.save();
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// Add Sign in record --------------------------------------------
router.route('/AddsignIn')
.post(async(req,res)=>{
    const{id,date,Time} = req.body;
    try {
        if (req.user.role  == "HR") {
            var year = date.substring(6,10);
            var month = date.substring(0,2);
            var date1 = date.substring(3,5);
            var hour = Time.substring(0,2);
            var minute = Time.substring(3,5);
            var today = new Date();
            today.setFullYear(year)
            today.setMonth(month-1)
            today.setDate(date1)
            today.setHours(hour)
            today.setMinutes(minute)
            if(today.toTimeString().substring(0,2)>"19"){
                res.send("You cannot add a sign in after 7PM")
            }
            if(today.toTimeString().substring(0,2)<"07"){
                res.send("You cannot add a sign in before 7AM")
            }
            const user= await staff_model.findOne({id:id})
            var attendance= await attendance_model.findOne({"id":id,"date":today.toLocaleString().substring(0,10)})
            var schedule_attendance = null
            if(today.toDateString().substring(8,10)<"11"){
                schedule_attendance = await scheduleAttendance_model.findOne({"id":id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
            }
            else{
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
            }
            if(schedule_attendance==null){
                if(today.toDateString().substring(8,10)<"11"){
                    schedule_attendance = new scheduleAttendance_model({
                        id:user.id,
                        month:(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()
                    })
                    await schedule_attendance.save()
                }
                else{
                    schedule_attendance = new scheduleAttendance_model({
                        id:user.id,
                        month:today.toLocaleString().substring(0,2)
                    })
                    await schedule_attendance.save()
                }
            }
        
            if(attendance==null){
                attendance = new attendance_model({
                    id:user.id,
                    date:today.toLocaleString().substring(0,10),
                    day:today.toUTCString().substring(0,3),
                    month:today.toLocaleString().substring(0,2)
                })
                if(user.dayOff != today.toUTCString().substring(0,3)){
                    var x = schedule_attendance.missedHours+8
                    schedule_attendance.missedHours=x
                }
                for(var i in schedule_attendance.days){
                    if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                        schedule_attendance.days.splice(i,1)
                    }
                }
                
                attendance.signIn.push(today)
                schedule_attendance.days.push(attendance)
                await attendance.save()
            }else{
                if(attendance.signIn.length!=attendance.signOut.length){
                    attendance.signIn.pop()
                    attendance.signIn.push(today)
                }
                else{
                    attendance.signIn.push(today)
                }
                await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toLocaleString().substring(0,10)},attendance)
        
                for(var i in schedule_attendance.days){
                    if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                        schedule_attendance.days.splice(i,1)
                    }
                }
                schedule_attendance.days.push(attendance)
            }
        
            if(today.toDateString().substring(8,10)<"11"){
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
            }
            else{
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
            }
            res.send();
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// Add Sign out record -----------------------------------------------
router.route('/AddsignOut')
.post(async(req,res)=>{
    const{id,date,Time} = req.body;
    try {
        if (req.user.role  == "HR") {
            var year = date.substring(6,10);
            var month = date.substring(0,2);
            var date1 = date.substring(3,5);
            var hour = Time.substring(0,2);
            var minute = Time.substring(3,5);
            var today = new Date();
            today.setFullYear(year)
            today.setMonth(month-1)
            today.setDate(date1)
            today.setHours(hour)
            today.setMinutes(minute)
            if(today.toTimeString().substring(0,2)>"19"){
                res.send("You cannot add a sign in after 7PM")
            }
            if(today.toTimeString().substring(0,2)<"07"){
                res.send("You cannot add a sign out before 7AM")
            }
            const user= await staff_model.findOne({id:id})
            const attendance= await attendance_model.findOne({"id":user.id,
                "date":today.toLocaleString().substring(0,10)})
            var schedule_attendance = null
            if(today.toDateString().substring(8,10)<"11"){
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
            }
            else{
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
            }
            if(!attendance||!schedule_attendance){
                res.send("You did not sign in today")
            }else{
                if(attendance.signIn.length!=(attendance.signOut.length+1)){
                    res.send("You did not sign in")
                }
                else{
                    attendance.signOut.push(today)
                }
                var diff =(attendance.signOut[attendance.signOut.length-1]-attendance.signIn[attendance.signIn.length-1])/(1000*60*60)
                diff=schedule_attendance.missedHours-diff
                schedule_attendance.missedHours=diff
                await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toLocaleString().substring(0,10)},attendance)
                for(var i in schedule_attendance.days){
                    if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                        schedule_attendance.days.splice(i,1)
                    }
                }
                schedule_attendance.days.push(attendance)
                if(today.toDateString().substring(8,10)<"11"){
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
                }
                else{
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
                }
                res.send();
            }
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// view staff attendance ---------------------------------------------

router.route('/viewStaffAttendance')
.get(async (req,res)=>{
    const {id}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await staff_model.findOne({id:id});
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            const staffAttendance = await scheduleAttendance_model.findOne({id:id});
            res.send(staffAttendance);
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// View staff with missed days or hours ------------------------------
router.route('/Viewmissed')
.get(async (req,res)=>{
    try {
        if (req.user.role  == "HR") {
            let existingattendance = await scheduleAttendance_model.find({missedHours:{$gte:1}});
            let allstaff = [];
            for(var i = 0; i< existingattendance.length; i = i+1){
                const onestaff = await staff_model.findOne({id:existingattendance[i].id})
                allstaff.push(onestaff)
            }
            existingattendance = await scheduleAttendance_model.find({missedDays:{$gte:1}});
            for(var i = 0; i< existingattendance.length; i = i+1){
                const onestaff = await staff_model.findOne({id:existingattendance[i].id})
                allstaff.push(onestaff)
            }
            res.send(allstaff)
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// logout ------------------------------------------------------------

router.route('/logout')
.post(async(req,res)=>{
    try{
        const user=await staff_model.findById(req.user._id);
        user.token = null
        await staff_model.findOneAndUpdate({_id:req.user._id},user)
        res.send("logged out")
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// view profile ------------------------------------------------------

router.route('/viewProfile')
.get(async(req,res)=>{
    try{
        const result= await staff_model.findById(req.user._id)
        res.send(result)
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// update profile ----------------------------------------------------

router.route('/updateProfile')
.put(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        if(req.body.officeLocation){
            user.officeLocation=req.body.officeLocation
        }
        if(req.body.email){
            user.email=req.body.email
        }
        if(req.body.dayOff){
            user.dayOff=req.body.dayOff
        }
        if(req.body.oldPassword!=null&&req.body.newPassword!=null){
            const correctPassword= await bcrypt.compare(req.body.oldPassword, user.password)
            if(correctPassword){
                    const salt= await bcrypt.genSalt(10)
                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt) 
                    user.password=req.body.newPassword
            }else{
                res.send("wrong insertion")
            }
        }

        await staff_model.findByIdAndUpdate(req.user._id,user)

        res.send()
    }
    catch(error){
        res.status(500).json({error:error.message});
    }

})
//--------------------------------------------------------------------
// sign In -----------------------------------------------------------

router.route('/signIn')
.post(async(req,res)=>{
    try{
        var today =  new Date()
        if(today.toTimeString().substring(0,2)>"19"){
            res.send("You cannot sign in after 7PM")
        }
        if(today.toTimeString().substring(0,2)<"07"){
            today.setHours(7)
            today.setMinutes(0)
        }
        const user= await staff_model.findById(req.user._id)
        var attendance= await attendance_model.findOne({"id":user.id,"date":today.toLocaleString().substring(0,10)})
        var schedule_attendance = null
        if(today.toDateString().substring(8,10)<"11"){
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
        }
        else{
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
        }
        if(schedule_attendance==null){
            if(today.toDateString().substring(8,10)<"11"){
                schedule_attendance = new scheduleAttendance_model({
                    id:user.id,
                    month:(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()
                })
                await schedule_attendance.save()
            }
            else{
                schedule_attendance = new scheduleAttendance_model({
                    id:user.id,
                    month:today.toLocaleString().substring(0,2)
                })
                await schedule_attendance.save()
            }
        }

        if(attendance==null){
            attendance = new attendance_model({
                id:user.id,
                date:today.toLocaleString().substring(0,10),
                day:today.toUTCString().substring(0,3),
                month:today.toLocaleString().substring(0,2)
            })
            if(user.dayOff != today.toUTCString().substring(0,3)){
                var x = schedule_attendance.missedHours+8
                schedule_attendance.missedHours=x
            }
            for(var i in schedule_attendance.days){
                if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                    schedule_attendance.days.splice(i,1)
                }
            }
            
            attendance.signIn.push(today)
            schedule_attendance.days.push(attendance)
            await attendance.save()
        }else{
            if(attendance.signIn.length!=attendance.signOut.length){
                attendance.signIn.pop()
                attendance.signIn.push(today)
            }
            else{
                attendance.signIn.push(today)
            }
            await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toLocaleString().substring(0,10)},attendance)

            for(var i in schedule_attendance.days){
                if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                    schedule_attendance.days.splice(i,1)
                }
            }
            schedule_attendance.days.push(attendance)
        }

        if(today.toDateString().substring(8,10)<"11"){
            await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
        }
        else{
            await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
        }
        res.send()
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// sign Out ----------------------------------------------------------

router.route('/signOut')
.post(async(req,res)=>{
    try{
        var today =  new Date()
        if(today.toTimeString().substring(0,2)>"19"){
            today.setHours(19)
            today.setMinutes(0)
        }
        if(today.toTimeString().substring(0,2)<"07"){
            today.setHours(7)
            today.setMinutes(0)
        }
        const user= await staff_model.findById(req.user._id)
        const attendance= await attendance_model.findOne({"id":user.id,"date":today.toLocaleString().substring(0,10)})
        var schedule_attendance = null
        if(today.toDateString().substring(8,10)<"11"){
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
        }
        else{
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
        }
        if(!attendance||!schedule_attendance){
            res.send("You did not sign in today")
        }else{
            if(attendance.signIn.length!=(attendance.signOut.length+1)){
                res.send("You did not sign in")
            }
            else{
                attendance.signOut.push(today)
            }
            var diff =(attendance.signOut[attendance.signOut.length-1]-attendance.signIn[attendance.signIn.length-1])/(1000*60*60)
            diff=schedule_attendance.missedHours-diff
            schedule_attendance.missedHours=diff
            await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toLocaleString().substring(0,10)},attendance)
            for(var i in schedule_attendance.days){
                if(schedule_attendance.days[i].date==today.toLocaleString().substring(0,10)){
                    schedule_attendance.days.splice(i,1)
                }
            }
            schedule_attendance.days.push(attendance)
            if(today.toDateString().substring(8,10)<"11"){
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
            }
            else{
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
            }
            res.send()
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// reset Password ----------------------------------------------------

router.route('/resetPassword')
.put(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const correctPassword= await bcrypt.compare(req.body.oldPassword, user.password)
        if(correctPassword){
            const salt= await bcrypt.genSalt(10)
            req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt) 
            user.password=req.body.newPassword
            await staff_model.findByIdAndUpdate(req.user._id,user)
            res.send("Password Changed");
        }else{
            res.send("wrong insertion")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
// //--------------------------------------------------------------------
// // view attendance ---------------------------------------------------

router.route('/viewAttendance')
.get(async (req,res)=>{
    try{
        var today =  new Date()
        const user= await staff_model.findById(req.user._id)
        if(req.body.month==null){
            const attendance = await attendance_model.find({id:user.id})
            if(attendance==null){
                res.send("You have not attende anything yet")
            }
            else{
                res.send(attendance)
            }
        }
        else{
            const attendance = await attendance_model.find({id:user.id,month:req.body.month}) 
            if(attendance==null){
                res.send("You have no attende in this month")
            }
            else{
                res.send(attendance)
            }
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
// //--------------------------------------------------------------------
// // view Missing Days ---------------------------------------------------

router.route('/viewMissingDays')
.get(async(req,res)=>{
    try{
        var today =  new Date()
        const user= await staff_model.findById(req.user._id)
        var schedule_attendance = null
        if(today.toDateString().substring(8,10)<"11"){
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
        }
        else{
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
        }
        if(schedule_attendance==null){
            res.send("You're missing days have not yet been calculated this month")
        }
        else{
            res.send(schedule_attendance.missedDays.toString())
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
// //--------------------------------------------------------------------
// // view Missing Hours ---------------------------------------------------

router.route('/viewMissingHours')
.get(async(req,res)=>{
    try{
        var today =  new Date()
        const user= await staff_model.findById(req.user._id)
        var schedule_attendance = null
        if(today.toDateString().substring(8,10)<"11"){
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()})
        }
        else{
            schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,2)})
        }
        if(schedule_attendance==null){
            res.send("You're missing hours have not yet been calculated this month")
        }
        else{
            res.send(schedule_attendance.missedHours.toString())
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

//--------------------------------------------------------------------
// view Schedule -----------------------------------------------------

router.route('/viewschedule')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const Schedule= await schedule_model.findOne({id:user.id})
    res.send(Schedule)
}else
res.send('HR cants view schedules of any kind')
})

router.route('/sendReplacmentReq')
.post(async(req,res)=>{

    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
        if(req.body.date==null||req.body.date.length!=10){
            res.send("Enter date request will take effect of format MM/DD/YYYY")
        }
        const course=await course_model.findOne({course:req.body.course})
        for(var i =0;i<user.courses.length();i++){
            if(user.courses[i]==course.id){
                const receiver=await staff_model.findById(req.body.id)
                for(var x =0;i<course.TA.length();x++){
                    if(course.TA[i]==receiver.id){
                        const newreqest = await new request_model({type:'ReplacmentReq',date:req.body.date,requester:user.id,receiver:receiver.id,reason:req.body.reason})
                        await newreqest.save()
                        res.send(newreqest)
                    }
                }
            }
        }
        res.send('invalid course or recepiant entered')
}else
res.send('HR cants have requests of any kind')
})

router.route('/viewReplacementReq')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
        const myrequests= await request_model.find({type:'ReplacmentReq',requester:user.id})
        res.send(myrequests)
    }else
        res.send('HR cants have requests or view of any kind')
})
router.route('/slotlinkingrequest')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(req.body.date==null||req.body.date.length!=10){
        res.send("Enter date request will take effect of format MM/DD/YYYY")
    }
    if(user.role!='HR'){
        const course=await course_model.findOne({course:req.body.course})
        for(var i =0;i<user.courses.length();i++){
            if(user.courses[i]==course.id){
                const newreqest = await new request_model({type:'slotlinkingrequest',requester:user.id,receiver:course.courseCoordinator.id,date:req.body.date,reason:req.body.reason,slot:req.body.slot,location:req.body.location})
                await newreqest.save()
                res.send(newreqest)
        }
    }res.send('no course fits')
    }else
    res.send('HR cants have requests of any kind')
})
router.route('/changeDayOffReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const department = await department_model.findOne({name:user.department})
    if(department!=null){
        const newreqest = await new request_model({type:'changeDayOffReq',reason:req.body.reason,requester:user.id,receiver:department.head,newDay:req.body.newDay})
        await newreqest.save()
        res.send(newreqest)
    }else{
        res.send('no head of department was found')
    }
}else
res.send('HR cants have requests of any kind')
})


router.route('/AnnualLeaveReq')
.post(async(req,res)=>{
    if(req.body.date==null||req.body.date.length!=10){
        res.send("Enter date request will take effect of format MM/DD/YYYY")
    }
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const department = await department_model.findOne({name:user.department})
    if(department.head!=null){
        if(req.body.type=='AnnualLeave'&&req.body.date>=Date.now()&&department.head!=null){
            const replacementREQ= await request_model.findOne({type:'ReplacmentReq',requester:user.id})
            if(replacementREQ!=null&&replacementREQ.status=='accepted'){
                const newreqest = await new request_model({type:'AnnualLeave',reason:req.body.reason,requester:user.id,receiver:department.head,replacement:replacementREQ.receiver.id,date:req.body.date,amount:req.body.amount})
                await newreqest.save()
                res.send(newreqest)
            }else{
                const newreqest = await new request_model({type:'AnnualLeave',reason:req.body.reason,requester:user.id,receiver:department.head,replacement:'null',date:req.body.date})
                await newreqest.save()
                res.send(newreqest)   
                    }
                }else{
                    res.send('incorrect details entered')
                }
            }else
                 res.send('no head of department was found')
                
        }else
        res.send('HR cants have requests of any kind')
    })

    router.route('/CompensationLeaveReq')
    .post(async(req,res)=>{
        if(req.body.date==null||req.body.date.length!=10){
            res.send("Enter date request will take effect of format MM/DD/YYYY")
        }
        const user = await staff_model.findById(req.user._id)
        if(user.role!='HR'){
        const department = await department_model.findOne({name:user.department})
        if(department.head!=null){
     if(req.body.type=='CompensationLeave'&&req.body.reason!=null&&department.head!=null){
            const newreqest = await new request_model({type:'CompensationLeave',reason:req.body.reason,date:req.body.date,requester:user.id,receiver:department.head,amount:req.body.amount})
            await newreqest.save()
            res.send(newreqest)
        }else{
            if(req.body.type=='CompensationLeave'&&req.body.reason==null){
                res.send('CompensationLeave need a reason pls state yours')
        }else{
            res.send('not right kind of leave dumdum')
        }
    }
}
    else
            res.send('no head of department was found')
}      
   else
   res.send('HR cants have requests of any kind')
                })



router.route('/MaternityLeaveReq')
.post(async(req,res)=>{
    if(req.body.date==null||req.body.date.length!=10){
        res.send("Enter date request will take effect of format MM/DD/YYYY")
    }
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
        const department = await department_model.findOne({name:user.department})
        if(department.head!=null){
            if(req.body.type=='MaternityLeave'&&user.gender=="F"){
                const newreqest = await new request_model({type:'MaternityLeave',reason:req.body.reason,date:req.body.date,requester:user.id,receiver:department.head,amount:req.body.amount})
                await newreqest.save()
                res.send(newreqest)
             }else{
                res.send('not right kind of leave or wrong gender')
            }
            }else
                res.send('no head of department was found')
               
    }else
       res.send('HR cants have requests of any kind')
})








router.route('/accidentalLeaveReq')
.post(async(req,res)=>{
    if(req.body.date==null||req.body.date.length!=10){
        res.send("Enter date request will take effect of format MM/DD/YYYY")
    }
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const department = await department_model.findOne({name:user.department})
    if(department.head!=null){
        if(req.body.type=='accidentalLeave'&&req.body.amount>=6){
            res.send('no more than six days can be had as accedentall leave')
    }else{
        if(req.body.type=='accidentalLeave'&&req.body.amount<=6){
            const newreqest = await new request_model({type:'accidentalLeave',reason:req.body.reason,requester:user.id,date:req.body.date,receiver:department.head,amount:req.body.amount})
            await newreqest.save()
            res.send(newreqest)
    
               }else{
                res.send('not right kind of leave dumdum')
            }
            }
        }else
            res.send('no head of department was found')
           
   }else
   res.send('HR cants have requests of any kind') 
})
router.route('/sickleaveReq')
.post(async(req,res)=>{
    if(req.body.date==null||req.body.date.length!=10){
        res.send("Enter date request will take effect of format MM/DD/YYYY")
    }
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
        const department = await department_model.findOne({name:user.department})
        if(department.head!=null){
            if(req.body.type=='sickleave'){
                 const newreqest = await new request_model({type:'sickleave',reason:req.body.reason,date:req.body.date,requester:user.id,receiver:department.head,amount:req.body.amount})
                 await newreqest.save()
                 res.send(newreqest)
         
        }else{
            res.send('not right kind of leave dumdum')
        }
         }else
            res.send('no head of department was found')
   
    }else
        res.send('HR cants have requests of any kind')
})


 router.route('/Notification')
 .get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
     const reqests = await request_model.findOne({requester:user.id})
     if(reqests.Status!="Pending"){
         res.send("requests that have been approved or denied",reqests)
     }
    }else
    res.send('HR cant be notified of anything')
 })

router.route('/viewAcceptedRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const reqests = await request_model.find({requester:user.id,status:"accepted"})
    if(reqests==null){
        res.send("No accepted Requests")
    }
    else{
        res.send(reqests)
    }
}else
res.send('HR cant have requests of any kind')
})

router.route('/viewPendingRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
        const reqests = await request_model.find({requester:user.id,status:"Pending"})
        if(reqests==null){
            res.send("No Pending Requests")
        }
        else{
            res.send(reqests)
        }
    }else{
        res.send('HR cant have requests of any kind')

    }
})

router.route('/viewRejectedRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(user.role!='HR'){
    const reqests = await request_model.find({requester:user.id,status:"rejected"})
    if(reqests==null){
        res.send("No Rejected Requests")
    }
    else{
        res.send(reqests)
    }
}else
res.send('HR cants have requests of any kind')
})

router.route('/cancelRequests')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    today=new Date()
    // res.send(today.toLocaleDateString())
    if(user.role!='HR'){
        const requests = await request_model.findById(req.body._id)
        if(requests==null){
            res.send("Incorrect request id")
        }
        if(requests.requester==user.id){
            const date = new Date(requests.date)
            if(requests.Status=="Pending"||date>=today){
                const cancelRequests = request_model.findByIdAndDelete(requests._id)
                res.send("Request Canceled")
            }
            else{
                res.send("You cannot cancel this requests")
            }
        }
        else{
            res.send("You cannot cancel another staff members request")
        }
    }else
    res.send('HR cants have requests of any kind')
})
//--------------------------------------------------------------------
// HOD assign instructor ---------------------------------------------

router.route('/assignInstructor')
.post(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        const user1=await staff_model.findOne({id:req.body.id})
        if(user1==null){
            res.send("There is no corresponding instructor")
        }
        if(department.head==user.id){
            var index= null
            var course = null 
            const check= await course_model.findOne({code:req.body.course}) 
            for(var x in department.courses){
                if(department.courses[x].code==check.code){
                    course=department.courses[x]
                    index=x
                }
            }
            if(course==null){
                res.send("No corresponding course")
            }else{
                        course.lecturer.push(user1.id)
                        var coverage = ((course.TA.length+course.lecturer.length)/course.totalSlots)/100
                        course.coverage=coverage
                        await course_model.findOneAndUpdate({code:req.body.course},course)
                        department.courses.splice(x,1)
                        department.courses.push(course)
                        await department_model.findOneAndUpdate({name:user.department}, department)
                        var faculty = await Faculty_model.findOne({name:department.facultyname})
                        for(var x in faculty.departments){
                            if(faculty.departments[x].name==department.name){
                                faculty.departments.splice(x,1)
                                faculty.departments.push(department)
                                await Faculty_model.findOneAndUpdate({name:department.facultyname}, faculty)
                            }

                        }
                        res.send()
            }
        }else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD remove instructor ---------------------------------------------

router.route('/removeInstructor')
.post(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        const user1=await staff_model.findOne({id:req.body.id})
        if(user1==null){
            res.send("There is no corresponding instructor")
        }
        if(department.head==user.id){
            var course = null
            var index = null
            for(var i in department.courses){
                if(department.courses[i].code==req.body.course){
                    course=department.courses[i]
                    index=i
                }
            }
            if(course==null){
                res.send("No corresponding course")
            }else{
                        for(var i in course.lecturer){
                            if(course.lecturer[i]==user1.id){
                                course.lecturer.splice(i,1)
                                var coverage = ((course.TA.length+course.lecturer.length)/course.totalSlots)/100
                                course.coverage=coverage
                                await course_model.findOneAndUpdate({code:req.body.course},course)
                                department.courses.splice(index,1,course)
                                await department_model.findOneAndUpdate({name:user.department}, department)
                                var faculty = await Faculty_model.findOne({name:department.facultyname})
                                for(var x in faculty.departments){
                                    if(faculty.departments[x].name==department.name){
                                        faculty.departments.splice(x,1,department)
                                        await Faculty_model.findOneAndUpdate({name:department.facultyname}, faculty)
                                    }
                                }
                                res.send()
                            }
                        }

                        res.send("This instructor does not teach this course")
                }
        }else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD update instructor ---------------------------------------------

router.route('/updateInstructor')
.put(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        const user1=await staff_model.findOne({id:req.body.oldID})
        const user2=await staff_model.findOne({id:req.body.newID})
        if(user1==null||user2==null){
            res.send("There is no corresponding instructor")
        }
        if(department.head==user.id){
            var index= null
            var course = null 
            const check= await course_model.findOne({code:req.body.course}) 
            for(var x in department.courses){
                if(department.courses[x].code==check.code){
                    course=department.courses[x]
                    index=x
                }
            }
            if(course==null){
                res.send("No corresponding course")
            }else{
                for(var i in course.lecturer){
                    if(course.lecturer[i]==user1.id){
                        course.lecturer.splice(i,1,user2.id)
                        await course_model.findOneAndUpdate({code:req.body.course},course)
                        department.courses.splice(index,1,course)
                        await department_model.findOneAndUpdate({name:user.department}, department)
                        var faculty = await Faculty_model.findOne({name:department.facultyname})
                        for(var x in faculty.departments){
                            if(faculty.departments[x].name==department.name){
                                faculty.departments.splice(x,1,department)
                                await Faculty_model.findOneAndUpdate({name:department.facultyname}, faculty)
                            }
                        }
                        res.send()
                    }
                }
            }
        }else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD view staff ----------------------------------------------------

router.route('/viewStaff')
.get(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            if(req.body.view=="department"){
                info = await staff_model.find({department:user.department})
                res.send(info)
            }
            else{
                if(req.body.view=="course"){
                    var course = null
                    for(var x in department.courses){
                        if(department.courses[x].code==req.body.course){
                            course=department.courses[x]
                        }
                    }
                    if(course==null){
                        res.send("You cannot access this course")
                    }
                    else{
                        const staff = []
                        var TA1= null
                        for(var i in course.TA){
                            TA1 = await staff_model.findOne({id:course.TA[i]})
                            staff.push(TA1)
                        }
                        for(var i in course.lecturer){
                            TA1 = await staff_model.findOne({id:course.lecturer[i]})
                            staff.push(TA1)
                        }
                        res.send(staff)
                    }
                }
                else{
                    res.send("Please enter view")
                }
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD view dayOff ---------------------------------------------------

router.route('/viewDayOff')
.get(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            if(req.body.id){
                const staff= await staff_model.findOne({id:req.body.id})
                if(staff.department==user.department){
                    res.send(staff.dayOff)
                }
                else{
                    res.send("This staff member is not in your department")
                }
            }
            else{
                const result = await staff_model.find({department:user.department},'name id dayOff')
                res.send(result)
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD view change dayOff --------------------------------------------

router.route('/viewChangeDayOff')
.get(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            // const requests = await request_model.find({receiver:user.id,type:"changedayoffRequest"}) 
            const requests = await request_model.find({receiver:user.id}) 
            res.send(requests)
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD accept request ------------------------------------------------

router.route('/acceptRequest')
.post(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            const request = await request_model.findById(req.body._id)
            if(request==null){
                res.send("No corresponding request")
            }
            else{
                var today =  new Date()
                var schedule_attendance=null
                if(today.toDateString().substring(8,10)<"11"){
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
                }
                else{
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
                }
                request.status="accepted"
                await request_model.findByIdAndUpdate(req.body._id,request)
                const sender = await staff_model.findOne({id:request.requester})
                var amount = request.amount
                var schedule = null
                if(request.type=="accidentalLeave"){
                    var missed = sender.leaveBalance - amount
                    sender.leaveBalance = missed
                    await staff_model.findOneAndUpdate({id:request.requester},sender)
                }
                if(request.type=="annualLeave"){
                    var missed = sender.leaveBalance - amount
                    sender.leaveBalance = missed
                    await staff_model.findOneAndUpdate({id:request.requester},sender)
                }
                if(request.type=="sick"){
                    var missed = schedule_attendance.misseddays-amount
                    schedule_attendance.misseddays = missed
                }
                if(request.type=="maternity"){
                    var missed = schedule_attendance.misseddays-amount
                    schedule_attendance.misseddays = missed
                }
                if(request.type=="compensation"){
                    var missed = schedule_attendance.misseddays-amount
                    schedule_attendance.misseddays = missed
                }
                if(today.toDateString().substring(8,10)<"11"){
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(parseInt(today.toLocaleString().substring(0,2),10)-1).toString()},schedule_attendance)
                }
                else{
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,2)},schedule_attendance)
                }
                res.send()
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }   
    catch(error){   
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD reject request ------------------------------------------------

router.route('/rejectRequest')
.post(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            const request = await request_model.findById(req.body._id)
            if(request==null){
                res.send("No corresponding request")
            }
            else{
                request.status="rejected"
                
                if(req.body.response==null){
                    await request_model.findByIdAndUpdate(req.body._id,request)
                    res.send()
                }
                else{
                    request.response=req.body.response
                    await request_model.findByIdAndUpdate(req.body._id,request)
                    res.send()
                }
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
// HOD view course Coverage ------------------------------------------

router.route('/viewCoverage')
.get(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            const coverage = await course_model.find({departmentname:user.department},'code coverage')
            if(coverage==null){
                res.send("No courses in your department")
            }
            else{
                res.send(coverage)
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})

//--------------------------------------------------------------------
// HOD view course Assignments ---------------------------------------
router.route('/viewAssignments')
.get(async(req,res)=>{
    try{
        const user= await staff_model.findById(req.user._id)
        const department = await department_model.findOne({name:user.department})
        if(department.head==user.id){
            var course = null

            for(var i in department.courses){
                if(department.courses[i].code==req.body.course){
                    course=department.courses[i]
                }
            }

            if(course==null){
                res.send("There is no corresponding course")
            }
            else{
                const schedule = await schedule_model.findOne({id:course.code})
                // const slots = await slot_model.find({course:course.code})
                if(schedule==null){
                    res.send("Course does not yet have a schedule")
                }
                else{
                    res.send(schedule)
                }
            }
        }
        else{
            res.send("You are not authorized to access this page")
        }
    }
    catch(error){
        res.status(500).json({error:error.message});
    }
})





router.route('/viewcoverage').get(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {courses}=req.body;
    if(!courses ){
        return res.status(400).json({msg:"Please enter an array of courses"});
    }
   
    if(prof.role=="lecturer"){
        const coursess = req.body.courses;
        const output = [];
        coursess.forEach(async elem => {
            if(elem.coverage==null)
            output.push(0);
            else
            output.push(elem.coverage);
    
});

res.send(output);
    }
    else{
        return res.status(401).json({msg:"unauthorized"});

    }
    })



router.route('/viewslotassignment').get(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {courses}=req.body;
    if(!courses ){
        return res.status(400).json({msg:"Please enter an array of courses"});
    }
   
    if(prof.role=="lecturer"){
        const coursess = req.body.courses;
        var output=[];
        for(var i =0 ; i<courses.length;i++){
            elem=courses[i];
        
        const out =  await schedule_model.findOne({id: elem});
        if(!out)
        return res.status(400).json({msg:"Please course doent have any slots"});
        for (var i = 0; i < 5 ; i++) {
            var j = i+1;
            if(out.saturday[i].isEmpty==false){
            output.push("saturday ["+j+"]  :"+out.saturday[i]);
            }if(out.sunday[i].isEmpty==false){
            output.push("sunday ["+j+"]  :"+out.sunday[i]);
            }if(out.monday[i].isEmpty==false){
            output.push("monday ["+j+"]  :"+out.monday[i]);
            }if(out.tuesday[i].isEmpty==false){
            output.push("tuesday ["+j+"]  :"+out.tuesday[i]);
            }if(out.wednesday[i].isEmpty==false){
            output.push("wednesday ["+j+"]  :"+out.wednesday[i]);
            }if(out.thursday[i].isEmpty==false){
            output.push("thursday ["+j+"]  :"+out.thursday[i]);
            }
            
        }
    };
  

    res.send(output);
    }
    else{
        return res.status(401).json({msg:"unauthorized"});

    }
    }) 



 router.route('/viewdepstaff').get(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    if(prof.role=="lecturer"){
    const dep = prof.department;
    const output = await staff_model.find({department:dep});
    res.send(output);
    }else{
        return res.status(401).json({msg:"unauthorized"});
    }
    })   


router.route('/Assigntoslots').put(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {courses,staff_id,slot_no,day}=req.body;
    if(!courses || !staff_id || !slot_no || !day ){
        return res.status(400).json({msg:"Please enter staff_id,slot_no,day and array of courses"});
    }
    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});
    if(prof.role=="lecturer"){


    const courses = req.body.courses;

    const stafffff =  await staff_model.findOne({id: req.body.staff_id});
    if(!stafffff)
    return res.status(400).json({msg:"Enter a valid staff_id"});


    for(var i =0 ; i<courses.length;i++){
        elem=courses[i];
    

        
        const courseee =  await course_model.findOne({code: elem});
        if(!courseee)
        return res.status(400).json({msg:"Enter valid course codes"});  


        await courseee.TA.push(req.body.staff_id)
        await courseee.save()
        await stafffff.course.push(elem)
        await stafffff.save()

        const course1 =  await course_model.findOne({code: elem});
       
        const ta = course1.TA.length
        const le = course1.lecturer.length
        const ts = course1.totalSlots
        courseee.coverage = ((ta+le)/ts)%100;
        await course1.save() 

    const sta =  await schedule_model.findOne({id: req.body.staff_id});
    const cor =  await schedule_model.findOne({id: elem});

    if(!cor)
    return res.status(400).json({msg:"please enter a valid course(schedule)"});
    if(!sta)
    return res.status(400).json({msg:"please enter a valid staff(schedule)"});

   
    var slot =cor.saturday[slot_no-1];
    var slotsta =sta.saturday[slot_no-1];
    switch(day) {
        case "saturday":
            if(!sta.saturday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.saturday[slot_no-1];
             slotsta =sta.saturday[slot_no-1];     
          break;
        case "sunday":
        
            if(!sta.sunday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.sunday[slot_no-1];
             slotsta =sta.sunday[slot_no-1];
          break;
        case "monday":
            
            if(!sta.monday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.monday[slot_no-1];
             slotsta =sta.monday[slot_no-1];
          break;
        case "tuesday":
           
            if(!sta.tuesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.tuesday[slot_no-1];
             slotsta =sta.tuesday[slot_no-1];
          break;
        case "wednesday":
           
            if(!sta.wednesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.wednesday[slot_no-1];
             slotsta =sta.wednesday[slot_no-1];
            break;
        case "thursday":
            
            if(!sta.thursday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.thursday[slot_no-1];
             slotsta =sta.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      }
      for (var i = 0; i < slot.staff.length; i++) {
          const emt ="";
         // console.log(slot.staff[i]);
        if(slot.staff[i]==emt){
        slot.staff.set(i,staff_id);
        var location = slot.location[i];
        await slotsta.location.push(slot.location[i]);
        await slotsta.type.push(slot.type[i]);
        await slotsta.compensation.push(slot.compensation[i]);
        break;
        }  
    }
    slotsta.isEmpty=false;
    await slotsta.save();
   
    const loc =  await schedule_model.findOne({id: location});

var slotloc =loc.saturday[slot_no-1];
    switch(day) {
        case "saturday":
           
             slotloc =loc.saturday[slot_no-1];
          break;
        case "sunday":
            
             slotloc =loc.sunday[slot_no-1];
          break;
        case "monday":
             
             slotloc =loc.monday[slot_no-1];
          break;
        case "tuesday":
             
             slotloc =loc.tuesday[slot_no-1];
          break;
        case "wednesday":
             
             slotloc =loc.wednesday[slot_no-1];
            break;
        case "thursday":
            
             slotloc =loc.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      };

  for (var i = 0; i < slotloc.staff.length; i++) {
        if(slotloc.staff[i]==""){
        slotloc.staff.set(i, staff_id);
        break;

        }}




        switch(day) {
            case "saturday":
               cor.saturday.splice(slot_no-1,1,slot)
               loc.saturday.splice(slot_no-1,1,slotloc)
               sta.saturday.splice(slot_no-1,1,slotsta)
              break;
            case "sunday":
                cor.sunday.splice(slot_no-1,1,slot)
                loc.sunday.splice(slot_no-1,1,slotloc)
               sta.sunday.splice(slot_no-1,1,slotsta)
              break;
            case "monday":
                cor.monday.splice(slot_no-1,1,slot)
                loc.monday.splice(slot_no-1,1,slotloc)
                sta.monday.splice(slot_no-1,1,slotsta)
              break;
            case "tuesday":
                cor.tuesday.splice(slot_no-1,1,slot)
                loc.tuesday.splice(slot_no-1,1,slotloc)
               sta.tuesday.splice(slot_no-1,1,slotsta)
              break;
            case "wednesday":
                cor.wednesday.splice(slot_no-1,1,slot)
                loc.wednesday.splice(slot_no-1,1,slotloc)
                sta.wednesday.splice(slot_no-1,1,slotsta)
                break;
            case "thursday":
                cor.thursday.splice(slot_no-1,1,slot)
                loc.thursday.splice(slot_no-1,1,slotloc)
                sta.thursday.splice(slot_no-1,1,slotsta)
                 
                    break;        
               }
    

         
           var cor3 =  await schedule_model.findOneAndUpdate({id: elem},cor);
           var loc3 = await schedule_model.findOneAndUpdate({id: location},loc);
           var sta3 = await schedule_model.findOneAndUpdate({id:  req.body.staff_id},sta);
   
           

   
}; 

    
   
    res.send("done");
  
    }else{
        return res.status(401).json({msg:"unauthorized"});
    }
    })   




router.route('/UpdateAssignslots').put(async (req,res)=>{
    const {courses,staff_id,slot_no,day,newstaff_id}=req.body;
    if(!courses || !staff_id || !slot_no || !day || newstaff_id){
        return res.status(400).json({msg:"Please enter staff_id,newstaff_id,slot_no,day and array of courses"});
    }
    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});
    if(prof.role=="lecturer"){
    const courses = req.body.courses;
    const stafffff =  await staff_model.findOne({id: req.body.staff_id});
    if(!stafffff)
    return res.status(400).json({msg:"Enter a valid staff_id"});

    const stafffff1 =  await staff_model.findOne({id: req.body.newstaff_id});
    if(!stafffff1)
    return res.status(400).json({msg:"Enter a valid newstaff_id"});

    for(var i =0 ; i<courses.length;i++){
        elem=courses[i];
    

        const courseee =  await course_model.findOne({code: elem});
        if(!courseee)
        return res.status(400).json({msg:"Enter valid course codes"});  


        for (var i = 0; i < courseee.TA.length; i++) {
            if(courseee.TA[i]== req.body.staff_id){
           await courseee.TA.splice(i,1)
           break;
            }
        }
        for (var i = 0; i < stafffff.course.length; i++) {
            if(stafffff.course[i]== req.body.elem){
           await stafffff.course.splice(i,1)
           break;
            }
        }
        await courseee.TA.push(req.body.newstaff_id)
        await courseee.save()
        await stafffff1.course.push(elem)
        await stafffff1.save()
        

        const sta =  await schedule_model.findOne({id: req.body.newstaff_id});
        const sta1 =  await schedule_model.findOne({id: req.body.staff_id});
        const cor =  await schedule_model.findOne({id: elem});
    
        if(!cor)
        return res.status(400).json({msg:"please enter a valid course(schedule)"});
        if(!sta)
        return res.status(400).json({msg:"please enter a valid newstaff(schedule)"});
        if(!sta)
        return res.status(400).json({msg:"please enter a valid staff(schedule)"});
    
       
        var slot =cor.saturday[slot_no-1];
        var slotsta =sta.saturday[slot_no-1];
        var slotsta1 =sta1.saturday[slot_no-1];
        switch(day) {
            case "saturday":
                if(!sta.saturday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.saturday[slot_no-1];
                 slotsta =sta.saturday[slot_no-1];  
                 slotsta1 =sta1.saturday[slot_no-1];   
              break;
            case "sunday":
            
                if(!sta.sunday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.sunday[slot_no-1];
                 slotsta =sta.sunday[slot_no-1];
                 slotsta1 =sta1.sunday[slot_no-1];
              break;
            case "monday":
                
                if(!sta.monday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.monday[slot_no-1];
                 slotsta =sta.monday[slot_no-1];
                 slotsta1 =sta1.monday[slot_no-1];
              break;
            case "tuesday":
               
                if(!sta.tuesday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.tuesday[slot_no-1];
                 slotsta =sta.tuesday[slot_no-1];
                 slotsta1 =sta1.tuesday[slot_no-1];
              break;
            case "wednesday":
               
                if(!sta.wednesday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.wednesday[slot_no-1];
                 slotsta =sta.wednesday[slot_no-1];
                 slotsta1 =sta1.wednesday[slot_no-1];
                break;
            case "thursday":
                
                if(!sta.thursday[slot_no-1].isEmpty)
                return res.status(400).json({msg:"this staff member is busy in this slot"});
                 slot =cor.thursday[slot_no-1];
                 slotsta =sta.thursday[slot_no-1];
                 slotsta1 =sta1.thursday[slot_no-1];
                    break;        
            default:
                return res.status(400).json({msg:"Enter a valid day/no upper case"});
          }
          var f = false;
          for (var i = 0; i < slot.staff.length; i++) {
            if(slot.staff[i]==staff_id){
             f=true;   
            slot.staff.set(i, newstaff_id);
            var location = slot.location[i];
            await slotsta.location.push(slot.location[i]);
            await slotsta.type.push(slot.type[i]);
            await slotsta.compensation.push(slot.compensation[i]);
            break;
            }  
        }
        if(!f)
        return res.status(400).json({msg:"This staffmem isnt assigned to this this course"});

        slotsta.isEmpty=false;

        for (var i = 0; i < slotsta1.staff.length; i++) {
            await slotsta1.location.splice(i,1)
         //   await slotsta1.staff.splice(i,1)
            await slotsta1.type.splice(i,1)
            await slotsta1.compensation.splice(i,1) 
        }
        slotsta1.isEmpty=true;
        slotsta1.save();

        const loc =  await schedule_model.findOne({id: location});


        var slotloc =loc.saturday[slot_no-1];
        switch(day) {
            case "saturday":
               
                 slotloc =loc.saturday[slot_no-1];
              break;
            case "sunday":
                
                 slotloc =loc.sunday[slot_no-1];
              break;
            case "monday":
                 
                 slotloc =loc.monday[slot_no-1];
              break;
            case "tuesday":
                 
                 slotloc =loc.tuesday[slot_no-1];
              break;
            case "wednesday":
                 
                 slotloc =loc.wednesday[slot_no-1];
                break;
            case "thursday":
                
                 slotloc =loc.thursday[slot_no-1];
                    break;        
            default:
                return res.status(400).json({msg:"Enter a valid day/no upper case"});
          };


          for (var i = 0; i < slotloc.staff.length; i++) {
            if(slotloc.staff[i]==staff_id){
            slotloc.staff.set(i, newstaff_id);
            break;
            }}

    
       
        switch(day) {
            case "saturday":
               cor.saturday.splice(slot_no-1,1,slot)
               sta1.saturday.splice(slot_no-1,1,slotsta1)
               sta.saturday.splice(slot_no-1,1,slotsta)
               loc.saturday.splice(slot_no-1,1,slotloc)
              break;
            case "sunday":
                cor.sunday.splice(slot_no-1,1,slot)
                sta1.sunday.splice(slot_no-1,1,slotsta1)
               sta.sunday.splice(slot_no-1,1,slotsta)
               loc.sunday.splice(slot_no-1,1,slotloc)
              break;
            case "monday":
                cor.monday.splice(slot_no-1,1,slot)
                sta1.monday.splice(slot_no-1,1,slotsta1)
                sta.monday.splice(slot_no-1,1,slotsta)
                loc.monday.splice(slot_no-1,1,slotloc)
              break;
            case "tuesday":
                cor.tuesday.splice(slot_no-1,1,slot)
                sta1.thrusday.splice(slot_no-1,1,slotsta1)
               sta.tuesday.splice(slot_no-1,1,slotsta)
               loc.tuesday.splice(slot_no-1,1,slotloc)
              break;
            case "wednesday":
                cor.wednesday.splice(slot_no-1,1,slot)
                sta1.wednesday.splice(slot_no-1,1,slotsta1)
                sta.wednesday.splice(slot_no-1,1,slotsta)
                loc.wednesday.splice(slot_no-1,1,slotloc)
                break;
            case "thursday":
                cor.thursday.splice(slot_no-1,1,slot)
                sta1.thursday.splice(slot_no-1,1,slotsta1)
                sta.thursday.splice(slot_no-1,1,slotsta)
                loc.thursday.splice(slot_no-1,1,slotloc)
                 
                    break;        
               }
    
             
               var cor3 =  await schedule_model.findOneAndUpdate({id: elem},cor);
              
               var sta3 = await schedule_model.findOneAndUpdate({id:  req.body.newstaff_id},sta);

               var sta31 = await schedule_model.findOneAndUpdate({id:  req.body.staff_id},sta1);

               var loc3 = await schedule_model.findOneAndUpdate({id: location},loc);

       
               
}; 
    
       
        res.send("done");
      
        }else{
            return res.status(401).json({msg:"unauthorized"});
        }
        })   



    

router.route('/DeleteAssignslots').put(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {courses,staff_id,slot_no,day}=req.body;
    if(!courses || !staff_id || !slot_no || !day ){
        return res.status(400).json({msg:"Please enter staff_id,slot_no,day and array of courses"});
    }
    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});
    if(prof.role=="lecturer"){
    const courses = req.body.courses;

    const stafffff =  await staff_model.findOne({id: req.body.staff_id});
    if(!stafffff)
    return res.status(400).json({msg:"Enter a valid staff_id"});

    for(var i =0 ; i<courses.length;i++){
        elem=courses[i];
    

        const courseee =  await course_model.findOne({code: elem});
        if(!courseee)
        return res.status(400).json({msg:"Enter valid course codes"}); 


        for (var i = 0; i < courseee.TA.length; i++) {
            if(courseee.TA[i]== req.body.staff_id){
           await courseee.TA.splice(i,1)
           
            }
        }
        
        for (var i = 0; i < stafffff.course.length; i++) {
            if(stafffff.course[i]== req.body.elem){
           await stafffff.course.splice(i,1)
           
            }
        }

        await courseee.save()
        await stafffff.save()


        const course1 =  await course_model.findOne({code: elem});
        const ta = course1.TA.length
        const le = course1.lecturer.length
        const ts = course1.totalSlots
        courseee.coverage = ((ta+le)/ts)%100;
        await course1.save() 


        const sta =  await schedule_model.findOne({id: req.body.staff_id});
        const cor =  await schedule_model.findOne({id: elem});
    
        if(!cor)
        return res.status(400).json({msg:"please enter a valid course(schedule)"});
        if(!sta)
        return res.status(400).json({msg:"please enter a valid staff(schedule)"});
    
       
        var slot =cor.saturday[slot_no-1];
        var slotsta =sta.saturday[slot_no-1];
        switch(day) {
            case "saturday":
                
                 slot =cor.saturday[slot_no-1];
                 slotsta =sta.saturday[slot_no-1];     
              break;
            case "sunday":
            
                
                 slot =cor.sunday[slot_no-1];
                 slotsta =sta.sunday[slot_no-1];
              break;
            case "monday":
                
               
                 slot =cor.monday[slot_no-1];
                 slotsta =sta.monday[slot_no-1];
              break;
            case "tuesday":
               
                 slot =cor.tuesday[slot_no-1];
                 slotsta =sta.tuesday[slot_no-1];
              break;
            case "wednesday":
               
                 slot =cor.wednesday[slot_no-1];
                 slotsta =sta.wednesday[slot_no-1];
                break;
            case "thursday":
                
                 slot =cor.thursday[slot_no-1];
                 slotsta =sta.thursday[slot_no-1];
                    break;        
            default:
                return res.status(400).json({msg:"Enter a valid day/no upper case"});
          }
          var f = false;
        for (var i = 0; i < slot.staff.length; i++) {
            if(slot.staff[i]==staff_id){
                f=true;
            var location = slot.location[i];  
             const emt ="";   
            slot.staff.set(i, emt);
        break;
    }  
        }
    if(!f)
    return res.status(400).json({msg:"This staff mem isnt assigned to this this course"});
       // console.log(location)
        for (var i = 0; i < slotsta.staff.length; i++) {
         await slotsta.location.splice(i,1)
       // await slotsta.staff.splice(i,1)
        await slotsta.type.splice(i,1)
        await slotsta.compensation.splice(i,1) 
             
        }
        slotsta.isEmpty=true;
    

        const loc =  await schedule_model.findOne({id: location});
        if(!loc)
        return res.status(400).json({msg:"please enter a valid loc(schedule)"});

      var slotloc =loc.saturday[slot_no-1];
    switch(day) {
        case "saturday":
           
             slotloc =loc.saturday[slot_no-1];
          break;
        case "sunday":
            
             slotloc =loc.sunday[slot_no-1];
          break;
        case "monday":
             
             slotloc =loc.monday[slot_no-1];
          break;
        case "tuesday":
             
             slotloc =loc.tuesday[slot_no-1];
          break;
        case "wednesday":
             
             slotloc =loc.wednesday[slot_no-1];
            break;
        case "thursday":
            
             slotloc =loc.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      };

      for (var i = 0; i < slotloc.staff.length; i++) {
        if(slotloc.staff[i]==staff_id){
            const emt = "";
        slotloc.staff.set(i, emt);
        break;
        }}
       
switch(day) {
    case "saturday":
       cor.saturday.splice(slot_no-1,1,slot)
       loc.saturday.splice(slot_no-1,1,slotloc)
       sta.saturday.splice(slot_no-1,1,slotsta)
      break;
    case "sunday":
        cor.sunday.splice(slot_no-1,1,slot)
        loc.sunday.splice(slot_no-1,1,slotloc)
       sta.sunday.splice(slot_no-1,1,slotsta)
      break;
    case "monday":
        cor.monday.splice(slot_no-1,1,slot)
        loc.monday.splice(slot_no-1,1,slotloc)
        sta.monday.splice(slot_no-1,1,slotsta)
      break;
    case "tuesday":
        cor.tuesday.splice(slot_no-1,1,slot)
        loc.tuesday.splice(slot_no-1,1,slotloc)
       sta.tuesday.splice(slot_no-1,1,slotsta)
      break;
    case "wednesday":
        cor.wednesday.splice(slot_no-1,1,slot)
        loc.wednesday.splice(slot_no-1,1,slotloc)
        sta.wednesday.splice(slot_no-1,1,slotsta)
        break;
    case "thursday":
        cor.thursday.splice(slot_no-1,1,slot)
        loc.thursday.splice(slot_no-1,1,slotloc)
        sta.thursday.splice(slot_no-1,1,slotsta)
         
            break;        
       }

    
             
               var cor3 =  await schedule_model.findOneAndUpdate({id: elem},cor);      
               var loc3 = await schedule_model.findOneAndUpdate({id: location},loc);
               var sta3 = await schedule_model.findOneAndUpdate({id:  req.body.staff_id},sta);
       
               
}; 

    
    res.send("done");
  
    }else{
        return res.status(401).json({msg:"unauthorized"});
    }
    })   









 router.route('/removecoursemem').delete  (async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {courses,staff_id}=req.body;
    if(!courses || !staff_id ){
        return res.status(400).json({msg:"Please enter staff_id and array of courses"});
    }
    if(prof.role=="lecturer"){
    const courses = req.body.courses;
    for(var i =0 ; i<courses.length;i++){
        elem=courses[i];

        
     const c = await course_model.findOne({code : elem})
     const staffmem = await  staff_model.findOne({id : staff_id})
     const dep = await department_model.findOne({name:c.departmentname});

    if(!c)
    return res.status(400).json({msg:"please enter a valid course codes"});
    if(!staffmem)
    return res.status(400).json({msg:"please enter a valid staff id"});

   // console.log(staffmem.role,staffmem.id,c.code)
     if(staffmem.role == "TA")
     {
        for (var i = 0; i < c.TA.length; i++) {
            if(c.TA[i]== req.body.staff_id){
           await c.TA.splice(i,1)
           
            }
        }
        for (var i = 0; i < staffmem.course.length; i++) {
            if(staffmem.course[i]== elem){
           await staffmem.course.splice(i,1)
          
            }
        }
    }
     else{if(staffmem.role == "lecturer"){
        return res.status(401).json({msg:"unauthorized"});
     }else{
        return res.status(400).json({msg:"please enter a valid staff member"});

     }
     
    }

    await staffmem.save();
    await c.save();

    

    for (var i = 0; i < dep.courses.length; i++) {
        if(dep.courses[i].code== elem){
       await dep.courses.splice(i,1,c)
      
        }
    }

    var dep1 = await department_model.findOneAndUpdate({name:c.departmentname},dep);

    };
    
     res.send("done");
  
    }else{
        return res.status(401).json({msg:"unauthorized"});
    }



    })   




router.route('/Assigncoordinator').put(async (req,res)=>{
    const prof= await staff_model.findById(req.user._id);
    const {course_code,staff_id}=req.body;
    if(!course_code || !staff_id )
        return res.status(400).json({msg:"Please enter staff_id and a course_code"});
    
    if(prof.role=="lecturer"){
     const staff = await staff_model.findOne({id: req.body.staff_id});
    //const rem = await staff.findAndRemove({course : {$ne : req.body.course}});// not sure if he can have more than one course 
    const course = await course_model.findOne({code:  req.body.course_code});

    const dep = await department_model.findOne({name:course.departmentname});

    if(!course)
    return res.status(400).json({msg:"please enter a valid course code"});
    if(!staff)
    return res.status(400).json({msg:"please enter a valid staff id"});

    course.courseCoordinator=staff.name;
    await course.save();
    res.send("done");

    for (var i = 0; i < dep.courses.length; i++) {
        if(dep.courses[i].code== elem){
       await dep.courses.splice(i,1,course)
      
        }
    }

    var dep1 = await department_model.findOneAndUpdate({name:course.departmentname},dep);
 
  
    }else{
        return res.status(401).json({msg:"unauthorized"});
    }
    })   




 router.route('/viewslotlinkingreq').get(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {course_code}=req.body;
    if(!course_code){
        return res.status(400).json({msg:"Please enter a course_code"});
    }
    const course = await course_model.findOne({code : req.body.course_code })
    if(!course)
    return res.status(400).json({msg:"Please enter a valid course"}); 

  
    if(cord.id==course.courseCoordinator){
       
        console.log(cord.id,t);
    const output = await request_model.findOne({type:t, receiver: cord.id  });
    if(!output)
    return res.status(400).json({msg:"No slot linking requests"});
    res.send(output);
    }
    else{
        return res.status(401).json({msg:"unauthorized"});

    }
    })


    

router.route('/acceptslotlinkingreq').put(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {slotlinking_id,course_code}=req.body;
    if(!course_code){
        return res.status(400).json({msg:"Please enter a course_code"});
    }
    if(!slotlinking_id){
        return res.status(400).json({msg:"Please enter a slotlinking_id"});
    }
    const course = await course_model.findOne({code : req.body.course_code })
    if(cord.id==course.courseCoordinator){
    const slotreq = await request_model.findOne({id : req.body.slotlinking_id });
    if(!slotreq)
    return res.status(400).json({msg:"please enter a valid slotlinking_id"});

    const day = slotreq.newDay;
    const slot_no = slotreq.slot;
    const staff= slotreq.requester;


    const sta =  await schedule_model.findOne({id: staff});
    const cor =  await schedule_model.findOne({id: course_code});

    if(!cor)
    return res.status(400).json({msg:"please enter a valid course(schedule)"});
    if(!sta)
    return res.status(400).json({msg:"please enter a valid staff(schedule)"});
    

   
    var slot =cor.saturday[slot_no-1];
    var slotsta =sta.saturday[slot_no-1];
    switch(day) {
        case "saturday":
            if(!sta.saturday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.saturday[slot_no-1];
             slotsta =sta.saturday[slot_no-1];     
          break;
        case "sunday":
        
            if(!sta.sunday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.sunday[slot_no-1];
             slotsta =sta.sunday[slot_no-1];
          break;
        case "monday":
            
            if(!sta.monday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.monday[slot_no-1];
             slotsta =sta.monday[slot_no-1];
          break;
        case "tuesday":
           
            if(!sta.tuesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.tuesday[slot_no-1];
             slotsta =sta.tuesday[slot_no-1];
          break;
        case "wednesday":
           
            if(!sta.wednesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.wednesday[slot_no-1];
             slotsta =sta.wednesday[slot_no-1];
            break;
        case "thrusday":
            
            if(!sta.thrusday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this staff member is busy in this slot"});
             slot =cor.thrusday[slot_no-1];
             slotsta =sta.thrusday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      }
    for (var i = 0; i < slot.staff.length; i++) {
        if(slot.staff[i]==""){
        slot.staff.set(i, staff_id);
        var location = slot.location[i];
        await slotsta.location.push(slot.location[i]);
        await slotsta.type.push(slot.type[i]);
        await slotsta.staff.push(staff_id);
        await slotsta.compensation.push(slot.compensation[i]);
        break;
        }  
    }
    
    slotsta.isEmpty=false;
    await slotsta.save();

    slotreq.status="Accepted";
    await slotreq.save();

    const loc =  await schedule_model.findOne({id:  location});

    var slotloc =loc.saturday[slot_no-1];
    switch(day) {
        case "saturday":
           
             slotloc =loc.saturday[slot_no-1];
          break;
        case "sunday":
            
             slotloc =loc.sunday[slot_no-1];
          break;
        case "monday":
             
             slotloc =loc.monday[slot_no-1];
          break;
        case "tuesday":
             
             slotloc =loc.tuesday[slot_no-1];
          break;
        case "wednesday":
             
             slotloc =loc.wednesday[slot_no-1];
            break;
        case "thursday":
            
             slotloc =loc.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      };

      
  for (var i = 0; i < slotloc.staff.length; i++) {
    if(slotloc.staff[i]==""){
    slotloc.staff.set(i, staff_id);
    break;

    }}

   
switch(day) {
    case "saturday":
       cor.saturday.splice(slot_no-1,1,slot)
       loc.saturday.splice(slot_no-1,1,slotloc)
       sta.saturday.splice(slot_no-1,1,slotsta)
      break;
    case "sunday":
        cor.sunday.splice(slot_no-1,1,slot)
        loc.sunday.splice(slot_no-1,1,slotloc)
       sta.sunday.splice(slot_no-1,1,slotsta)
      break;
    case "monday":
        cor.monday.splice(slot_no-1,1,slot)
        loc.monday.splice(slot_no-1,1,slotloc)
        sta.monday.splice(slot_no-1,1,slotsta)
      break;
    case "tuesday":
        cor.tuesday.splice(slot_no-1,1,slot)
        loc.tuesday.splice(slot_no-1,1,slotloc)
       sta.tuesday.splice(slot_no-1,1,slotsta)
      break;
    case "wednesday":
        cor.wednesday.splice(slot_no-1,1,slot)
        loc.wednesday.splice(slot_no-1,1,slotloc)
        sta.wednesday.splice(slot_no-1,1,slotsta)
        break;
    case "thursday":
        cor.thursday.splice(slot_no-1,1,slot)
        loc.thursday.splice(slot_no-1,1,slotloc)
        sta.thursday.splice(slot_no-1,1,slotsta)
         
            break;        
       }

         
           var cor3 =  await schedule_model.findOneAndUpdate({id: req.body.course_code},cor);
          
           var sta3 = await schedule_model.findOneAndUpdate({id: staff},sta);
   
           

         
           var loc3 = await schedule_model.findOneAndUpdate({id: location},loc);


    res.send("done");
    }
    else{
        return res.status(401).json({msg:"unauthorized"});

    }
    })    




router.route('/Rejectslotlinkingreq').put(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {slotlinking_id,course_code}=req.body;
    if(!course_code){
        return res.status(400).json({msg:"Please enter a course_code"});
    }
    const course = await course_model.findOne({code : req.body.course_code })
    if(cord.id==course.courseCoordinator){   
    const slotreq = await request_model.findOne({id : req.body.slotlinking_id });
    if(!slotreq)
    return res.status(400).json({msg:"please enter a valid slotlinking_id"});

    slotreq.status="Rejected";
    await slotreq.save();
    res.send("done");
   
    }
    else{
        return res.status(401).json({msg:"unauthorized"});

    }
    })    


      




router.route('/Addslot').post(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {course_code,slot_no,day,location,type,compensation}=req.body;
    if(!course_code || !slot_no || !day || !location ||!type || !compensation){
        return res.status(400).json({msg:"Please enter location,type,compensation(true,false),slot_no,day and course_code"});
    }

    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});
    if(type != "tut" && type !="lab")
    return res.status(400).json({msg:"The type is eaither tut or lab"});

    const course =  await course_model.findOne({code: req.body.course_code});
    if(!course)
    return res.status(400).json({msg:"Please enter a valid course"}); 
    
    if(cord.id == course.courseCoordinator){
 
        const cor =  await schedule_model.findOne({id:  req.body.course_code});
        const loc =  await schedule_model.findOne({id:  req.body.location});

        if(!cor)
        return res.status(400).json({msg:"Please enter a valid course(schedule)"}); 

        if(!loc)
    return res.status(400).json({msg:"Please enter a valid location(schedule)"}); 
      
    
        var slot =cor.saturday[slot_no-1];
        var slotloc =loc.saturday[slot_no-1];
    switch(day) {
        case "saturday":
            if(!loc.saturday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.saturday[slot_no-1];
             slotloc =loc.saturday[slot_no-1];
          break;
        case "sunday":
            if(!loc.sunday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.sunday[slot_no-1];
             slotloc =loc.sunday[slot_no-1];
          break;
        case "monday":
            if(!loc.monday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.monday[slot_no-1];
             slotloc =loc.monday[slot_no-1];
          break;
        case "tuesday":
            if(!loc.tuesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.tuesday[slot_no-1];
             slotloc =loc.tuesday[slot_no-1];
          break;
        case "wednesday":
            if(!loc.wednesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.wednesday[slot_no-1];
             slotloc =loc.wednesday[slot_no-1];
            break;
        case "thursday":
            if(!loc.thursday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
             slot =cor.thursday[slot_no-1];
             slotloc =loc.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      }

      const em = "";
      await slot.location.push(location);
      await slot.type.push(type);
      await slot.staff.push(em);
      await slot.compensation.push(compensation);

      
      await slotloc.type.push(type);
      await slotloc.staff.push(em);
      await slotloc.compensation.push(compensation);


    slot.isEmpty=false;
    slotloc.isEmpty=false;

    await slot.save();
    await slotloc.save();
    
    
    switch(day) {
        case "saturday":
           cor.saturday.splice(slot_no-1,1,slot)
           
           loc.saturday.splice(slot_no-1,1,slotloc)
          break;
        case "sunday":
            cor.sunday.splice(slot_no-1,1,slot)
           
           loc.sunday.splice(slot_no-1,1,slotloc)
          break;
        case "monday":
            cor.monday.splice(slot_no-1,1,slot)
            
            loc.monday.splice(slot_no-1,1,slotloc)
          break;
        case "tuesday":
            cor.tuesday.splice(slot_no-1,1,slot)
          
           loc.tuesday.splice(slot_no-1,1,slotloc)
          break;
        case "wednesday":
            cor.wednesday.splice(slot_no-1,1,slot)
        
            loc.wednesday.splice(slot_no-1,1,slotloc)
            break;
        case "thursday":
            cor.thursday.splice(slot_no-1,1,slot)
           
            loc.thursday.splice(slot_no-1,1,slotloc)
             
                break;        
           }

           console.log(slotloc.isEmpty)
          
           var cor3 =  await schedule_model.findOneAndUpdate({id: req.body.course_code},cor);
          
           var loc3 = await schedule_model.findOneAndUpdate({id: req.body.location},loc);
   
           
    res.send("done");
    
    }
    else{
        return res.status(401).json({msg:"unauthorized"}); 

    }
    })  ;



router.route('/updateslot').put(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {course_code,slot_no,day,location,newlocation,newtype,compensation}=req.body;
    if(!course_code || !slot_no || !day || !location ||  !(newlocation||newtype||compensation)){
        return res.status(400).json({msg:"Please enter location,slot_no,day,course_code and the new location,compensation or/and type"});
    }

    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});

    if(location==newlocation)
    return res.status(400).json({msg:"The old and new locations have the same code"});

    if(newtype){
    if(req.body.newtype != "tut" && req.body.newtype != "lab" )
    return res.status(400).json({msg:"the type is either lab or tut"});}

    if(newlocation){
    const nlo = await Location_model.findOne({code:req.body.newlocation});
    if(!nlo)
    return res.status(400).json({msg:"Please enter a valid location"}); 
    }
    const lo = await Location_model.findOne({code:req.body.location});
    if(!lo)
    return res.status(400).json({msg:"Please enter a valid location"}); 

    const course =  await course_model.findOne({code: req.body.course_code});
    if(!course)
    return res.status(400).json({msg:"Please enter a valid course"}); 
    
    if(cord.id == course.courseCoordinator){
 
        const loc = await schedule_model.findOne({id: req.body.newlocation});
        const cor =  await schedule_model.findOne({id:  req.body.course_code});
        const loc1 = await schedule_model.findOne({id: req.body.location});
        if(newlocation){
            if(!loc)
            return res.status(400).json({msg:"Please enter a valid new location"}); 
        var slotloc =loc.saturday[slot_no-1];
        var slotloc1 =loc1.saturday[slot_no-1];
        }
        var slot =cor.saturday[slot_no-1];
       
    switch(day) {
        case "saturday":
            if(newlocation){
            if(!loc.saturday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.saturday[slot_no-1];
            slotloc1 =loc1.saturday[slot_no-1];
            }
             slot =cor.saturday[slot_no-1];
            
          break;
        case "sunday":
            if(newlocation){
            if(!loc.sunday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.sunday[slot_no-1];
            slotloc1 =loc1.sunday[slot_no-1];
        
        }
             slot =cor.sunday[slot_no-1];
             
          break;
        case "monday":
            if(newlocation){
            if(!loc.monday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.monday[slot_no-1];
            slotloc1 =loc1.monday[slot_no-1];}
             slot =cor.monday[slot_no-1];
            
          break;
        case "tuesday":
            if(newlocation){
            if(!loc.tuesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.tuesday[slot_no-1];
            slotloc1 =loc1.tuesday[slot_no-1];}
             slot =cor.tuesday[slot_no-1];
             
          break;
        case "wednesday":
            if(newlocation){
            if(!loc.wednesday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.wednesday[slot_no-1];
            slotloc1 =loc1.wednesday[slot_no-1];}
             slot =cor.wednesday[slot_no-1];
            
            break;
        case "thursday":
            if(newlocation){
            if(!loc.thursday[slot_no-1].isEmpty)
            return res.status(400).json({msg:"this location is used in this slot"});
            slotloc =loc.thursday[slot_no-1];
            slotloc1 =loc1.thursday[slot_no-1];
            }
             slot =cor.thursday[slot_no-1];
             
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      }
    for (var i = 0; i < slot.location.length; i++) {
        if(slot.location[i]==req.body.location){
        if(newlocation)
        slot.location.set(i, req.body.newlocation);
        if(newtype)
        slot.type.set(i, req.body.newtype);
        if(compensation)
        slot.compensation.set(i, req.body.compensation);
        break; }
    }

    if(newlocation)
    { for (var i = 0; i < slotloc.location.length; i++) { 
        //slotloc.location.set(i, req.body.newlocation);
        const em = "";

        await slotloc.staff.push(em);
      
        if(compensation)
        await slotloc.compensation.push(compensation);
        if(newtype)
        await slotloc.type.push(type);
        break; }
    }
    if(newlocation)
    { for (var i = 0; i < slotloc1.location.length; i++) {
        
       // await slotloc1.location.splice(i,1)
        await slotloc1.staff.splice(i,1)
        await slotloc1.type.splice(i,1)
        await slotloc1.compensation.splice(i,1) 
    }}

    if(newlocation)
    {
    slotloc.isEmpty=false;
    slotloc1.isEmpty=true;
    }




    switch(day) {
        case "saturday":
           cor.saturday.splice(slot_no-1,1,slot)
           if(newlocation){
           loc.saturday.splice(slot_no-1,1,slotloc)
           loc1.saturday.splice(slot_no-1,1,slotloc1)
           }break;
        case "sunday":
            cor.sunday.splice(slot_no-1,1,slot)
           if(newlocation){
           loc.sunday.splice(slot_no-1,1,slotloc)
           loc1.sunday.splice(slot_no-1,1,slotloc1)
           }break;
        case "monday":
            cor.monday.splice(slot_no-1,1,slot)
            if(newlocation){
            loc.monday.splice(slot_no-1,1,slotloc)
            loc1.monday.splice(slot_no-1,1,slotloc1)
            }break;
        case "tuesday":
            cor.tuesday.splice(slot_no-1,1,slot)
           if(newlocation){
           loc.tuesday.splice(slot_no-1,1,slotloc)
           loc1.tuesday.splice(slot_no-1,1,slotloc1)
           }break;
        case "wednesday":
            cor.wednesday.splice(slot_no-1,1,slot)
            if(newlocation){
            loc.wednesday.splice(slot_no-1,1,slotloc)
            loc1.wednesday.splice(slot_no-1,1,slotloc1)
            }break;
        case "thursday":
            cor.thursday.splice(slot_no-1,1,slot)
            if(newlocation){
            loc.thursday.splice(slot_no-1,1,slotloc)
            loc1.thursday.splice(slot_no-1,1,slotloc1)
            }
                break;        
           }

          // mongoose.set('useFindAndModify', false);
           var cor3 =  await schedule_model.findOneAndUpdate({id: req.body.course_code},cor);
           if(newlocation){
           var loc3 = await schedule_model.findOneAndUpdate({id: req.body.newlocation},loc);
           var loc13 = await schedule_model.findOneAndUpdate({id: req.body.location},loc1);
           }
           
   
    res.send("done");
    
    }
    else{
        return res.status(401).json({msg:"unauthorized"}); 

    }
    })   









router.route('/deleteslot').delete(async (req,res)=>{
    const cord= await staff_model.findById(req.user._id);
    const {course_code,slot_no,day,location}=req.body;
    if(!course_code || !slot_no || !day || !location ){
        return res.status(400).json({msg:"Please enter location,slot_no,day and course_code"});
    }

    if(req.body.slot_no>5)
    return res.status(400).json({msg:"Enter a valid slot_no"});

    const course =  await course_model.findOne({code: req.body.course_code});
    if(!course)
    return res.status(400).json({msg:"Please enter a valid course"}); 
    
    if(cord.id == course.courseCoordinator){
 
        const cor =  await schedule_model.findOne({id:  req.body.course_code});
        const loc =  await schedule_model.findOne({id:  req.body.location});

        if(!loc)
    return res.status(400).json({msg:"Please enter a valid location"}); 
       
        var slot =cor.saturday[slot_no-1];
        var slotloc =loc.saturday[slot_no-1];
    switch(day) {
        case "saturday":
             slot =cor.saturday[slot_no-1];
             slotloc =loc.saturday[slot_no-1];
          break;
        case "sunday":
             slot =cor.sunday[slot_no-1];
             slotloc =loc.sunday[slot_no-1];
          break;
        case "monday":
             slot =cor.monday[slot_no-1];
             slotloc =loc.monday[slot_no-1];
          break;
        case "tuesday":
             slot =cor.tuesday[slot_no-1];
             slotloc =loc.tuesday[slot_no-1];
          break;
        case "wednesday":
             slot =cor.wednesday[slot_no-1];
             slotloc =loc.wednesday[slot_no-1];
            break;
        case "thursday":
             slot =cor.thursday[slot_no-1];
             slotloc =loc.thursday[slot_no-1];
                break;        
        default:
            return res.status(400).json({msg:"Enter a valid day/no upper case"});
      }
    for (var i = 0; i < slot.location.length; i++) {
        if(slot.location[i]==location){
        await slot.location.splice(i,1)
        await slot.staff.splice(i,1)
        await slot.type.splice(i,1)
        await slot.compensation.splice(i,1)
        
        }
    }
    for (var i = 0; i < slotloc.location.length; i++) {
        //await slotloc.location.splice(i,1)
        await slotloc.staff.splice(i,1)
        await slotloc.type.splice(i,1)
        await slotloc.compensation.splice(i,1)
         
    }

   
    slotloc.isEmpty=true;
    
    
    switch(day) {
        case "saturday":
           cor.saturday.splice(slot_no-1,1,slot)
           
           loc.saturday.splice(slot_no-1,1,slotloc)
          break;
        case "sunday":
            cor.sunday.splice(slot_no-1,1,slot)
           
           loc.sunday.splice(slot_no-1,1,slotloc)
          break;
        case "monday":
            cor.monday.splice(slot_no-1,1,slot)
            
            loc.monday.splice(slot_no-1,1,slotloc)
          break;
        case "tuesday":
            cor.tuesday.splice(slot_no-1,1,slot)
          
           loc.tuesday.splice(slot_no-1,1,slotloc)
          break;
        case "wednesday":
            cor.wednesday.splice(slot_no-1,1,slot)
        
            loc.wednesday.splice(slot_no-1,1,slotloc)
            break;
        case "thursday":
            cor.thursday.splice(slot_no-1,1,slot)
           
            loc.thursday.splice(slot_no-1,1,slotloc)
             
                break;        
           }

          // mongoose.set('useFindAndModify', false);
           var cor3 =  await schedule_model.findOneAndUpdate({id: req.body.course_code},cor);
          
           var loc3 = await schedule_model.findOneAndUpdate({id: req.body.location},loc);
   
           
    res.send("done");
    
    }
    else{
        return res.status(401).json({msg:"unauthorized"}); 

    }
    })    
          



          




