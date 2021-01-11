const express = require('express');
const mongoose = require('mongoose')
const staff_model=require('../models/staff')

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
require('dotenv').config()

router.route('/Seed')
.post(async (req,res)=>{
    try {
        let password = "alisaad"
        const salt= await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        const newStaff = new Staff_model({id:"HR-ali",name:"Ali Saad",email:"ali.othman@guc.edu.eg",password:password,
        role:"HR",salary:100000,dayOff:"saturday",officeLocation:"A1-105",
        misseddays:0,missedHours:0,department:"IDK",gender:"M"});
        await newStaff.save();
        const seedStaffcount = new Staffcount_model({id:"1",HR:1,Academic:1});
        await seedStaffcount.save();
        res.send(newStaff);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

module.exports=router;