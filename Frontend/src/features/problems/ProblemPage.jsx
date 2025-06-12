import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosClient from '../../api/axiosClient';
import Header from '../../components/layout/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaCheck, FaPen, FaUndo, FaSearch, FaFilter, FaBookmark, FaCalendarAlt, FaBriefcase } from 'react-icons/fa';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const getPaginationNumbers = (currentPage, totalPages) => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage > totalPages - 4) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

const ProblemPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const problemsPerPage = 15;
    const [activeTab, setActiveTab] = useState('problems');

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get('/problem/getAllProblem');
                setProblems(data || []);
            } catch (err) {
                console.error("Error fetching problems:", err);
                setProblems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, [user]);

    const filteredProblems = useMemo(() => {
        return problems.filter(problem =>
            (difficultyFilter === 'All' || problem.difficulty?.toLowerCase() === difficultyFilter.toLowerCase()) &&
            (statusFilter === 'All' ||
                (statusFilter === 'none' ? !problem.status : problem.status?.toLowerCase() === statusFilter.toLowerCase())) &&
            (problem.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [problems, searchTerm, difficultyFilter, statusFilter]);

    const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
    const currentProblems = filteredProblems.slice((currentPage - 1) * problemsPerPage, currentPage * problemsPerPage);
    const pageNumbers = getPaginationNumbers(currentPage, totalPages);

    const handleResetFilters = () => {
        setSearchTerm('');
        setDifficultyFilter('All');
        setStatusFilter('All');
        setCurrentPage(1);
    };

    const difficultyPill = (difficulty) => {
        const colors = {
            easy: 'bg-green-500/10 text-green-400 border-green-500/30',
            medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            hard: 'bg-red-500/10 text-red-400 border-red-500/30',
        };
        return (
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[difficulty] || 'bg-gray-500/10 text-gray-400'}`}>
                {capitalizeFirstLetter(difficulty)}
            </span>
        );
    };

    const statusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'solved': return <FaCheck className="h-4 w-4 text-green-400" title="Solved" />;
            case 'attempted': return <FaPen className="h-4 w-4 text-yellow-400" title="Attempted" />;
            default: return <span className="invisible group-hover:visible text-gray-600">-</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-15'>
                <Header />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar - LeetCode style */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-4 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaBookmark className="text-primary" /> Study Plan
                        </h2>
                        <ul className="space-y-2">
                            <li>
                                <button className="text-white/80 hover:text-white w-full text-left pl-4 py-1">My Lists</button>
                            </li>
                            <li>
                                <button className="text-white/80 hover:text-white w-full text-left pl-6 py-1">Favorite</button>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-4 mb-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" /> Last Meeting
                        </h2>
                        <ul className="space-y-2">
                            <li className="text-white/80 hover:text-white cursor-pointer">All Topics</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">Search questions</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">Add Two Numbers</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">Median of Two Sorted Arrays</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">Longest Palindromic Substring</li>
                        </ul>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-4">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FaBriefcase className="text-primary" /> Training Companies
                        </h2>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search for a company"
                                className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <ul className="space-y-2">
                            <li className="text-white/80 hover:text-white cursor-pointer">Main</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">Google</li>
                            <li className="text-white/80 hover:text-white cursor-pointer">HTTP</li>
                        </ul>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    {/* Tabs */}
                    <div className="flex border-b border-white/20 mb-6">
                        <button
                            onClick={() => setActiveTab('problems')}
                            className={`px-4 py-2 font-medium ${activeTab === 'problems' ? 'text-primary border-b-2 border-primary' : 'text-white/70 hover:text-white'}`}
                        >
                            Problems
                        </button>
                        <button
                            onClick={() => setActiveTab('study')}
                            className={`px-4 py-2 font-medium ${activeTab === 'study' ? 'text-primary border-b-2 border-primary' : 'text-white/70 hover:text-white'}`}
                        >
                            Study Plan
                        </button>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-white mb-2">Problems</h1>
                        <p className="text-lg text-white/80">Practice coding problems to improve your skills</p>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-white/50" />
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Search problems..."
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center">
                                    <FaFilter className="text-white/50 mr-2" />
                                    <select
                                        value={difficultyFilter}
                                        onChange={(e) => setDifficultyFilter(e.target.value)}
                                        className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="All">All Difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="solved">Solved</option>
                                        <option value="attempted">Attempted</option>
                                        <option value="none">Not Attempted</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors duration-300"
                                >
                                    <FaUndo size={12} /> Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Problems Table */}
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider w-16 text-center">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                            Tags
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider w-40">
                                            Difficulty
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <LoadingSpinner />
                                            </td>
                                        </tr>
                                    ) : currentProblems.length > 0 ? (
                                        currentProblems.map((problem) => (
                                            <tr key={problem._id} className="hover:bg-white/10 transition-colors duration-150 group">
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {statusIcon(problem.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Link
                                                        to={`/codefield/${problem._id}`}
                                                        className="text-white hover:text-primary transition-colors duration-200 font-medium"
                                                    >
                                                        {problem.title}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {problem.tags?.slice(0, 3).map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20"
                                                            >
                                                                {capitalizeFirstLetter(tag)}
                                                            </span>
                                                        ))}
                                                        {problem.tags?.length > 3 && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/20">
                                                                +{problem.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {difficultyPill(problem.difficulty)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-white/70">
                                                No problems match your filters. Try adjusting your search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-white/70">
                                Showing <span className="font-medium text-white">{(currentPage - 1) * problemsPerPage + 1}</span> to{' '}
                                <span className="font-medium text-white">{Math.min(currentPage * problemsPerPage, filteredProblems.length)}</span> of{' '}
                                <span className="font-medium text-white">{filteredProblems.length}</span> results
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors duration-200"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {pageNumbers.map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-white/50">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-1 rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;