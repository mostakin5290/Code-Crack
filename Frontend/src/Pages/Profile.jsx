import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaUser, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaTrophy, FaCode, FaClipboardList, FaCheck } from 'react-icons/fa';
import Header from '../components/layout/Header';
import axiosClient from '../api/axiosClient';
import { format, subYears, eachDayOfInterval, formatISO, getDay } from 'date-fns';

function ProfilePage() {
    const { userId: routeUserId } = useParams();
    const { user: loggedInUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userIdToFetch = routeUserId || loggedInUser?._id;

    useEffect(() => {
        if (!userIdToFetch) {
            setLoading(false);
            setError("No user to display. Please log in or provide a user ID.");
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            setError(null);
            try {
                const profileResponse = await axiosClient.get(`/user/allDetails/${userIdToFetch}`);
                
                let submissionsData = [];
                try {
                    const submissionsResponse = await axiosClient.get(`/submission/getAll`, {
                        params: { userId: userIdToFetch }
                    });
                    submissionsData = submissionsResponse.data.results || [];
                } catch (err) {
                    console.log("No submissions found for user, using empty array.");
                }

                if (profileResponse.data.success) {
                    setProfile(profileResponse.data.profile);
                    setSubmissions(submissionsData);
                } else {
                    setError("Failed to load profile data.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while fetching the profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [userIdToFetch]);

    const StatCard = ({ title, value, icon, subtext, colorClass }) => (
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-300">
            <div className="flex items-start space-x-4">
                <div className={`text-2xl p-3 rounded-full ${colorClass} bg-opacity-20`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-white/70">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    {subtext && <p className="text-xs text-white/50 mt-1">{subtext}</p>}
                </div>
            </div>
        </div>
    );

    const SubmissionHeatmap = ({ submissions = [] }) => {
        const today = new Date();
        const startDate = subYears(today, 1);

        const submissionCounts = submissions.reduce((acc, sub) => {
            const date = formatISO(new Date(sub.createdAt), { representation: 'date' });
            if (sub.status === 'Accepted') {
                acc[date] = (acc[date] || 0) + 1;
            }
            return acc;
        }, {});

        const daysGroupedByMonth = eachDayOfInterval({ start: startDate, end: today }).reduce((acc, day) => {
            const month = format(day, 'MMM yyyy');
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(day);
            return acc;
        }, {});
        
        // Corrected color logic: darker for more submissions
        const getColor = (count) => {
            if (count > 8) return 'bg-green-400';
            if (count > 5) return 'bg-green-500';
            if (count > 2) return 'bg-green-600';
            if (count > 0) return 'bg-green-700';
            return 'bg-gray-700';
        };

        const acceptedCount = submissions.filter(s => s.status === 'Accepted').length;

        return (
            <div className="bg-white/5 p-6 rounded-xl border border-gray-700 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-4">
                    {acceptedCount} accepted submission{acceptedCount !== 1 ? 's' : ''} in the last year
                </h3>
                <div className="flex gap-x-3 overflow-x-auto pb-4">
                    {Object.entries(daysGroupedByMonth).map(([month, daysInMonth]) => {
                        const firstDayOfMonth = daysInMonth[0];
                        const firstDayOffset = getDay(firstDayOfMonth);

                        return (
                            <div key={month} className="flex flex-col">
                                <div className="text-xs text-gray-400 mb-2 h-4">{month.split(' ')[0]}</div>
                                <div className="grid grid-flow-col grid-rows-7 gap-1">
                                    {Array.from({ length: firstDayOffset }).map((_, index) => (
                                        <div key={`empty-${month}-${index}`} className="w-3.5 h-3.5 rounded-sm" />
                                    ))}
                                    {daysInMonth.map(day => {
                                        const dateString = formatISO(day, { representation: 'date' });
                                        const count = submissionCounts[dateString] || 0;
                                        return (
                                            <div
                                                key={dateString}
                                                className={`w-3.5 h-3.5 rounded-sm ${getColor(count)}`}
                                                title={`${count} submission${count !== 1 ? 's' : ''} on ${format(day, 'MMM d, yyyy')}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const ActivityItem = ({ submission }) => (
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
            <div className="font-medium text-white">
                <Link to={`/codefield/${submission.problemId}`} className="hover:text-primary">
                    {submission.problem?.title || 'Solved a problem'}
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded ${submission.status === 'Accepted' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                    {submission.status}
                </span>
                <span className="text-sm text-white/50">
                    {format(new Date(submission.createdAt), 'MMM d, yyyy')}
                </span>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex justify-center items-center">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex justify-center items-center text-red-400">
                {error}
            </div>
        );
    }
    
    if (!profile) {
        return (
             <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex justify-center items-center text-yellow-400">
                Profile not found.
            </div>
        )
    }

    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    const totalSubmissions = submissions.length;
    const uniqueAcceptedProblems = new Set(acceptedSubmissions.map(sub => sub.problemId).filter(Boolean)).size;
    const joinedYear = new Date(profile.createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const activationYears = Math.max(0, currentYear - joinedYear);

    return (
        <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-10'><Header /></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center">
                            <img
                                src={profile.avatar}
                                alt={`${profile.firstName}'s avatar`}
                                className="w-32 h-32 rounded-full mx-auto border-4 border-primary shadow-lg object-cover"
                            />
                            <h1 className="text-3xl font-bold text-white mt-4">
                                {profile.firstName} {profile.lastName}
                            </h1>
                            <p className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-1">
                                {profile.headline}
                            </p>

                            <div className="mt-6 flex flex-col space-y-2">
                                <div className="flex items-center justify-center text-sm text-white/80">
                                    <FaUser className="mr-2" />
                                    <span>Member for {activationYears} year{activationYears !== 1 ? 's' : ''}</span>
                                </div>
                                {profile.location && (
                                    <div className="flex items-center justify-center text-sm text-white/80">
                                        <FaMapMarkerAlt className="mr-2" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                            </div>

                            {loggedInUser?._id === profile._id && (
                                <Link
                                    to="/settings"
                                    className="btn btn-primary btn-outline btn-sm mt-6 border-white/20 hover:border-primary/50 hover:bg-primary/10"
                                >
                                    Edit Profile
                                </Link>
                            )}
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                            {profile.bio ? (
                                <p className="text-white/80">{profile.bio}</p>
                            ) : (
                                <p className="text-white/50 italic">No bio yet</p>
                            )}

                            {(profile.socialLinks && Object.values(profile.socialLinks).some(link => link)) && (
                                <>
                                    <h3 className="text-lg font-semibold text-white mt-6 mb-3">Connect</h3>
                                    <div className="flex items-center space-x-4 text-xl">
                                        {profile.socialLinks.github && (
                                            <a
                                                href={profile.socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/70 hover:text-primary transition-colors duration-200"
                                            >
                                                <FaGithub />
                                            </a>
                                        )}
                                        {profile.socialLinks.linkedin && (
                                            <a
                                                href={profile.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/70 hover:text-primary transition-colors duration-200"
                                            >
                                                <FaLinkedin />
                                            </a>
                                        )}
                                        {profile.socialLinks.twitter && (
                                            <a
                                                href={profile.socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/70 hover:text-primary transition-colors duration-200"
                                            >
                                                <FaTwitter />
                                            </a>
                                        )}
                                        {profile.socialLinks.website && (
                                            <a
                                                href={profile.socialLinks.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white/70 hover:text-primary transition-colors duration-200"
                                            >
                                                <FaGlobe />
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard
                                title="Problems Solved"
                                value={uniqueAcceptedProblems}
                                icon={<FaCheck />}
                                colorClass="text-green-500"
                            />
                            <StatCard
                                title="Total Submissions"
                                value={totalSubmissions}
                                icon={<FaClipboardList />}
                                colorClass="text-blue-500"
                            />
                            <StatCard
                                title="Acceptance Rate"
                                value={totalSubmissions > 0
                                    ? `${Math.round((acceptedSubmissions.length / totalSubmissions) * 100)}%`
                                    : '0%'}
                                icon={<FaTrophy />}
                                colorClass="text-yellow-500"
                            />
                        </div>

                        <SubmissionHeatmap submissions={submissions} />

                        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/20">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                            {submissions.length > 0 ? (
                                <div className="space-y-2">
                                    {submissions
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .slice(0, 5)
                                        .map(sub => (
                                            <ActivityItem
                                                key={sub._id}
                                                submission={sub}
                                            />
                                        ))}
                                </div>
                            ) : (
                                <p className="text-white/50 text-center py-4">No submissions yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;