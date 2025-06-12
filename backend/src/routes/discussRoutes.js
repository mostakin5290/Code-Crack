const express = require('express');
const discussRoute = express.Router();
const userMiddleware = require("../middleware/userMiddleware");

const { 
    createPost,
    getAllPosts,
    getPostBySlug,
    toggleUpvote
} = require("../controllers/discussController");

discussRoute.post('/create', userMiddleware, createPost);
discussRoute.get('/post/:slug',userMiddleware,getPostBySlug);
discussRoute.get('/post',userMiddleware,getAllPosts);
discussRoute.patch('/post/up/:_id',userMiddleware,toggleUpvote);



module.exports = discussRoute;