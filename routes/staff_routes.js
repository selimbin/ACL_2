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
    const {ID,Building,Type,Capacity}=req.body;
    try {
        const token = req.header('token');
        if (token.role == "HR") {
            if(!ID){
                return res.status(400).json({msg:"Please enter a valid id"});
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
            const existinglocation = await Location_model.findOne({id:ID});
            if(existinglocation){
                return res.status(400).json({msg:"This Location already exists"});
            }
            const newLocation = new Location_model({id:ID,building:Building,type:Type,capacity:Capacity});
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
    const {ID,newID,Building,Type,Capacity}=req.body;
    try {
        const token = req.header('token');
        if (token.role == "HR") {
            if(!ID){
                return res.status(400).json({msg:"Please enter a valid Location id"});
            }
            const existinglocation = await Location_model.findOne({id:ID});
            if(!existinglocation){
                return res.status(400).json({msg:"This Location doesn't exist"});
            }
            let Updatebuilding = Building, Updatetype = Type, Updatecapacity = Capacity, UpdateID = newID;
            if(!Building){
                Updatebuilding = existinglocation.building;
            }
            if(!Type){
                Updatetype = existinglocation.type;
            }
            if(!Capacity){
                Updatecapacity = existinglocation.capacity;
            }
            if(!newID){
                UpdateID = ID;
            }
            const Updatedlocation = await Location_model.findByIdAndUpdate(existinglocation._id,
                {id:UpdateID,building:Updatebuilding,type:Updatetype,capacity:Updatecapacity});
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
    const {ID}=req.body;
    try {
        const token = req.header('token');
        if (token.role == "HR") {
            if(!ID){
                return res.status(400).json({msg:"Please enter a valid Location id"});
            }
            const existinglocation = await Location_model.findOne({id:ID});
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
        const token = req.header('token');
        if (token.role == "HR") {
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
        const token = req.header('token');
        if (token.role == "HR") {
            if(!Name){
                return res.status(400).json({msg:"Please enter a valid Faculty name"});
            }
            const existingfaculty = await Faculty_model.findOne({name:Name});
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            let UpdateName = newName;
            if(!newName){
                UpdateName = existingfaculty.name;
            }
            const Updatedfaculty = await Faculty_model.findByIdAndUpdate(existingfaculty._id,{name:UpdateName});
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
        const token = req.header('token');
        if (token.role == "HR") {
            if(!Name){
                return res.status(400).json({msg:"Please enter a valid Faculty name"});
            }
            const existingfaculty = await Faculty_model.findOne({name:Name});
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
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
    const {facultyName,DepartmentName}=req.body;
    try {
        const token = req.header('token');
        if (token.role == "HR") {
            if(!facultyName||!DepartmentName){
                return res.status(400).json({msg:"Please enter a valid Faculty and department names"});
            }
            const existingdepartment = await Department_model.findOne({name:DepartmentName});
            if(existingdepartment){
                return res.status(400).json({msg:"This Department already exists"});
            }
            const newDepartment = new department_model({name:DepartmentName})
            await newDepartment.save()
            const existingfaculty = await Faculty_model.findOne({name:facultyName})
            if(!existingfaculty){
                return res.status(400).json({msg:"This Faculty doesn't exist"});
            }
            existingfaculty.departments.push(newDepartment)
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
    const newDepartment = new department_model({name: req.body.name
    })
    await newDepartment.save()
    const faculty = await Faculty_model.findOne({name:req.body.faculty})
    faculty.departments.push(newDepartment)

    await faculty.save()
    res.send(newDepartment)
})
//-------------------------------------------------------------------
// Delete a department under a faculty ------------------------------
router.route('/DeleteDepartment')
.post(async (req, res)=>{
    const newDepartment = new department_model({name: req.body.name
    })
    await newDepartment.save()
    const faculty = await Faculty_model.findOne({name:req.body.faculty})
    faculty.departments.push(newDepartment)

    await faculty.save()
    res.send(newDepartment)
})
//------------------------------------------------------------------
router.route('/addCourse')
.post(async (req, res)=>{
    const newCourse = new course_model({name: req.body.name
    })
    await newCourse.save()
    const department = await department_model.findOne({name:req.body.department})
    department.courses.push(newCourse)

    await department.save()
    res.send(newCourse)
})
//------------------------------------------------------------------

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
    const result= await staff_model.find()
    // res.send({ "id": result.id,"name":result.name,"role":result.role,"email":result.email,"salary":result.salary})
    res.send(result)
})


module.exports=router;