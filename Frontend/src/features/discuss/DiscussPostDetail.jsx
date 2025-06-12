import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaArrowUp, FaLink, FaUser, FaCalendar } from 'react-icons/fa';

const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const DiscussPostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector(state => state.auth);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);

    const fetchPost = useCallback(async () => {
        try {
            const { data } = await axiosClient.get(`/discuss/post/${slug}`);
            setPost(data);
            setUpvoteCount(data.upvotes.length);
            if (currentUser) {
                setIsUpvoted(data.upvotes.includes(currentUser._id));
            }
        } catch (err) {
            setError("Could not load the discussion post. It might have been deleted.");
            toast.error("Failed to load post.");
        } finally {
            setLoading(false);
        }
    }, [slug, currentUser]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleUpvote = async () => {
        if (!currentUser) {
            toast.error("You must be logged in to upvote.");
            return navigate('/login');
        }

        // Optimistic update
        setIsUpvoted(!isUpvoted);
        setUpvoteCount(count => isUpvoted ? count - 1 : count + 1);

        try {
            await axiosClient.patch(`/discuss/post/up/${post._id}`);
        } catch (err) {
            // Revert on error
            setIsUpvoted(isUpvoted);
            setUpvoteCount(count => isUpvoted ? count + 1 : count - 1);
            toast.error("Failed to update vote.");
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><LoadingSpinner message="Loading post..." /></div>;
    if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400 text-xl">{error}</div>;

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-10'><Header /></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center space-y-2">
                            <button 
                                onClick={handleUpvote}
                                className={`btn btn-circle btn-lg ${isUpvoted ? 'btn-primary' : 'btn-ghost border-white/20'}`}
                            >
                                <FaArrowUp size={24}/>
                            </button>
                            <span className="font-bold text-xl text-white">{upvoteCount}</span>
                        </div>
                        
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70 mb-6 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <img src={post.author.avatar} alt="author" className="w-6 h-6 rounded-full"/>
                                    <span>{post.author.firstName} {post.author.lastName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaCalendar />
                                    <span>Posted on {formatDateTime(post.createdAt)}</span>
                                </div>
                                <Link to={`/codefield/${post.problem._id}`} className="flex items-center gap-2 text-primary hover:underline">
                                    <FaLink />
                                    <span>{post.problem.title}</span>
                                </Link>
                            </div>
                            
                            <div className="prose prose-invert max-w-none text-gray-300 mb-8">
                                <pre className="whitespace-pre-wrap font-sans bg-transparent p-0">{post.description}</pre>
                            </div>
                            
                            {post.code && (
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Code Implementation ({post.language})</h3>
                                    <div className="h-80 border border-white/20 rounded-md overflow-hidden">
                                        <MonacoEditor
                                            language={post.language}
                                            theme="vs-dark"
                                            value={post.code}
                                            options={{ readOnly: true, minimap: { enabled: false } }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DiscussPostDetail;