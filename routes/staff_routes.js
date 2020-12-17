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
        id: req.body.id
    })
    await newStaff.save()
    res.send(newStaff)
})

router.route('/createFaculty')
.post(async (req, res)=>{
    const newFaculty = new faculty_model({name: req.body.name
    })
    await newFaculty.save()
    res.send(newFaculty)
})
router.route('/createDepartment')
.post(async (req, res)=>{
    const newDepartment = new department_model({name: req.body.name
    })
    await newDepartment.save()
    const faculty = await Faculty_model.findOne({name:req.body.faculty})
    faculty.departments.push(newDepartment)

    await faculty.save()
    res.send(newDepartment)
})
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
router.route('/login')
.post(async (req,res)=>{
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
})
router.route('/logout')
.post(async(req,res)=>{
    const token=null
})

router.route('/view')
.post(async (req,res)=>{

})


module.exports=router;