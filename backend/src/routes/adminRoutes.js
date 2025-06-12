const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    getSiteContent,
    updateSiteContent
} = require('../controllers/adminController.js');

// Import the middleware
// const { protect, isAdmin } = require('../middleware/authMiddleware.js');



// Apply middleware to all routes in this file
// router.use(protect, adminMiddleware);

// Define the routes
router.get('/stats',adminMiddleware, getDashboardStats);
router.get('/users',adminMiddleware,getAllUsers);
// router.route('/users').get(getAllUsers);
router.delete('/users/:id',adminMiddleware,deleteUser);
router.get('/site-content/:key',adminMiddleware,getSiteContent);
router.put('/site-content/:key',adminMiddleware,updateSiteContent);

module.exports = router;