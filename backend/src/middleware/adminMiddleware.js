const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async(req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token)
            throw new Error('please login first');

        const payload = jwt.verify(token, process.env.JWT_KEY);
        
        if (!payload._id || payload.role !== 'admin')
            throw new Error('Only admins can register new admin accounts');

        const adminUser = await User.findById(payload._id);
        if (!adminUser)
            throw new Error('Admin account not found');

        req.admin = adminUser;
        next();

    } catch(err) {
        res.status(403).send(err.message);
    }
};
module.exports = adminMiddleware;
