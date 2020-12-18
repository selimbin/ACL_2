const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')
const faculty_model=require('../models/academics')
const {departmentSchema} = require('../models/academics.js') 
const {courseSchema} = require('../models/academics.js') 
const department_model = mongoose.model('Department', departmentSchema)
const course_model = mongoose.model('Course', courseSchema)
const faculties = mongoose.model('Faculty');

// const course_model=require('../models/course')
// const product_model=require('../models/products')
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

router.route('/createFaculty')
.post(async (req, res)=>{
    const newFaculty = new faculty_model({name: req.body.name
    })
    await newFaculty.save()
    res.send(newFaculty)
})
// router.route('/createStaff')
// .post(async (req, res)=>{
//     const newStaff = new staff_model({name: req.body.name,
//         id:req.body.id,
//         email:req.body.email,
//         role:req.body.role,
//         salary:req.body.salary
//     })
//     await newStaff.save()
//     res.send(newStaff)
// })
router.route('/createDepartment')
.post(async (req, res)=>{
    const newDepartment = new department_model({name: req.body.name
    })
    await newDepartment.save()
    const faculty = await faculties.findOne({name:req.body.faculty})
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