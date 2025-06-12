const express = require('express')
const authRouter = express.Router();
const { register, login, logout,getFullUserProfile, adminRegister,deleteUserAccount,updateUserProfile,getUserProfile } = require('../controllers/AuthControllers');
const userMiddleware = require('../middleware/userMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/adminRegister', adminMiddleware, adminRegister);
authRouter.get('/profile', userMiddleware, getUserProfile);
authRouter.put('/profile', userMiddleware, updateUserProfile);
authRouter.delete('/account', userMiddleware, deleteUserAccount);
authRouter.get('/allDetails/:userId', getFullUserProfile);



authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.user.firstName,
        lastName:req.user.lastName,
        emailId: req.user.emailId,
        avatar:req.user.avatar,
        _id: req.user._id,
        role: req.user.role
    }

    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
})


module.exports = authRouter;