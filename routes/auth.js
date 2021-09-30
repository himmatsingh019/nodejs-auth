const router = require('express').Router()
const User = require('../models/user')
const jwt = require('jwt-simple')
require('dotenv').config()

router.post('/register', (req, res) => {
    if ((!req.body.name) || (!req.body.password) || (!req.body.email)) {
        res.json({ success: false, msg: "Enter all fields" })
    }
    else {
        var newUser = User({
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        });
        newUser.save(function (err, newUser) {
            if (err) {
                res.json({ success: false, msg: 'Failed to save' })
            }
            else {
                res.json({ success: true, msg: "Successfully saved" })
            }
        })
    }
})

router.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            return res.json({ success: false, msg: 'Failed to log in' })
        }
        if (!user) {
            res.status(403).json({ success: false, msg: 'Authentication Failed, User not found' })
        }
        else {
            user.comaparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user.email, process.env.SECRET)
                    res.json({ success: true, token: token })
                }
                else {
                    return res.status(403).send({ success: false, msg: 'Authentication Failed, wrong password' })
                }
            })
        }
    }).select('+password')
})

router.get('/getinfo', async (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
        const token = req.headers.authorization.split(' ')[1]
        const email = jwt.decode(token, process.env.SECRET)
        const user = await User.findOne({ email: email })
        return res.json({ success: true, msg: user })
    }
    else {
        return res.json({ success: false, msg: 'No Header' })
    }
})

module.exports = router