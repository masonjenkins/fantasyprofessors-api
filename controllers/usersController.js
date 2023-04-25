const HttpError = require('../models/httpError')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const signup = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid API Call arguments. Try again with correct params.', 400))
    }
    const { email, name, password } = req.body

    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (e) {
        return next(new HttpError('Signup failed', 500))
    }

    if(existingUser) {
        return next(new HttpError('User already exists. Try to login with this email.', 409))
    }

    let hashedPassword
    let token 
    let newUser

    try {
        hashedPassword = await bcrypt.hash(password, 10)

        newUser = new User({
            name,
            email,
            passwordHash: hashedPassword,
            membership: 'user',
            isAdmin: false
        })

        token = jwt.sign(
            {userId: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin},
            process.env.JWT_SECRET, {expiresIn: '24h'}
        )

        await newUser.save()


    } catch (e) {
        return next(new HttpError('Error creating user.', 500))
    }

    res.status(201).json({ userId: newUser.id, email: newUser.email, token: token, isAdmin: newUser.isAdmin })
}

const login = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return next(new HttpError('Invalid API Call arguments. Try again with correct params.', 400))
    }
    const { email, password } = req.body 

    let existingUser

    try {
        existingUser = await User.findOne({ email: email })
    } catch (e) {
        return next(new HttpError('Error retrieving user information. Try again.', 500))
    }

    if (!existingUser) {
        return next(new HttpError('Invalid user credentials. Try again.', 401))
    }

    let passwordMatch = false 
    try {
        passwordMatch = await bcrypt.compare(password, existingUser.passwordHash)
    } catch (e) {
        return next(new HttpError('Invalid user credentials. Try again.', 401))
    }

    if(!passwordMatch) {
        return next(new HttpError('Invalid user credentials. Try again.', 401))
    }


    let token 
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email, isAdmin: existingUser.isAdmin},
            process.env.JWT_SECRET, {expiresIn: '24h'}
        )
    } catch (e) {
        return next(new HttpError('Error authenticating user. Try again.', 500))
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token, isAdmin: existingUser.isAdmin })
}

exports.signup = signup;
exports.login = login;