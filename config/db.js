require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
        })
        console.log('Connected to the Database')

    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB