const express = require('express');
const mongoose = require('mongoose')
// const staff_model=require('../models/staff')

const {internalRequestSchema} = require('../models/requests.js') 
const request_model = mongoose.model('IRS', internalRequestSchema)

const {scheduleSchema} = require('../models/scheduling.js') 
const schedule_model=mongoose.model("Schedule",scheduleSchema)

// Department Schema and model ----------------------------------------
const {departmentSchema, find, findOne} = require('../models/academics.js')
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
            res.send(newLocation);
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
            res.send(Updatedlocation);
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
            const deletedlocation = await Location_model.findByIdAndDelete(existinglocation._id);
            res.send(deletedlocation);
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
            res.send(newFaculty);
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
            res.send(Updatedfaculty);
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
            res.send(deletedfaculty);
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
            res.send(newDepartment)
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
            res.send(UpdatedDepartment)
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
            res.send(deleteddepartment);
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
    const {Departmentname,Code,Coverage}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentname||!Code){
                return res.status(400).json({msg:"Please enter a valid course code and department name"});
            }
            const existingcourse = await course_model.findOne({code:Code});
            if(existingcourse){
                return res.status(400).json({msg:"This Course exists already"});
            }
            const existingdepartment= await department_model.findOne({name:Departmentname})
            if(!existingdepartment){
                return res.status(400).json({msg:"This Department doesn't exist"});
            }
            let AddCoverage = Coverage;
            if(!Coverage){
                AddCoverage = 0;
            }
            const newCourse = new course_model({code:Code,departmentname:Departmentname,coverage:AddCoverage})
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname})
            await existingfaculty.departments.pull(existingdepartment);
            await newCourse.save()
            await existingdepartment.courses.push(newCourse)
            await existingdepartment.save()

            await existingfaculty.departments.push(existingdepartment);
            await existingfaculty.save();
            res.send(newCourse)
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
    const {Departmentname,Code,newDepartmentname,newCode,Coverage}=req.body;
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
            let UpdateCode = newCode, UpdateCoverage = Coverage, UpdateDepartment = newDepartmentname;
            if(!Coverage){
                UpdateCoverage = existingcourse1.coverage;
            }
            if(!newDepartmentname){
                UpdateDepartment = Departmentname;
            }
            if(!newCode){
                UpdateCode = Code;
            }
            else if(newCode != Code){
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
                coverage:UpdateCoverage},{new:true})
            await UpdatedCourse.save()
            await existingdepartment2.courses.push(UpdatedCourse)
            await existingdepartment2.save()
            const existingfaculty2 = await Faculty_model.findOne({name:existingdepartment2.facultyname});
            await existingfaculty2.departments.push(existingdepartment2);
            await existingfaculty2.save();
            res.send(UpdatedCourse)
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
            const deletedCourse = await course_model.findByIdAndDelete(existingcourse._id);
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname});
            await existingfaculty.departments.pull(existingdepartment);
            await existingfaculty.save();
            await existingdepartment.courses.pull(existingcourse);
            await existingdepartment.save();
            await existingfaculty.departments.push(existingdepartment);
            await existingfaculty.save();
            res.send(deletedCourse);
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})
//------------------------------------------------------------------
// Add a staff member ----------------------------------------------
router.route('/AddStaff')
.post(async (req,res)=>{
    const {name,email,salary,officelocation,role,dayoff,department,gender}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(role == "HR"){
                if(dayoff != "Sat"){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
            }
            if(!gender && gender != "male" && gender != "female"){
                return res.status(400).json({msg:"Please enter a valid gender"});
            }
            if(!department){
                return res.status(400).json({msg:"Please enter a valid department"});
            }
            if(dayoff != "Sun" && dayoff != "Mon" && dayoff != "Tues" && dayoff != "Wed" && dayoff != "Thur" && dayoff != "Sat"){
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
            department:department,gender:gender});
            await newStaff.save();
            const newCapacity = existinglocation.capacity - 1;
            const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation._id,{capacity:newCapacity},{new:true});
            await Updatedlocation.save();
            res.send(newStaff);
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
                if(dayoff != "Sat" && (existingstaff.role == "HR" || role == "HR")){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
                else if(dayoff != "Sat" && dayoff != "Sun" && dayoff != "Mon" && dayoff != "Tues" && dayoff != "Wed" && dayoff != "Thur"){
                    return res.status(400).json({msg:"Please enter a valid dayoff other than the weekend"});
                }
            }
            else{
                Updatedayoff = existingstaff.dayOff;
            }
            if(department){
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
            res.send(UpdatedStaff);
        
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
            let existingdepartment = await department_model.findOne({name:existingstaff.department});
            const existingfaculty = await Faculty_model.findOne({name:existingdepartment.facultyname});
            await existingfaculty.departments.pull(existingdepartment);    
            await existingfaculty.save();
            let currentcourse = existingstaff.course.shift();
            while(currentcourse){
                const existingcourse = await course_model.findOne({code:currentcourse});
                await existingdepartment.courses.pull(existingcourse); 
                await existingdepartment.save();
                await existingcourse.Lecturer.pull(existingstaff.id);
                await existingcourse.TA.pull(existingstaff.id);
                await existingcourse.save();
                await existingdepartment.courses.push(existingcourse);
                await existingdepartment.save();
                currentcourse = existingstaff.course.shift();
                
            }
            await existingfaculty.departments.push(existingdepartment);
            await existingfaculty.save();
            const deletedstaff = await staff_model.findByIdAndDelete(existingstaff._id);
            res.send(deletedstaff);
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
            let newsalary = existingstaff.salary,missedhours = existingstaff.missedHours - 3,misseddays = existingstaff.misseddays;
            while(misseddays != 0){
                newsalary = newsalary/60;
                misseddays = misseddays -1;
            }
            while(missedhours > 1){
                newsalary = newsalary/180;
                missedhours = missedhours - 1;
            }
            missedhours = (missedhours*100) * 60;
            while(missedhours != 0){
                newsalary = (newsalary/180) * 60;
                missedhours = missedhours - 1;
            }
            if(promotion){
                newsalary = newsalary + promotion
            }
            const Updatedstaff = await staff_model.findByIdAndUpdate(existingstaff._id,{salary:newsalary},{new:true});
            await Updatedstaff.save();
            res.send(Updatedstaff);
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
            if(today.toTimeString.substring(0,2)>"19"){
                res.send("You cannot add a sign in after 7PM")
            }
            if(today.toTimeString.substring(0,2)<"07"){
                res.send("You cannot add a sign in before 7AM")
            }
            const user= await staff_model.findOne({id:id})
            var attendance= await attendance_model.findOne({"id":id,"date":today.toLocaleString().substring(0,10)})
            var schedule_attendance = null
            if(today.toDateString().substring(8,10)<"11"){
                schedule_attendance = await scheduleAttendance_model.findOne({"id":id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))})
            }
            else{
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,10)})
            }
            if(schedule_attendance==null){
                if(today.toDateString().substring(8,10)<"11"){
                    schedule_attendance = new scheduleAttendance_model({
                        id:user.id,
                        month:(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))
                    })
                    await schedule_attendance.save()
                }
                else{
                    schedule_attendance = new scheduleAttendance_model({
                        id:user.id,
                        month:today.toLocaleString().substring(0,10)
                    })
                    await schedule_attendance.save()
                }
            }
        
            if(attendance==null){
                attendance = new attendance_model({
                    id:user.id,
                    date:today.toLocaleString().substring(0,10),
                    day:today.toUTCString().substring(0,3)
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
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
            }
            else{
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
            }
            res.send(attendance)
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
router.route('/signOut')
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
            if(today.toTimeString.substring(0,2)>"19"){
                res.send("You cannot add a sign in after 7PM")
            }
            if(today.toTimeString.substring(0,2)<"07"){
                res.send("You cannot add a sign out before 7AM")
            }
            const user= await staff_model.findOne({id:id})
            const attendance= await attendance_model.findOne({"id":user.id,
                "date":today.toLocaleString().substring(0,10)})
            var schedule_attendance = null
            if(today.toDateString().substring(8,10)<"11"){
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))})
            }
            else{
                schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,10)})
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
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
                }
                else{
                    await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
                }
                res.send(attendance)
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
router.route('/ViewAttendance')
.get(async (req,res)=>{
    const {id}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await staff_model.findOne({id:id});
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            const staffAttendance = await scheduleAttendance_model.findOne({id:id});
            res.send(staffAttendance.days);
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
            const existingattendance = await scheduleAttendance_model.find({missedHours:{$gte:1},misseddays:{$gte:1}});
            let allstaff;
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
// router.route('/login')
// .post(async (req,res)=>{
//     try {
//         const result = await staff_model.findOne({email:req.body.email})
//         if(!result){
//             return res.send('You need to sign up first')
//         }
//         const correctPassword= await bcrypt.compare(req.body.password, result.password)
//         if(correctPassword){
//             const token=jwt.sign({_id:result._id, role:result.role}, 
//                 process.env.TOKEN_SECRET)
//             res.header('token',token).send(token)
//         }
//         else{
//             res.send('Incorrect Password')
//         }
//     }     
//     catch (error) {
//         res.status(500).json({error:error.message});
//     }
// })
//--------------------------------------------------------------------
// logout ------------------------------------------------------------
router.route('/logout')
.post(async(req,res)=>{
    
    const user=await staff_model.findById(req.user._id);
    user.token = null
    await staff_model.findOneAndUpdate({_id:req.user._id},user)
    res.send("loged out")
    
})
//--------------------------------------------------------------------
// view profile ------------------------------------------------------

router.route('/viewProfile')
.get(async(req,res)=>{
    const result= await staff_model.findById(req.user._id)
    res.send(result)
})
//--------------------------------------------------------------------
// update profile ----------------------------------------------------

router.route('/updateProfile')
.post(async(req,res)=>{
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
    await user.save()
    res.send(user)

})
//--------------------------------------------------------------------
// sign In -----------------------------------------------------------

router.route('/signIn')
.post(async(req,res)=>{
    var today =  new Date()
    // res.send(today.toTimeString())
    if(today.toTimeString.substring(0,2)>"19"){
        res.send("You cannot sign in after 7PM")
    }
    if(today.toTimeString.substring(0,2)<"07"){
        today.setHours(7)
        today.setMinutes(0)
    }
    const user= await staff_model.findById(req.user._id)
    var attendance= await attendance_model.findOne({"id":user.id,"date":today.toLocaleString().substring(0,10)})
    var schedule_attendance = null
    if(today.toDateString().substring(8,10)<"11"){
        schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))})
    }
    else{
        schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,10)})
    }
    if(schedule_attendance==null){
        if(today.toDateString().substring(8,10)<"11"){
            schedule_attendance = new scheduleAttendance_model({
                id:user.id,
                month:(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))
            })
            await schedule_attendance.save()
        }
        else{
            schedule_attendance = new scheduleAttendance_model({
                id:user.id,
                month:today.toLocaleString().substring(0,10)
            })
            await schedule_attendance.save()
        }
    }

    if(attendance==null){
        attendance = new attendance_model({
            id:user.id,
            date:today.toLocaleString().substring(0,10),
            day:today.toUTCString().substring(0,3)
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
        await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
    }
    else{
        await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
    }
    res.send(attendance)

})
//--------------------------------------------------------------------
// sign Out ----------------------------------------------------------

router.route('/signOut')
.post(async(req,res)=>{
    
    var today =  new Date()
    if(today.toTimeString.substring(0,2)>"19"){
        today.setHours(19)
        today.setMinutes(0)
    }
    if(today.toTimeString.substring(0,2)<"07"){
        today.setHours(7)
        today.setMinutes(0)
    }
    const user= await staff_model.findById(req.user._id)
    const attendance= await attendance_model.findOne({"id":user.id,
        "date":today.toLocaleString().substring(0,10)})
    // res.send(attendance.signIn.length.toString())
    var schedule_attendance = null
    if(today.toDateString().substring(8,10)<"11"){
        schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))})
    }
    else{
        schedule_attendance = await scheduleAttendance_model.findOne({"id":user.id,"month":today.toLocaleString().substring(0,10)})
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
            await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
        }
        else{
            await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
        }
        res.send(attendance)
    }
})
//--------------------------------------------------------------------
// reset Password ----------------------------------------------------

router.route('/resetPassword')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const correctPassword= await bcrypt.compare(req.body.oldPassword, user.password)
    if(correctPassword){
        const salt= await bcrypt.genSalt(10)
        req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt) 
        user.password=req.body.newPassword
        await user.save()
        res.send("Password Changed");
    }else{
        res.send("wrong insertion")
    }

})

//--------------------------------------------------------------------
// view Schedule -----------------------------------------------------
router.route('/viewschedule')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const Schedule= await schedule_model.findOne({id:user.id})
    res.send(Schedule)
})

router.route('/sendReplacmentReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const reciver=await staff_model.findOne({role:req.body.rec})
    if(reciver!=null&&user.department==reciver.department&&reciver.role=='TA'){
        const newreqest = await new request_model({type:req.body.type,requester:user.id,reciever:reciver.id,reason:req.body.reason})
        await newreqest.save()
        res.send(newreqest)
    }else{
        res.send("pls insert a valid recipient")
    }
})

router.route('/viewReplaceReq')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const myrequests= await request_model.find({type:req.body.type,requester:user.id})
    res.send(myrequests)
})

router.route('/changeDayOffReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const hod = await staff_model.findOne({role:'HOD',department:user.department})
    if(hod!=null){
        const newreqest = await new request_model({type:req.body.type,reason:req.body.reason,requester:user.id,reciever:hod.id,newDay:req.body.newDay})
        await newreqest.save()
        res.send(newreqest)
    }else{
        res.send('no head of department was found')
    }
})//all other send reqests of diffrent types such as leaves are copy paste from this with if conditionals if needed and a new dbs


router.route('/leaveReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const hod = await staff_model.findOne({role:'HOD',department:user.department})
    if(hod!=null){
    if(req.body.type=="CompensationLeave"&&req.body.reason!=null&&hod!=null){
        const newreqest = await new request_model({type:req.body.type,reason:req.body.reason,requester:user.id,reciever:hod.id})
        await newreqest.save()
        res.send(newreqest)
    }else{if(req.body.type=="CompensationLeave"&&req.body.reason==null){
        const newreqest = await new request_model({type:req.body.type,reason:req.body.reason,requester:user.id,reciever:hod.id})
        await newreqest.save()
        res.send('CompensationLeave need a reason pls state yours')
    }else{
        const newreqest = await new request_model({type:req.body.type,reason:req.body.reason,requester:user.id,reciever:hod.id})
        await newreqest.save()
        res.send(newreqest)
    }}
}else{
    res.send('no head of department was found')
}  
})
 router.route('/Notification')
 .get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
     const reqests = await request_model.findOne({requester:user.id})
     if(reqests.Status!="pending"){
         res.send("requests that have been approved or denied",reqests)
     }
 })
router.route('/viewAcceptedRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const reqests = await request_model.find({requester:user.id,status:"accepted"})
    if(reqests==null){
        res.send("No accepted Requests")
    }
    else{
        res.send(reqests)
    }
})
router.route('/viewPendingRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const reqests = await request_model.find({requester:user.id,status:"pending"})
    if(reqests==null){
        res.send("No Pending Requests")
    }
    else{
        res.send(reqests)
    }
})
router.route('/viewRejectedRequests')
.get(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const reqests = await request_model.find({requester:user.id,status:"rejected"})
    if(reqests==null){
        res.send("No Rejected Requests")
    }
    else{
        res.send(reqests)
    }
})
router.route('/cancelRequests')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const requests = await request_model.findOne({id:req.body._id})
    if(requests==null){
        res.send("Incorrect request id")
    }
    if(requests.requester==user.id){
        if(requests.Status=="pending"||requests.Date>=Date.now()){
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
})
//--------------------------------------------------------------------
// HOD assign instructor ---------------------------------------------

router.route('/assignInstructor')
.post(async(req,res)=>{
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
            // if(req.body.role=="TA"){
            //     course.TA.push(user1.id)
            //     res.send(course)
            //     await course_model.findOneAndUpdate({code:req.body.course},course)
            //     department.courses.splice(index,1)
            //     department.courses.push(course)
            //     await department_model.findOneAndUpdate({name:user.department}, department)
            //     var faculty = await Faculty_model.findOne({name:department.facultyname})
            //     for(var x in faculty.departments){
            //         if(faculty.departments[x].name==department.name){
            //             faculty.departments.splice(x,1)
            //             faculty.departments.push(department)
            //             await Faculty_model.findOneAndUpdate({name:department.facultyname}, faculty)
            //         }

            //     }

            //     res.send(course)
            // }
            // else{
                // if(req.body.role=="lecturer"){
                    course.lecturer.push(user1.id)
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
                    res.send(course)
                // }
                // else{
                    // res.send("Wrong instructor role choose lecturer or TA")
                // }
            // }
        }
    }else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD remove instructor ---------------------------------------------

router.route('/removeInstructor')
.post(async(req,res)=>{
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
            // if(user1.role=="TA"){
            //     for(var i in course.TA){
            //         if(course.TA[i]==user1.id){
            //             course.TA.splice(i,1)
            //             await course_model.findOneAndUpdate({code:req.body.course},course)
            //             department.courses.splice(index,1)
            //             department.courses.push(course)
            //             await department_model.findOneAndUpdate({name:user.department}, department)
            //             var faculty = await Faculty_model.findOne({name:department.facultyname})
            //             for(var x in faculty.departments){
            //                 if(faculty.departments[x].name==department.name){
            //                     faculty.departments.splice(x,1)
            //                     faculty.departments.push(department)
            //                     await Faculty_model.findOneAndUpdate({name:department.facultyname}, faculty)
            //                 }
        
            //             }
            //             res.send(course)

            //         }
            //     }
            //     res.send("This instructor does not teach this course")
            // }
            // else{
                // if(req.body.role=="lecturer"){
                    for(var i in course.lecturer){
                        if(course.lecturer[i]==user1.id){
                            course.lecturer.splice(i,1)
                            await course_model.findOneAndUpdate({code:req.body.course},course)
                            department.courses.splice(index,1)
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
                            res.send(course)
                        }
                    }

                    res.send("This instructor does not teach this course")
                // }
                // else{
                //     res.send("This staff member cannot teach this course")
                // }
            }
        // }
    }else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD view staff ----------------------------------------------------

router.route('/viewStaff')
.get(async(req,res)=>{
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
})
//--------------------------------------------------------------------
// HOD view dayOff ---------------------------------------------------

router.route('/viewDayOff')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        if(req.body.id!=null){
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
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD view change dayOff --------------------------------------------

router.route('/viewChangeDayOff')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const requests = await request_model.find({department:user.department})
        res.send(requests)
    }
    else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD accept request ------------------------------------------------

router.route('/acceptRequest')
.post(async(req,res)=>{
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
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
            }
            else{
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
            }
            request.status="accepted"
            await request_model.findByIdAndUpdate(req.body._id,request)
            const sender = await staff_model.findOne({id:request.requester})
            var amount = request.amount
            var schedule = null
            if(request.type=="accidental"){
                var missed = sender.leaveBalance - amount
                sender.leaveBalance = missed
                await sender.save()
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
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":(((today.toDateString().substring(0,2))-1).toString()+today.toLocaleString().substring(2,10))},schedule_attendance)
            }
            else{
                await scheduleAttendance_model.findOneAndUpdate({"id":user.id,"month":today.toLocaleString().substring(0,10)},schedule_attendance)
            }
            res.send(request)
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD reject request ------------------------------------------------

router.route('/rejectRequest')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const request = await request_model.findById(req.body._id)
        if(request==null){
            res.send("No corresponding request")
        }
        else{
            request.status="rejected"
            await request_model.findByIdAndUpdate(req.body._id,request)
            res.send(request)
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})
//--------------------------------------------------------------------
// HOD view course Coverage ------------------------------------------

router.route('/viewCoverage')
.get(async(req,res)=>{
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
})

//--------------------------------------------------------------------
// HOD view course Assignments ---------------------------------------
router.route('/viewAssignments')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const course = null

        for(var i=0;i<i<department.courses.length;i++){
            if(department.courses[i].code==req.body.course){
                course=department.courses[i]
            }
        }

        if(course==null){
            res.send("There is no corresponding course")
        }
        else{
            const schedule = await schedule_model.findOne({id:course.code})
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
})
module.exports=router;
