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
const {attendanceSchema} = require('../models/scheduling.js');

const attendance_model = mongoose.model('Attendance',attendanceSchema)
const { timeStamp } = require('console');
const { stringify } = require('querystring');
require('dotenv').config()
// router.route('/register')
// .post(async (req, res)=>{
//     const salt = await bcrypt.genSalt(10)
//     const newPassword= await bcrypt.hash(req.body.password, salt)
//     const newStaff = new staff_model({name: req.body.name,
//         email: req.body.email,
//         password: newPassword,
//         role: req.body.role,
//         id: req.body.id,
//         salary:req.body.salary
//     })
//     await newStaff.save()
//     res.send(newStaff)
// })

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
// router.route('/login')
// .post(async (req,res)=>{
//     const result = await staff_model.findOne({email:req.body.email})
//     if(!result){
//         return res.send('You need to sign up first')
//     }
//     const correctPassword= await bcrypt.compare(req.body.password, result.password)
//     if(correctPassword){
//         const token=jwt.sign({_id:result._id, role:result.role}, 
//             process.env.TOKEN_SECRET)
//         res.header('token',token).send(token)
//     }
//     else{
//         res.send('Incorrect Password')
//     }
// })

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
// router.route('/createOffice')
// .post(async(req,res)=>{

// })
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
    const attendance= await attendance_model.findOne({"_id":req.user._id,
        "date":today.toDateString().substring(4)})
    
    // res.send(today.toTimeString())
    if(!attendance){
        const attendance1 = new attendance_model({
            id:user.id,
            date:today.toDateString().substring(4)
        })
        await attendance1.save()
        attendance=attendance1
    }
    attendance.signIn.push(today.toTimeString().substring(0,8))
    await attendance.save()
    res.send(attendance)
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

module.exports=router;