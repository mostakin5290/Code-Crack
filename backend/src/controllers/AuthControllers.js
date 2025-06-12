const User = require('../models/user');
const validUser = require('../utils/userValidator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis')

const register = async (req, res) => {
    try {
        // Validate request body
        try {
            validUser(req.body);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message  // Changed from error.details[0].message
            });
        }

        const { emailId, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
            role: 'user'
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                _id: newUser._id, 
                emailId: newUser.emailId, 
                role: newUser.role 
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        // Set secure HTTP-only cookie
        res.cookie('token', token, {
            maxAge: 3600 * 1000, // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Omit sensitive data from response
        const userResponse = {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            emailId: newUser.emailId,
            role: newUser.role
        };

        res.status(201).json({
            success: true,
            user: userResponse,
            message: "Registration successful"
        });

    } catch (err) {
        console.error('Registration error:', err);
        
        // Handle duplicate key errors (MongoDB)
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate input
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                emailId: user.emailId,
                role: user.role
            },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        // Set secure HTTP-only cookie
        res.cookie('token', token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        const userResponse = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            role: user.role
            // Add other non-sensitive fields as needed
        };

        res.status(200).json({
            success: true,
            user: userResponse,
            message: "Login successful"
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        
        // Check if token exists
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No authentication token found"
            });
        }

        // Verify and decode token
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            // If token is invalid, still clear the cookie
            res.clearCookie('token');
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Add token to Redis blocklist with TTL
        try {
            await redisClient.setEx(
                `token:${token}`, 
                Math.max(0, payload.exp - Math.floor(Date.now() / 1000)), 
                'blocked'
            );
        } catch (redisErr) {
            console.error('Redis error:', redisErr);
            // Even if Redis fails, we should still clear the cookie
        }

        // Clear the cookie with secure options
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (err) {
        console.error('Logout error:', err);
        
        // Ensure cookie is cleared even if error occurs
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(500).json({
            success: false,
            message: "An error occurred during logout"
        });
    }
};

const adminRegister = async (req, res) => {
    try {
        validUser(req.body);

        const { emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const newAdmin = await User.create(req.body);

        const token = jwt.sign({ _id: newAdmin._id, emailId: emailId, role: 'admin' }, process.env.JWT_KEY, { expiresIn: '1h' })

        res.cookie('token', token, { maxAge: 3600 * 1000 })

        res.status(201).send("Admin registered successfully");
    } catch (err) {
        res.status(400).send(`Error:${err}`);
    }
};

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (err) {
        console.error('Get Profile Error:', err);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the profile"
        });
    }
};


const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const {
            firstName,
            lastName,
            age,
            headline,
            bio,
            location,
            avatar,
            socialLinks,
            preferences,
            newPassword,
            currentPassword
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const updateFields = {};
        if (firstName) updateFields.firstName = firstName;
        if (lastName) updateFields.lastName = lastName;
        if (age) updateFields.age = age;
        if (headline) updateFields.headline = headline;
        if (bio) updateFields.bio = bio;
        if (location) updateFields.location = location;
        if (avatar) updateFields.avatar = avatar;

        if (socialLinks) {
            updateFields.socialLinks = { ...user.socialLinks, ...socialLinks };
        }
        if (preferences) {
            updateFields.preferences = { ...user.preferences, ...preferences };
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: "Current password is required to set a new one." });
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: "Invalid current password." });
            }
            updateFields.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true } // runValidators ensures min/max length etc. are checked
        ).select('-password');
        
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        console.error('Update Profile Error:', err);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the profile"
        });
    }
};

const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { password } = req.body; 

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to confirm account deletion."
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password. Account not deleted." });
        }

        await User.findByIdAndDelete(userId);

        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: "Your account has been successfully deleted."
        });

    } catch (err) {
        console.error('Delete Account Error:', err);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the account."
        });
    }
};

const getFullUserProfile = async (req, res) => {
    try {

        const { userId } = req.params; // We'll get the ID from the route parameter

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // --- Fetch Submission Data for the Heatmap and Recent Activity ---
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const submissions = await User.find({ 
            userId: userId,
            createdAt: { $gte: oneYearAgo }
        })
        .populate('problemId', 'title difficulty') // Populate with problem details
        .sort({ createdAt: -1 }) // Get newest first
        .select('problemId status createdAt'); // Select only the necessary fields

        // --- Combine and send the data ---
        res.status(200).json({
            success: true,
            profile: user,
            submissions: submissions,
        });

    } catch (err) {
        console.error('Get Full Profile Error:', err);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the profile data"
        });
    }
};

module.exports = { 
    register, 
    login, 
    logout, 
    adminRegister,
    getUserProfile,     
    updateUserProfile,    
    deleteUserAccount,
    getFullUserProfile
};