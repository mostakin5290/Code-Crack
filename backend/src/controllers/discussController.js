const DiscussionPost = require('../models/DiscussionPost');
const mongoose = require('mongoose');


const createPost = async (req, res) => {
    const { title, description, code, language, problemId } = req.body;
    const authorId = req.user.id; // Assuming `userMiddleware` adds user to req

    if (!title || !description || !problemId) {
        return res.status(400).json({ message: 'Title, description, and a linked problem are required.' });
    }

    try {
        const newPost = new DiscussionPost({
            title,
            description,
            code,
            language,
            problem: problemId,
            author: authorId,
        });

        const savedPost = await newPost.save();
        await savedPost.populate('author', 'firstName lastName avatar');
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) { // Handle duplicate slug error
             return res.status(409).json({ message: 'A post with a similar title already exists. Please choose a different title.' });
        }
        res.status(500).json({ message: 'Server error while creating post.' });
    }
};


const getAllPosts = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'latest', search = '' } = req.query;

    try {
        const query = search ? { title: { $regex: search, $options: 'i' } } : {};
        
        let sortOption = { createdAt: -1 }; // Default: latest
        if (sortBy === 'upvotes') {
            sortOption = { upvoteCount: -1, createdAt: -1 };
        }

        const posts = await DiscussionPost.aggregate([
            { $match: query },
            { $addFields: { upvoteCount: { $size: "$upvotes" } } },
            { $sort: sortOption },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            { $unwind: '$authorInfo' },
            {
                 $project: {
                    title: 1,
                    slug: 1,
                    upvoteCount: 1,
                    createdAt: 1,
                    author: {
                        _id: '$authorInfo._id',
                        username: { $concat: ['$authorInfo.firstName', ' ', '$authorInfo.lastName'] },
                        avatar: '$authorInfo.avatar'
                    },
                }
            }
        ]);
        
        const totalPosts = await DiscussionPost.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching posts.' });
    }
};

const getPostBySlug = async (req, res) => {
    try {
        const post = await DiscussionPost.findOne({ slug: req.params.slug })
            .populate('author', 'firstName lastName avatar')
            .populate('problem', 'title _id');
            
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const toggleUpvote = async (req, res) => {
    try {
        const post = await DiscussionPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user.id;
        const upvoteIndex = post.upvotes.indexOf(userId);

        if (upvoteIndex === -1) {
            // User has not upvoted yet, add upvote
            post.upvotes.push(userId);
        } else {
            // User has already upvoted, remove upvote
            post.upvotes.splice(upvoteIndex, 1);
        }
        
        await post.save();
        res.json({ upvotes: post.upvotes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostBySlug,
    toggleUpvote
}