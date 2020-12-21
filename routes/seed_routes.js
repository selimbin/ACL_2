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
const {staffcount} = require('../models/staff.js') 
const Staffcount_model = mongoose.model('Staffcount', staffcount)
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

module.exports=router;