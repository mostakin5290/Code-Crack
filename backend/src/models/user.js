const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        immutable: true // Good choice! Prevents users from changing their login email.
    },
    age: {
        type: Number,
        min: 6,
        max: 80
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: true // --- FIX: Corrected typo from 'require' to 'required'
    },

    // --- Profile Page Information ---
    headline: { // --- NEW ---
        type: String,
        trim: true,
        maxLength: 100,
        default: 'Aspiring Coder'
    },
    bio: { // --- NEW ---
        type: String,
        maxLength: 500 // Set a reasonable limit for the bio
    },
    location: { // --- NEW ---
        type: String,
        trim: true,
        maxLength: 100
    },
    avatar: { // --- NEW ---
        type: String,
        default: 'https://api.dicebear.com/7.x/initials/svg?seed=default' // A default placeholder avatar
    },
    socialLinks: { // --- NEW ---
        github: String,
        linkedin: String,
        twitter: String,
        website: String
    },

    // --- Platform-Specific Data ---
    problemsSolved: { // --- FIX: Renamed for clarity and changed type
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Problem' // This creates a direct link to your Problem model
        }],
        default: []
    },
    stats: { // --- NEW ---
        problemsSolvedCount: {
            easy: { type: Number, default: 0 },
            medium: { type: Number, default: 0 },
            hard: { type: Number, default: 0 },
        },
        totalSubmissions: { type: Number, default: 0 },
        // Acceptance rate can be calculated on the fly or stored here
    },
    preferences: { // --- NEW ---
        language: {
            type: String,
            enum: ['javascript', 'python', 'java', 'c++'],
            default: 'javascript'
        },
        theme: {
            type: String,
            default: 'vs-dark'
        }
    }

}, { timestamps: true }); // This automatically adds createdAt and updatedAt

const User = mongoose.model('User', userSchema);
module.exports = User;