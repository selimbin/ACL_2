const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')
const faculty_model=require('../models/academics')

const {internalRequestSchema} = require('../models/requests.js') 
const request_model = mongoose.model('IRS', internalRequestSchema)

const {scheduleSchema} = require('../models/scheduling.js') 
const schedule_model=mongoose.model("Schedule",scheduleSchema)

// Department Schema and model ----------------------------------------
const {departmentSchema} = require('../models/academics.js')
const department_model = mongoose.model('Department', departmentSchema)
// Course Schema and model ----------------------------------------
const {courseSchema} = require('../models/academics.js') 
const course_model = mongoose.model('Course', courseSchema)

const faculties = mongoose.model('Faculty');
// Faculty Schema and model ----------------------------------------
const {facultySchema} = require('../models/academics.js') 
const Faculty_model = mongoose.model('Faculty', facultySchema)
// Location Schema and model ----------------------------------------
const {locationSchema} = require('../models/staff.js') 
const Location_model = mongoose.model('Location', locationSchema)
// Staff Schema and model ----------------------------------------
const {staffSchema} = require('../models/staff.js') 
const Staff_model = mongoose.model('Staff', staffSchema)
// Staffcount Schema and model --------------------------------------
const {staffcountSchema} = require('../models/staff.js') 
const Staffcount_model = mongoose.model('Staffcount', staffcountSchema)
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
.post(async (req, res)=>{
    const {Code,newCode,Building,Type,Capacity}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Code){
                return res.status(400).json({msg:"Please enter a valid Location code"});
            }
            const existinglocation1 = await Location_model.findOne({code:Code});
            const existinglocation2 = await Location_model.findOne({code:newCode});
            if(!existinglocation1){
                return res.status(400).json({msg:"This Location doesn't exist"});
            }
            if(existinglocation2){
                return res.status(400).json({msg:"The new Location id already exists"});
            }
            let Updatebuilding = Building, Updatetype = Type, Updatecapacity = Capacity, UpdateCode = newCode;
            if(!Building){
                Updatebuilding = existinglocation1.building;
            }
            if(!Type){
                Updatetype = existinglocation1.type;
            }
            else if(existinglocation1.type == "office" && Type != "office"){
                if(existinglocation1 != 0){
                    return res.status(400).json({msg:"The office needs to be empty before it can be changed!"});
                }
            }
            if(!Capacity){
                Updatecapacity = existinglocation1.capacity;
            }
            if(!newCode){
                UpdateCode = Code;
            }
            let stafflocation = await Staff_model.findOne({officeLocation:existinglocation1.code})
            let updatedstaff;
            while(stafflocation){
                if(Updatecapacity == 0){
                    updatedstaff = await Staff_model.findByIdAndUpdate(stafflocation._id,{officeLocation:""},{new:true});
                    await updatedstaff.save();
                    stafflocation = await Staff_model.findOne({officeLocation:existinglocation1.code});
                }
                else{
                    Updatecapacity = Updatecapacity - 1;
                    updatedstaff = await Staff_model.findByIdAndUpdate(stafflocation._id,{officeLocation:newCode},{new:true});
                    await updatedstaff.save();
                    stafflocation = await Staff_model.findOne({officeLocation:existinglocation1.code});
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
.post(async (req, res)=>{
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
            let stafflocation = await Staff_model.findOne({officeLocation:existinglocation.code})
            let updatedstaff;
            while(stafflocation){
                updatedstaff = await Staff_model.findByIdAndUpdate(stafflocation._id,{officeLocation:""},{new:true});
                await updatedstaff.save();
                stafflocation = await Staff_model.findOne({officeLocation:existinglocation.code});
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
.post(async (req, res)=>{
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
.post(async (req, res)=>{
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
            await department_model.deleteMany({facultyname:Name});
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
            if(Head){
                const existingstaff = await Staff_model.findOne({id:Head,department:DepartmentName})
                if(!existingstaff){
                    return res.status(400).json({msg:"Please assign a valid HOD"});
                }
            }
            const newDepartment = new department_model({facultyname:FacultyName,name:DepartmentName,head:Head})
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
.post(async (req, res)=>{
    const {FacultyName,DepartmentName,newDepartmentName,newFacultyname,newHead}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!DepartmentName || !FacultyName){
                return res.status(400).json({msg:"Please enter a valid Department and Faculty names"});
            }
            if(!newDepartmentName && !newFacultyname){
                return res.status(400).json({msg:"Please enter a valid new department name or faculty name"});
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
            if(!newDepartmentName){
                UpdateDepartment = DepartmentName;
            }
            if(!newFacultyname){
                UpdateFaculty = FacultyName;
            }
            if(newHead){
                const existingstaff = await Staff_model.findOne({id:newHead,department:newDepartmentName})
                if(!existingstaff){
                    return res.status(400).json({msg:"Please assign a valid HOD"});
                }
            }
            else{
                UpdateHead = existingdepartment1.head;
            }
            const prevfaculty = await Faculty_model.findOne({name:FacultyName})
            await prevfaculty.departments.pull(existingdepartment1);
            await prevfaculty.save()

            const newfaculty = await Faculty_model.findOne({name:UpdateFaculty})
            const UpdatedDepartment = await department_model.findByIdAndUpdate(existingdepartment1._id,{facultyname:UpdateFaculty,name:UpdateDepartment,head:UpdateHead},{new:true})
            await UpdatedDepartment.save()
            if(!newfaculty){
                return res.status(400).json({msg:"The entered Faculty doesn't exist"});
            }
            await newfaculty.departments.push(UpdatedDepartment)
            await newfaculty.save()
            let coursedepartment = await course_model.findOne({departmentname:DepartmentName})
            let updatedcourse;
            while(coursedepartment){
                updatedcourse = await course_model.findByIdAndUpdate(coursedepartment._id,{departmentname:UpdateDepartment},{new:true});
                await updatedcourse.save();
                coursedepartment = await course_model.findOne({departmentname:DepartmentName})
            }
            let staffindepartment = await Staff_model.findOne({department:Name});
            while(staffindepartment){
                const updatestaffindepartment = await Staff_model.findByIdAndUpdate(staffindepartment._id,{department:UpdateDepartment},{new:true});
                await updatestaffindepartment.save();
                staffindepartment = await Staff_model.findOne({department:Name});   
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
.post(async (req, res)=>{
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
            await course_model.deleteMany({departmentname:Name});
            const existingstaff = await course_model.findOne({id:existingdepartment.head});
            const updatedstaff = await course_model.findByIdAndUpdate(existingstaff._id,{role:""},{new:true});
            await updatedstaff.save();
            const deleteddepartment = await department_model.findByIdAndDelete(existingdepartment._id);
            await existingfaculty.departments.pull(existingdepartment);
            await existingfaculty.save();
            let staffindepartment = await Staff_model.findOne({department:Name});
            while(staffindepartment){
                const updatestaffindepartment = await Staff_model.findByIdAndUpdate(staffindepartment._id,{department:""},{new:true});
                await updatestaffindepartment.save();
                staffindepartment = await Staff_model.findOne({department:Name});   
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
    const {Departmentname,Code,Coverage,Coordinator}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentname||!Code){
                return res.status(400).json({msg:"Please enter a valid course code and department name"});
            }
            const existingcourse = await course_model.findOne({code:Code});
            if(existingcourse){
                return res.status(400).json({msg:"This Course exists already"});
            }
            const newCourse = new course_model({code:Code,departmentname:Departmentname,coverage:Coverage,courseCoordinator:Coordinator})
            await newCourse.save()
            const existingdepartment= await department_model.findOne({name:Departmentname})
            if(!existingdepartment){
                return res.status(400).json({msg:"This Department doesn't exist"});
            }
            await existingdepartment.courses.push(newCourse)
            await existingdepartment.save()
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
.post(async (req, res)=>{
    const {Departmentname,Code,newDepartmentname,newCode,Coverage,Coordinator}=req.body;
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
            let UpdateCode = newCode, UpdateCoverage = Coverage, UpdateCoordinator = Coordinator, UpdateDepartment = newDepartmentname;
            if(!newCode){
                UpdateCode = Code;
            }
            if(!UpdateCoverage){
                UpdateCoverage = existingcourse1.coverage;
            }
            if(!UpdateCoordinator){
                UpdateCoordinator = existingcourse1.courseCoordinator;
            }
            if(!UpdateDepartment){
                UpdateDepartment = Departmentname;
            }
            const UpdatedCourse = await course_model.findByIdAndUpdate(existingcourse1._id,{code:UpdateCode,departmentname:UpdateDepartment,
                coverage:UpdateCoverage,courseCoordinator:UpdateCoordinator},{new:true})
            await UpdatedCourse.save()
            await existingdepartment1.courses.pull(existingcourse1)
            const existingdepartment2 = await department_model.findOne({name:UpdateDepartment});
            await existingdepartment2.courses.push(UpdatedCourse)

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
.post(async (req, res)=>{
    const {Departmentame,Code}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!Departmentame || !Code){
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
            let deletedcourseLect = await existingcourse.lecturer.shift();
            while(deletedcourseLect){
                const existingstaff = await course_model.findById(deletedcourseLect._id);
                await existingstaff.course.pull(Code);
                await existingstaff.save();
                deletedcourseLect = await existingcourse.lecturer.shift();
            }
            let deletedcourseTA = await existingcourse.TA.shift();
            while(deletedcourseTA){
                const existingstaff = await course_model.findById(deletedcourseTA._id);
                await existingstaff.course.pull(Code);
                await existingstaff.save();
                deletedcourseTA = await existingcourse.TA.shift();
            }
            const deletedCourse = await course_model.findByIdAndDelete(existingcourse._id);
            await existingdepartment.courses.pull(existingcourse);
            await existingdepartment.save();
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
    const {name,email,salary,officelocation,role,dayoff,department}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(role == "HR"){
                if(dayoff != "Saturday"){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
            }
            if(!department){
                return res.status(400).json({msg:"Please enter a valid department"});
            }
            if(dayoff != "Sunday" && dayoff != "Monday" && dayoff != "Tuesday" && dayoff != "Wednesday" && dayoff != "Thuresday"){
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
            const existingstaff = await Staff_model.findOne({email:email})
            if(existingstaff){
                return res.status(400).json({msg:"This email is already taken"});
            }
            const password ="123456";
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
            const newStaff = new Staff_model({id:id,name:name,email:email,password:password,role:role,salary:salary,dayOff:dayoff,officeLocation:officelocation,
            misseddays:0,missedHours:0,department:department});
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
.post(async (req,res)=>{
    const {id,name,email,officelocation,role,dayoff,department}=req.body;
    try {
        if (req.user.role  == "HR") {
            let Updatename = name,Updateemail = email,Updaterole = role,Updatelocation = officelocation,Updatedayoff = dayoff,Updatedepartment = department;
            const existingstaff = await Staff_model.findOne({id:id})
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            if(dayoff){
                if(dayoff != "Saturday" && (existingstaff.role == "HR" || role == "HR")){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
                else if(dayoff != "Saturday" && dayoff != "Sunday" && dayoff != "Monday" && dayoff != "Tuesday" && dayoff != "Wednesday" && dayoff != "Thuresday"){
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
                const existingstaff = await Staff_model.findOne({email:email})
                if(existingstaff){
                    return res.status(400).json({msg:"This email is already taken"});
                }
                var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if(!email.match(mailformat)){
                    return res.status(400).json({msg:"This email is invalid"});
                }
            }
            else{
                Updateemail = email;
            }
            if(!name){
                Updatename = existingstaff.name;
            }
            if(!role){
                Updaterole = existingstaff.role;
            }
            const UpdatedStaff = await Staff_model.findByIdAndUpdate(existingstaff._id,{name:Updatename,email:Updateemail,role:Updaterole,
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
router.route('/Deletetaff')
.post(async (req,res)=>{
    const {id}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await Staff_model.findOne({id:id});
            const existinglocation = await Location_model.findOne({Code:existingstaff.officeLocation})
            const Updatedcapacity = existinglocation.capacity + 1;
            const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation._id,{capacity:Updatedcapacity});
            Updatedlocation.save();
            const newStaffcount = await Staffcount_model.findOne({id:"1"});
            if(existingstaff.role != "HR"){
                const Updatedcount = newStaffcount.Academic - 1;
                const UpdatedStaffcount = await Staffcount_model.findByIdAndUpdate(newStaffcount._id,{Academic:Updatedcount},{new:true});
                await UpdatedStaffcount.save();
            }
            else{
                const Updatedcount = newStaffcount.HR - 1;
                const UpdatedStaffcount = await Staffcount_model.findByIdAndUpdate(newStaffcount._id,{HR:Updatedcount},{new:true});
                await UpdatedStaffcount.save();
            }
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            let currentcourse = existingstaff.course.shift();
            while(currentcourse){
                const existingcourse = await course_model.findOne({code:currentcourse});
                await existingcourse.Lecturer.pull(existingstaff);
                await existingcourse.TA.pull(existingstaff);
                await existingcourse.save();
                currentcourse = existingstaff.course.shift();
            }
            const deletedstaff = await Staff_model.findByIdAndDelete(existingstaff._id);
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
.post(async (req,res)=>{
    const {id,promotion}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await Staff_model.findOne({id:id});
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
            const Updatedstaff = await Staff_model.findByIdAndUpdate(existingstaff._id,{salary:newsalary},{new:true});
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
// Add Sign in/out record --------------------------------------------
router.route('/AddSigninAndOut')
.post(async (req,res)=>{
    const {id,Date,Timein,Timeout}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!id){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            if(!Date){
                return res.status(400).json({msg:"Please enter a valid Date"});
            }
            if(!Timein){
                return res.status(400).json({msg:"Please enter a valid Timein"});
            }
            if(!Timeout){
                return res.status(400).json({msg:"Please enter a valid Timeout"});
            }
            const existingstaff = await Staff_model.findOne({id:id});
            if(!existingstaff){
                return res.status(400).json({msg:"Please enter a valid id"});
            }
            if(existingstaff._id == req.header._id){
                return res.status(400).json({msg:"Can't add sign in/out for yourself!"});
            }
            const attendanceRecord = await attendance_model.findOne({date:Date});
            if(!attendanceRecord){
                return res.status(400).json({msg:"No record exists for such a date"});
            }
            let newTimein = Date + "T" + Timein + "Z";
            let newTimeout = Date + "T" + Timeout + "Z";
            newTimein = new Date('newTimein');
            newTimeout = new Date('newTimeout');
            const now = new Date();
            if(newTimein > now || newTimeout > now){
                return res.status(400).json({msg:"You cant access a date that is in the future!"});
            }
            await attendanceRecord.signIn.push(newTimein);
            await attendanceRecord.signOut.push(newTimeout);
            await attendanceReccord.save();
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
.post(async (req,res)=>{
    const {id}=req.body;
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await Staff_model.findOne({id:id});
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
.post(async (req,res)=>{
    try {
        if (req.user.role  == "HR") {
            const existingstaff = await Staff_model.find({missedHours:{$gte:1},misseddays:{$gte:1}});
            res.send(existingstaff)
        } else {
            return res.status(401).json({msg:"unauthorized"});
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
//--------------------------------------------------------------------
router.route('/login')
.post(async (req,res)=>{
    try {
        const result = await Staff_model.findOne({email:req.body.email})
        if(!result){
            return res.send('You need to sign up first')
        }
        const correctPassword= await bcrypt.compare(req.body.password, result.password)
        if(correctPassword){
            const token=jwt.sign({_id:result._id, role:result.role}, 
                process.env.TOKEN_SECRET)
            res.header('token',token).send(token)
        }
        else{
            res.send('Incorrect Password')
        }
    }     
    catch (error) {
        res.status(500).json({error:error.message});
    }
})
router.route('/logout')
.post(async(req,res)=>{
    
    const user=await staff_model.findById(req.user._id);
    user.token = null
    await staff_model.findOneAndUpdate({_id:req.user._id},user)
    res.send("loged out")
    
})
router.route('/viewProfile')
.get(async(req,res)=>{
    const result= await staff_model.findById(req.user._id)
    res.send(result)
})
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

router.route('/signIn')
.post(async(req,res)=>{
    const today =  new Date()
    const user= await staff_model.findById(req.user._id)
    // res.send(today.toUTCString())
    const attendance= await attendance_model.findOne({"id":user.id,"date":today.toUTCString().substring(5,16)})
    // res.send()
    if(attendance==null){
        // res.send(attendance)
        // res.send("here")
        attendance1 = new attendance_model({
            id:user.id,
            date:today.toUTCString().substring(5,16),
            day:today.toUTCString().substring(0,3)
        })
        attendance1.signIn.push(today)
        await attendance1.save()
        res.send(attendance1)

    }else{
        if(attendance.signIn.length!=attendance.signOut.length){
            attendance.signIn.pop()
            attendance.signIn.push(today)
        }
        else{
            attendance.signIn.push(today)
        }
        await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toUTCString().substring(5,16)},attendance)

        res.send(attendance)
    }
})
router.route('/signOut')
.post(async(req,res)=>{
    const today =  new Date()
    const user= await staff_model.findById(req.user._id)
    const attendance= await attendance_model.findOne({"id":user.id,
        "date":today.toUTCString().substring(5,16)})
    if(!attendance){
        res.send("You did not sign in today")
    }else{
        // res.send(attendance.signIn.length.toString())
        if(attendance.signIn.length!=(attendance.signOut.length+1)){
            res.send("You did not sign in")
        }
        else{
            attendance.signOut.push(today)
        }
        await attendance_model.findOneAndUpdate({"id":user.id,"date":today.toUTCString().substring(5,16)},attendance)
        
        res.send(attendance)
    }
})

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
router.route('/viewschedule')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const Schedule= await schedule_model.findOne({"Schedule":user.id})
    res.send(Schedule)
})
/*router.route('/viewReplaceReq')
.get(async(req,res)=>{
    const Schedule= await scheduleSchema.findById(req.user._id)
    res.send(Schedule)
})*/
router.route('/sendReplacmentReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    if(await staff_model.findOne(req.body.reciever)){
    const newreqest = await new IRS_model({type:req.body.type,requester:user,reciever:req.body.reciever,reason:req.body.reason,status:"Pending"})
    res.send(newreqest)
    }else{
        res.send("pls insert a valid recipient")
    }
})
Router.ROUTE('/changeDayOffReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const hod = await staff_model.findOne(user.department.head)
    const newreqest = await new IRS_model({type:req.body.type,requester:user,reciever:hod,reason:req.body,status:"Pending"})
    res.send(newreqest)
})//all other send reqests of diffrent types such as leaves are copy paste from this with if conditionals if needed and a new dbs
Router.ROUTE('/leaveReq')
.post(async(req,res)=>{
    const user = await staff_model.findById(req.user._id)
    const hod = await staff_model.findOne(user.department.head)
    if(req.body.type=="CompensationLeave"){
        const newreqest = await new IRS_model({type:req.body.type,requester:user,reciever:hod,reason:req.body.reason,status:"Pending"})
        res.send(newreqest)
    }else{
        const newreqest = await new IRS_model({type:req.body.type,requester:user,reciever:hod,reason:req.body.reason,status:"Pending"})
        res.send(newreqest)
    }
    
})
/*router.route('/Notification')
.get(async(req,res)=>{
    const reqests = await IRS_model.findOne(req.body._id)
    if(reqests.Status!="pending"){
        res.send("requests that have been approved or denied",reqests)
    }
})
router.route('/viewAcceptedRequests')
.get(async(req,res)=>{
    const reqests = await IRS_model.findById(req.body._id)
    if(reqests.Status=="Accepted"){
        res.send("requests that have been approved",reqests)
    }
})
router.route('/viewPendingRequests')
.get(async(req,res)=>{
    const reqests = await IRS_model.findById(req.body._id)
    if(reqests.Status=="Pending"){
        res.send("requests that have been pending",reqests)
    }
})
router.route('/viewRejectedRequests')
.get(async(req,res)=>{
    const reqests = await IRS_model.findById(req.body._id)
    if(reqests.Status=="Rejected"){
        res.send("requests that have been denied",reqests)
    }
})
router.route('/cancelRequests')
.post(async(req,res)=>{
    const reqests = await IRS_model.findById(req.body._id)
    if(reqests.Status=="Pending"||requests.Date!=Date.now){
        const cancelRequests = reqests.deleteOne(reqests)
        res.send("request cancled")
    }
})*/

router.route('/assignInstructor')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    user1=await staff_model.findOne(req.body.id)
    if(user1==null){
        res.send("There is no corresponding instructor")
    }
    if(department.head==user.id){
        const course = await course_model.findOne({name:req.body.course})
        if(course==null){
            res.send("No corresponding course")
        }else{
            course.TA.push(user1)
            await course_model.findOneAndUpdate({name:req.body.course},course)
            res.send(course)
        }
    }else{
        res.send("You are not authorized to access this page")
    }
})

router.route('/removeInstructor')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    user1=await staff_model.findOne(req.body.id)
    if(user1==null){
        res.send("There is no corresponding instructor")
    }
    if(department.head==user.id){
        const course = null
        for(var i=0;i<i<department.courses.length;i++){
            if(department.courses[i].code==req.body.course){
                course=department.courses[i]
            }
        }
        if(course==null){
            res.send("No corresponding course")
        }else{
            if(user1.role=="TA"){
                for(var i=0;i<i<course.TA.length;i++){
                    if(course.TA[i].id==user1.id){
                        course.TA.splice(i,1)
                        await course_model.findOneAndUpdate({name:req.body.course},course)
                        res.send(course)
                    }
                }
                res.send("This instructor does not teach this course")
            }
            else{
                for(var i=0;i<i<course.lecturer.length;i++){
                    if(course.lecturer[i].id==user1.id){
                        course.lecturer.splice(i,1)
                        await course_model.findOneAndUpdate({name:req.body.course},course)
                        res.send(course)
                    }
                }
                res.send("This instructor does not teach this course")
            }
        }
    }else{
        res.send("You are not authorized to access this page")
    }
})
router.route('/removeInstructor')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    user1=await staff_model.findOne(req.body.id)
    if(user1==null){
        res.send("There is no corresponding instructor")
    }
    if(department.head==user.id){
        const course = null
        for(var i=0;i<i<department.courses.length;i++){
            if(department.courses[i].code==req.body.course){
                course=department.courses[i]
            }
        }
        if(course==null){
            res.send("No corresponding course")
        }else{
            if(user1.role=="TA"){
                for(var i=0;i<i<course.TA.length;i++){
                    if(course.TA[i].id==user1.id){
                        course.TA.splice(i,1)
                        await course_model.findOneAndUpdate({name:req.body.course},course)
                        res.send(course)
                    }
                }
            }
            else{
                for(var i=0;i<i<course.lecturer.length;i++){
                    if(course.lecturer[i].id==user1.id){
                        course.lecturer.splice(i,1)
                        await course_model.findOneAndUpdate({name:req.body.course},course)
                        res.send(course)
                    }
                }
            }
            res.send("This instructor does not teach this course")
        }
    }else{
        res.send("You are not authorized to access this page")
    }
})

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
                const course = null
                for(var i=0;i<i<department.courses.length;i++){
                    if(department.courses[i].code==req.body.course){
                        course=department.courses[i]
                    }
                }
                if(course==null){
                    res.send("You cannot access this course")
                }
                else{
                    res.send(course.lecturer+course.TA)
                }
            }
            {
                res.send("No Info Found")
            }
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})

router.route('/viewDayOff')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        if(req.body.id!=null){
            const staff= await staff_model.findOne(req.body.id)
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

router.route('/viewChangeDayOff')
.get(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const requests = request_model.find({department:user.department})
        res.send(requests)
    }
    else{
        res.send("You are not authorized to access this page")
    }
})

router.route('/acceptRequest')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const request = await request_model.findOne({id:req.body.id})
        if(request==null){
            res.send("No corresponding request")
        }
        else{
            request.status="accepted"
            await request_model.findOneAndUpdate({id:req.body.id},request)
            res.send(request)
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})

router.route('/rejectRequest')
.post(async(req,res)=>{
    const user= await staff_model.findById(req.user._id)
    const department = await department_model.findOne({name:user.department})
    if(department.head==user.id){
        const request = await request_model.findOne({id:req.body.id})
        if(request==null){
            res.send("No corresponding request")
        }
        else{
            request.status="rejected"
            await request_model.findOneAndUpdate({id:req.body.id},request)
            res.send(request)
        }
    }
    else{
        res.send("You are not authorized to access this page")
    }
})

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