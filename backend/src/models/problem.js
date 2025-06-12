const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: 'Difficulty must be either easy, medium, or hard'
        },
        required: [true, 'Difficulty is required']
    },
    tags: {
        type: [String],
        enum: {
            values: ['array', 'linkedList', 'tree', 'graph', 'dp', 'string', 'hashTable', 'math', 'sorting', 'binarySearch'],
            message: 'Invalid tag provided'
        },
        required: [true, 'At least one tag is required'],
        validate: {
            validator: function (tags) {
                return tags.length > 0;
            },
            message: 'At least one tag is required'
        }
    },
    visibleTestCases: [{
        input: {
            type: Schema.Types.Mixed,
            required: [true, 'Test case input is required']
        },
        output: {
            type: Schema.Types.Mixed,
            required: [true, 'Test case output is required']
        },
        explanation: {
            type: String,
            trim: true
        }
    }],
    hiddenTestCases: [{
        input: {
            type: Schema.Types.Mixed,
            required: [true, 'Hidden test case input is required']
        },
        output: {
            type: Schema.Types.Mixed,
            required: [true, 'Hidden test case output is required']
        }
    }],
    starterCode: [{
        language: {
            type: String,
            required: [true, 'Language is required for starter code'],
            enum: {
                values: ['javascript', 'python', 'java', 'c++'],
                message: 'Unsupported language'
            }
        },
        code: {
            type: String,
            required: [true, 'Starter code is required'],
            trim: true
        }
    }],
    referenceSolution: [{
        language: {
            type: String,
            required: [true, 'Language is required for solution code'],
            enum: {
                values: ['javascript', 'python', 'java', 'c++'],
                message: 'Unsupported language'
            }
        },
        completeCode: {
            type: String,
            required: [true, 'Solution code is required']
        }
    }],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Problem creator is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true });



// Update the updatedAt field before saving
problemSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;