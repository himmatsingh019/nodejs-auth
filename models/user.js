const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    }
}, { timestamps: true, versionKey: false })

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next()
            })
        })
    }
    else {
        return next()
    }
})

userSchema.methods.comaparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (error, isMatch) {
        if (error) {
            return cb(error)
        }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema)