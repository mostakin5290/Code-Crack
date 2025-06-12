import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { FaUsers, FaListAlt, FaPaperPlane } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StatCard = ({ icon, title, value, color }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl border border-white/20 shadow-lg`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-lg font-medium text-white/80">{title}</p>
                <p className="text-4xl font-extrabold text-white">{value}</p>
            </div>
            <div className="text-5xl text-white/30">{icon}</div>
        </div>
    </div>
);

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosClient.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.totalUsers ?? '0'}
                    icon={<FaUsers />}
                    color="from-blue-500/30 to-blue-600/30"
                />
                <StatCard
                    title="Total Problems"
                    value={stats?.totalProblems ?? '0'}
                    icon={<FaListAlt />}
                    color="from-green-500/30 to-green-600/30"
                />
                <StatCard
                    title="Total Submissions"
                    value={stats?.totalSubmissions ?? '0'}
                    icon={<FaPaperPlane />}
                    color="from-purple-500/30 to-purple-600/30"
                />
            </div>
            <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/20">
                <h2 className="text-2xl font-bold text-white">Welcome, Admin!</h2>
                <p className="text-white/70 mt-2">
                    This is your control center. From here you can manage users, add or edit coding problems, and update site content.
                </p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;