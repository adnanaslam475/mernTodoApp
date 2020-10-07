const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')//for pasword hashing
const jwt = require('jsonwebtoken'); //for web token login
const Todo = require('../models/todoModel')
const config = require('config')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error({ msg: 'Email is invalid' })
            }
        }
    },
    password: {
        type: String,
        minlength: 5,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error({ msg: 'Password cannot contain "password"' })
            }
        }
    },
    socialId: {
        type: String
    },
    token: { type: String },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
        // default: config.get('avatar')
    }
},
    {
        timestamps: true,
    })

userSchema.virtual('todos', {
    ref: 'Todo',
    localField: 'email',
    foreignField: 'owner'
})


userSchema.methods.toJSON = function () {
    const user = this
    const userobject = user.toObject()

    delete userobject.password,
        delete userobject.tokens
    return userobject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), email: user.email.toString() },
        config.get('jwtSecret'), { expiresIn: '1 hour' })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User