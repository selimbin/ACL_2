const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')
const faculty_model=require('../models/academics')

const {departmentSchema} = require('../models/academics.js') 
const {courseSchema} = require('../models/academics.js') 
const {internalRequestSchema} = require('../models/requests.js') 
const {scheduleSchema} = require('../models/scheduling.js') 

const department_model = mongoose.model('Department', departmentSchema)
const course_model = mongoose.model('Course', courseSchema)
const request_model = mongoose.model('IRS', internalRequestSchema)
const faculties = mongoose.model('Faculty');
const schedule_model=mongoose.model("Schedule",scheduleSchema)

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { readdirSync } = require('fs');
const {attendanceSchema} = require('../models/scheduling.js');

const attendance_model = mongoose.model('Attendance',attendanceSchema)
const { timeStamp } = require('console');
const { stringify } = require('querystring');
require('dotenv').config()

router.route('/createFaculty')
.post(async (req, res)=>{
    const newFaculty = new faculty_model({name: req.body.name
    })
    await newFaculty.save()
    res.send(newFaculty)
})
router.route('/createDepartment')
.post(async (req, res)=>{
    // const newDepartment = new department_model({name: req.body.name
    // })
    const newDepartment = await department_model(req.body).save()
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