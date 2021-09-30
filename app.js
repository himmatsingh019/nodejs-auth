const express = require('express')
const connectDB = require('./config/db')
const passport = require('./config/passport')
const authRouter = require('./routes/auth')
const app = express()

app.use(express.json())
connectDB()

app.use('/auth', authRouter)

app.listen(process.env.PORT, console.log('Server Running'))