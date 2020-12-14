const mongoose = require('mongoose')
const {app}=require('./app')
require('dotenv').config()

mongoose.connect(process.env.DB_URL) 
app.listen(process.env.PORT)

