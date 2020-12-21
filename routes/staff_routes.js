const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')
const faculty_model=require('../models/academics')
const {departmentSchema} = require('../models/academics.js') 
const {courseSchema} = require('../models/academics.js') 
const department_model = mongoose.model('Department', departmentSchema)
const course_model = mongoose.model('Course', courseSchema)
const faculties = mongoose.model('Faculty');
const schedule_model = mongoose.model('Schedule', scheduleSchema)
const IRS_model=mongoose.model('IRS',internalreqestsschema)


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
const scheduling = require('../models/scheduling.js');
const { Router } = require('express');
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
module.exports=router;