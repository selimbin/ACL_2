const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')
const faculty_model=require('../models/academics')
// Department Schema and model ----------------------------------------
const {departmentSchema} = require('../models/academics.js') 
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
const Staff_model = mongoose.model('Staff', staffSchema)
// Staffcount Schema and model --------------------------------------
const {staffcountSchema} = require('../models/staff.js') 
const Staffcount_model = mongoose.model('Staffcount', staffcountSchema)

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { readdirSync } = require('fs');
require('dotenv').config()

router.route('/register')
.post(async (req, res)=>{
    const salt = await bcrypt.genSalt(10)
    const newPassword= await bcrypt.hash(req.body.password, salt)
    const newStaff = new staff_model({name: req.body.name,
        email: req.body.email,
        password: newPassword,
        role: req.body.role,
        id: req.body.id,
        salary:req.body.salary
    })
    await newStaff.save()
    res.send(newStaff)
})
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
            if(!Capacity){
                Updatecapacity = existinglocation1.capacity;
            }
            if(!newCode){
                UpdateCode = Code;
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
    const {FacultyName,DepartmentName}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(!FacultyName||!DepartmentName){
                return res.status(400).json({msg:"Please enter a valid Faculty and department names"});
            }
            const existingdepartment = await department_model.findOne({name:DepartmentName});
            if(existingdepartment){
                return res.status(400).json({msg:"This Department already exists"});
            }
            const newDepartment = new department_model({facultyname:FacultyName,name:DepartmentName})
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
    const {FacultyName,DepartmentName,newDepartmentName,newFacultyname}=req.body;
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
            let UpdateDepartment = newDepartmentName, UpdateFaculty = newFacultyname;
            if(!newDepartmentName){
                UpdateDepartment = DepartmentName;
            }
            if(!newFacultyname){
                UpdateFaculty = FacultyName;
                UpdatedDepartment = await department_model.findByIdAndUpdate(existingdepartment1._id,{facultyname:UpdateFaculty,name:newDepartmentName})
                await UpdatedDepartment.save()
                res.send(UpdatedDepartment)
            }
            else{
                const prevfaculty = await Faculty_model.findOne({name:FacultyName})
                await prevfaculty.departments.pull(existingdepartment1);
                await prevfaculty.save()

                const newfaculty = await Faculty_model.findOne({name:UpdateFaculty})
                UpdatedDepartment = await department_model.findByIdAndUpdate(existingdepartment1._id,{facultyname:UpdateFaculty,name:newDepartmentName},{new:true})
                await UpdatedDepartment.save()
                if(!newfaculty){
                    return res.status(400).json({msg:"The entered Faculty doesn't exist"});
                }
                await newfaculty.departments.push(UpdatedDepartment)
                await newfaculty.save()
                res.send(UpdatedDepartment)
            }
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
            const deleteddepartment = await department_model.findByIdAndDelete(existingdepartment._id);
            await existingfaculty.departments.pull(existingdepartment);
            await existingfaculty.save();
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
    const {Departmentname,Code,Coverage,Coordinator,Lecturer,TA}=req.body;
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
            if(Lecturer){
                const existinglecturer = await Staff_model.findOne({id:Lecturer})
                if(!existinglecturer){
                    return res.status(400).json({msg:"This Staff doesn't exist"});
                }
                await newCourse.lecturer.push(existinglecturer)
            }
            if(TA){
                const existingTA = await Staff_model.findOne({id:TA})
                if(!existingTA){
                    return res.status(400).json({msg:"This Staff doesn't exist"});
                }
                await newCourse.TA.push(existingTA)
            }
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
    const {Departmentname,Code,newDepartmentname,newCode,Coverage,Coordinator,Lecturer,TA}=req.body;
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
            let change = "true";
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
                change = "false";
            }
            if(change == "false"){
                UpdatedCourse = await course_model.findByIdAndUpdate(existingcourse1._id,{code:UpdateCode,departmentname:UpdateDepartment,
                    coverage:UpdateCoverage,courseCoordinator:UpdateCoordinator},{new:true})
                await UpdatedCourse.save()
            }
            else{
                UpdatedCourse = await course_model.findByIdAndUpdate(existingcourse1._id,{code:UpdateCode,departmentname:UpdateDepartment,
                    coverage:UpdateCoverage,courseCoordinator:UpdateCoordinator},{new:true})
                await UpdatedCourse.save()
                await existingdepartment1.courses.pull(existingcourse1)
                const existingdepartment2 = await department_model.findOne({name:UpdateDepartment});
                await existingdepartment2.courses.push(UpdatedCourse)
            }
            const newCourse = await course_model.findOne({code:UpdateCode});
            if(Lecturer){
                const existinglecturer = await Staff_model.findOne({id:Lecturer})
                if(!existinglecturer){
                    return res.status(400).json({msg:"This Staff doesn't exist"});
                }
                await newCourse.lecturer.push(existinglecturer)

            }
            if(TA){
                const existingTA = await Staff_model.findOne({id:TA})
                if(!existingTA){
                    return res.status(400).json({msg:"This Staff doesn't exist"});
                }
                await newCourse.TA.push(existingTA)
            }
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
    const {name,email,salary,officelocation,role,dayoff}=req.body;
    try {
        if (req.user.role  == "HR") {
            if(role == "HR"){
                if(dayoff != "Saturday"){
                    return res.status(400).json({msg:"HR dayoff can only be saturday!"});
                }
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
            const newStaff = new Staff_model({id:id,name:name,email:email,password:password,role:role,salary:salary,dayOff:dayoff,officeLocation:officelocation})
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
router.route('/login')
.post(async (req,res)=>{
    try {
        const result = await staff_model.findOne({email:req.body.email})
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
    const token = null
    res.header('token',token).send(token)
})
router.route('/viewProfile')
.get(async(req,res)=>{
    // res.send(req.user)
    // const result= await staff_model.findOne({id:req.user.id})
    const result= await staff_model.findById(req.user._id)
    // res.send({ "id": result.id,"name":result.name,"role":result.role,"email":result.email,"salary":result.salary})
    res.send(result)
})


module.exports=router;