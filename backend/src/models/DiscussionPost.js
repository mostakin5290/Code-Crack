const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Utility to generate a slug from a title
const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

const DiscussionPostSchema = new Schema({
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String 
    },
    language: { 
        type: String 
    },
    problem: { 
        type: Schema.Types.ObjectId, 
        ref: 'Problem', 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    upvotes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        index: true 
    },
    // We can also add comments as a separate model and reference them here
    // comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

// Pre-save hook to generate a unique slug before validation
DiscussionPostSchema.pre('validate', function(next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title) + '-' + Date.now();
    }
    next();
});

module.exports = mongoose.model('DiscussionPost', DiscussionPostSchema);