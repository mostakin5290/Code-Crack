// import React, { useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../components/layout/Header';
// import Footer from '../components/layout/Footer';
// import axiosClient from '../api/axiosClient';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import { FaThumbtack, FaCommentDots, FaEye, FaArrowUp, FaFire } from 'react-icons/fa';
// // Mock Discussion Data
// // const allDiscussionsData = [
// //     {
// //         id: 'd1',
// //         title: 'Best approach for solving "Two Sum" problem?',
// //         slug: 'best-approach-two-sum',
// //         author: { username: 'AlgoMaster', avatarChar: 'A' },
// //         category: 'Problem Solving',
// //         tags: ['arrays', 'hash-table', 'easy'],
// //         replies: 23,
// //         views: 1502,
// //         lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
// //         pinned: true,
// //     },
// //     {
// //         id: 'd2',
// //         title: 'Understanding Big O Notation for beginners',
// //         slug: 'understanding-big-o-beginners',
// //         author: { username: 'TechGuru101', avatarChar: 'T' },
// //         category: 'Computer Science Fundamentals',
// //         tags: ['algorithms', 'complexity', 'basics'],
// //         replies: 15,
// //         views: 980,
// //         lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
// //         pinned: false,
// //     },
// //     {
// //         id: 'd3',
// //         title: 'Favorite resources for learning Python?',
// //         slug: 'favorite-python-resources',
// //         author: { username: 'PythonistaJane', avatarChar: 'P' },
// //         category: 'Languages',
// //         tags: ['python', 'learning', 'resources'],
// //         replies: 42,
// //         views: 2300,
// //         lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
// //         pinned: false,
// //     },
// //     {
// //         id: 'd4',
// //         title: 'How to prepare for technical interviews at FAANG companies?',
// //         slug: 'faang-interview-prep',
// //         author: { username: 'InterviewPro', avatarChar: 'I' },
// //         category: 'Career',
// //         tags: ['interview', 'faang', 'preparation', 'tips'],
// //         replies: 78,
// //         views: 5600,
// //         lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
// //         pinned: true,
// //     },
// //     {
// //         id: 'd5',
// //         title: 'Share your recent contest experiences!',
// //         slug: 'recent-contest-experiences',
// //         author: { username: 'ContestKing', avatarChar: 'C' },
// //         category: 'Contests',
// //         tags: ['discussion', 'contests', 'feedback'],
// //         replies: 30,
// //         views: 1200,
// //         lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
// //         pinned: false,
// //     },
// //     {
// //         id: 'd6',
// //         title: 'Tips for debugging complex code?',
// //         slug: 'debugging-complex-code',
// //         author: { username: 'BugSmasher', avatarChar: 'B' },
// //         category: 'Development',
// //         tags: ['debugging', 'coding', 'tips'],
// //         replies: 18,
// //         views: 750,
// //         lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
// //         pinned: false,
// //     }
// // ];

// const formatRelativeTime = (date) => {
//     const now = new Date();
//     const seconds = Math.round((now - date) / 1000);
//     const minutes = Math.round(seconds / 60);
//     const hours = Math.round(minutes / 60);
//     const days = Math.round(hours / 24);
//     const weeks = Math.round(days / 7);
//     const months = Math.round(days / 30); // Approximate
//     const years = Math.round(days / 365); // Approximate

//     if (seconds < 60) return `${seconds}s ago`;
//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     if (days < 7) return `${days}d ago`;
//     if (weeks < 5) return `${weeks}w ago`; // Up to 4 weeks
//     if (months < 12) return `${months}mo ago`;
//     return `${years}y ago`;
// };


// const DiscussPage = () => {

//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortBy, setSortBy] = useState('latest'); // 'latest', 'replies', 'views'
//     // const [categoryFilter, setCategoryFilter] = useState('All');

//     const [currentPage, setCurrentPage] = useState(1);
//     const postsPerPage = 5; // Show fewer posts per page for discuss



//     const filteredAndSortedDiscussions = useMemo(() => {
//         let discussions = allDiscussionsData
//             .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()));
//         // Add category filter: && (categoryFilter === 'All' || post.category === categoryFilter)

//         if (sortBy === 'latest') {
//             discussions.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
//         } else if (sortBy === 'replies') {
//             discussions.sort((a, b) => b.replies - a.replies);
//         } else if (sortBy === 'views') {
//             discussions.sort((a, b) => b.views - a.views);
//         }
//         // Separate pinned posts and put them at the top, then sort the rest
//         const pinned = discussions.filter(d => d.pinned);
//         const notPinned = discussions.filter(d => !d.pinned);

//         return [...pinned, ...notPinned];

//     }, [searchTerm, sortBy /*, categoryFilter */]);

//     const indexOfLastPost = currentPage * postsPerPage;
//     const indexOfFirstPost = indexOfLastPost - postsPerPage;
//     const currentPosts = filteredAndSortedDiscussions.slice(indexOfFirstPost, indexOfLastPost);
//     const totalPages = Math.ceil(filteredAndSortedDiscussions.length / postsPerPage);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const DiscussionListItem = ({ post }) => (
//         <div className="bg-white/10 backdrop-blur-md p-5 rounded-lg border border-white/20 hover:border-primary/40 transition-all duration-200 flex space-x-4 items-start">
//             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
//                 {post.author.avatarChar || post.author.username.charAt(0).toUpperCase()}
//             </div>
//             <div className="flex-grow">
//                 <Link to={`/discuss/${post.slug}`} className="block">
//                     <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors">
//                         {post.pinned && (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                                 <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
//                             </svg>
//                         )}
//                         {post.title}
//                     </h3>
//                 </Link>
//                 <p className="text-xs text-white/60 mt-1">
//                     Started by <span className="font-medium text-primary/80">{post.author.username}</span> in <span className="font-medium text-white/70">{post.category}</span>
//                 </p>
//                 <div className="mt-2 flex flex-wrap gap-1">
//                     {post.tags.map(tag => (
//                         <span key={tag} className="px-2 py-0.5 text-xs bg-white/10 text-white/70 rounded-full">{tag}</span>
//                     ))}
//                 </div>
//             </div>
//             <div className="flex-shrink-0 text-right space-y-1">
//                 <div className="text-sm text-white/80">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.741 8.741 0 01-4.472-1.255L4.255 17.5A.25.25 0 014 17.245l.001-.001.06-.24L4.76 15.4A7.96 7.96 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" />
//                     </svg>
//                     {post.replies}
//                 </div>
//                 <div className="text-sm text-white/80">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1 opacity-70" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                         <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                     </svg>
//                     {post.views}
//                 </div>
//                 <div className="text-xs text-white/60">{formatRelativeTime(new Date(post.lastActivity))}</div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
//             {/* Navigation Bar */}
//             <div className='mb-10'>
//                 <Header />
//             </div>

//             {/* Main Content Area */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
//                     <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">Community Discussions</h1>
//                     <Link
//                         to="/discuss/new" // Placeholder for new post page/modal
//                         className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none hover:from-primary/90 hover:to-secondary/90"
//                     >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                             <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                         </svg>
//                         Create New Post
//                     </Link>
//                 </header>

//                 {/* Filters Section */}
//                 <div className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/20">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
//                         <div>
//                             <label htmlFor="search-discuss" className="block text-sm font-medium text-white/80">Search Discussions</label>
//                             <input
//                                 type="text"
//                                 name="search-discuss"
//                                 id="search-discuss"
//                                 value={searchTerm}
//                                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//                                 className="mt-1 block w-full bg-white/10 border-white/20 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
//                                 placeholder="Search by title..."
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="sort-by" className="block text-sm font-medium text-white/80">Sort By</label>
//                             <select
//                                 id="sort-by"
//                                 name="sort-by"
//                                 value={sortBy}
//                                 onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
//                                 className="mt-1 block w-full bg-white/10 border-white/20 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
//                             >
//                                 <option value="latest">Latest Activity</option>
//                                 <option value="replies">Most Replies</option>
//                                 <option value="views">Most Views</option>
//                                 {/* <option value="newest">Newest Post</option> */}
//                             </select>
//                         </div>
//                         <div>
//                             <label htmlFor="category-filter" className="block text-sm font-medium text-white/80">Category (Coming Soon)</label>
//                             <select
//                                 id="category-filter"
//                                 name="category-filter"
//                                 disabled
//                                 className="mt-1 block w-full bg-white/5 border-white/10 text-white/50 rounded-md shadow-sm py-2 px-3 sm:text-sm cursor-not-allowed"
//                             >
//                                 <option>All Categories</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Discussion List */}
//                 <div className="space-y-4">
//                     {currentPosts.length > 0 ? currentPosts.map(post => (
//                         <DiscussionListItem key={post.id} post={post} />
//                     )) : (
//                         <div className="text-center py-10 bg-white/5 backdrop-blur-lg rounded-lg border border-white/20">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
//                             </svg>
//                             <h3 className="mt-2 text-lg font-medium text-white">No discussions found</h3>
//                             <p className="mt-1 text-sm text-white/60">
//                                 Try adjusting your search or filters, or be the first to start a new discussion!
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <nav
//                         className="mt-8 bg-white/5 backdrop-blur-lg border border-white/20 px-4 py-3 flex items-center justify-between sm:px-6 rounded-lg"
//                         aria-label="Pagination"
//                     >
//                         <div className="hidden sm:block">
//                             <p className="text-sm text-white/70">
//                                 Showing <span className="font-medium">{indexOfFirstPost + 1}</span> to <span className="font-medium">{Math.min(indexOfLastPost, filteredAndSortedDiscussions.length)}</span> of{' '}
//                                 <span className="font-medium">{filteredAndSortedDiscussions.length}</span> results
//                             </p>
//                         </div>
//                         <div className="flex-1 flex justify-between sm:justify-end">
//                             <button
//                                 onClick={() => paginate(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 Previous
//                             </button>
//                             <button
//                                 onClick={() => paginate(currentPage + 1)}
//                                 disabled={currentPage === totalPages || currentPosts.length === 0}
//                                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </nav>
//                 )}
//             </div>

//             {/* Footer */}
//             <Footer />
//         </div>
//     );
// };

// export default DiscussPage;


import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaThumbtack, FaCommentDots, FaEye, FaArrowUp, FaFire } from 'react-icons/fa';

const formatRelativeTime = (date) => {
    const now = new Date();
    const seconds = Math.round((now - new Date(date)) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

const DiscussPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axiosClient.get('/discuss/post', {
                params: {
                    page: currentPage,
                    limit: 10,
                    sortBy,
                    search: searchTerm
                }
            });
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to fetch discussions. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortBy, searchTerm]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };
    
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    }

    const DiscussionListItem = ({ post }) => (
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-lg border border-white/20 hover:border-primary/40 transition-all duration-200 flex space-x-4 items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                <img src={post.author.avatar} alt={post.author.username} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-grow">
                <Link to={`/discuss/${post.slug}`} className="block">
                    <h3 className="text-lg font-semibold text-white hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-xs text-white/60 mt-1">
                    Started by <span className="font-medium text-primary/80">{post.author.username}</span>
                    <span className="mx-1">•</span>
                    <span>{formatRelativeTime(post.createdAt)}</span>
                </p>
            </div>
            <div className="flex-shrink-0 text-right space-y-1 text-sm text-white/80 flex items-center gap-4">
                <div className="flex items-center gap-1.5" title="Upvotes">
                    <FaArrowUp />
                    <span>{post.upvoteCount}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-10'>
                <Header />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-4xl font-bold text-white mb-4 sm:mb-0">Community Discussions</h1>
                    <Link to="/discuss/new" className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none hover:from-primary/90 hover:to-secondary/90">
                        Create New Post
                    </Link>
                </header>

                <div className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-lg border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                        <div>
                            <label htmlFor="search-discuss" className="block text-sm font-medium text-white/80">Search Discussions</label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="mt-1 block w-full bg-white/10 border-white/20 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Search by title..."
                            />
                        </div>
                        <div>
                            <label htmlFor="sort-by" className="block text-sm font-medium text-white/80">Sort By</label>
                            <select value={sortBy} onChange={handleSortChange} className="mt-1 block w-full bg-white/10 border-white/20 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                                <option value="latest">Latest</option>
                                <option value="upvotes">Most Upvoted</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <LoadingSpinner message="Fetching discussions..." />
                    ) : error ? (
                        <div className="text-center py-10 bg-red-500/10 rounded-lg text-red-400">{error}</div>
                    ) : posts.length > 0 ? (
                        posts.map(post => <DiscussionListItem key={post._id} post={post} />)
                    ) : (
                        <div className="text-center py-10 bg-white/5 rounded-lg">
                            <h3 className="text-lg font-medium text-white">No discussions found</h3>
                            <p className="mt-1 text-sm text-white/60">Be the first to start a new discussion!</p>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <nav className="mt-8 flex items-center justify-between">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-ghost">Previous</button>
                        <span className="text-white/70">Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-ghost">Next</button>
                    </nav>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default DiscussPage;




