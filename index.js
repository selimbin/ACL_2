const mongoose = require('mongoose')
const {app}=require('./app')
require('dotenv').config()

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db is successfully connected")
}).catch(()=>{
    console.log("db failed to connect")
}) 
app.listen(process.env.PORT)

