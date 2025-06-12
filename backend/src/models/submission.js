const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submission = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true,
        enum: ['javascript', 'python', 'java', 'c++']
    },

    status: {
        type: String,
        enum: [
            'Pending',
            'Accepted',
            'Wrong Answer',
            'Time Limit Exceeded',
            'Compilation Error',
            'Runtime Error',
            'Memory Limit Exceeded'
        ],
        default: 'pending'
    },
    runtime: {
        type: Number,
        default: 0
    },
    memory: {
        type: Number, 
        default: 0
    },
    errorMessage: {
        type: String,
        default: ''
    },
    testCasesPassed: {
        type: Number,
        default: 0
    },
    testCasesTotal: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

submission.index({userId:1 , problemId:1});


const Submission = mongoose.model('Submission', submission);

module.exports = Submission;