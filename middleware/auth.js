const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        const verified = jwt.verify(token, config.get('jwtSecret'))
        const decoded = jwt.decode(token, config.get('jwtSecret'))
        const user = await User.findOne({ _id: verified._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send({ msg: 'autorization required' })
    }
}

module.exports = auth