const jwt = require('jsonwebtoken')
const HttpError = require('../models/httpError')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            throw new Error('Failed to authenticate user.')
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken.isAdmin) {
            return next(new HttpError('User is not authorized to perform this action.', 401))
        }
        next()
    } catch (e) {
        return next(new HttpError('Failed to authenticate user.', 401))
    }
}