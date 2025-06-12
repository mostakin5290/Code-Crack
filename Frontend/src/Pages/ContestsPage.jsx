import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import FeaturedContestCard from '../components/contests/FeaturedContestCard'; // New import
import { allContests, getContestStatusInfo } from '../data/mockContests';
import { FaClock, FaUsers, FaSearch, FaFilter } from 'react-icons/fa';

const formatDateTime = (date) => {
    return date.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const formatTimeDifference = (date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    if (diff <= 0) return 'Finished';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return 'Soon';
};

const ContestsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');

    const filteredContests = useMemo(() => {
        return allContests.filter(contest => {
            const matchesSearch = contest.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All' || contest.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [searchTerm, typeFilter]);

    const categorizedContests = useMemo(() => {
        const live = [];
        let upcoming = [];
        const past = [];

        filteredContests.forEach(contest => {
            const { status } = getContestStatusInfo(contest.startTime, contest.duration);
            if (status === 'Live') live.push(contest);
            else if (status === 'Upcoming') upcoming.push(contest);
            else past.push(contest);
        });

        upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        past.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        live.sort((a, b) => {
            const endA = new Date(a.startTime).getTime() + parseFloat(a.duration.split(" ")[0]) * 3600000;
            const endB = new Date(b.startTime).getTime() + parseFloat(b.duration.split(" ")[0]) * 3600000;
            return endA - endB;
        });

        const featuredContest = upcoming.length > 0 ? upcoming[0] : null;
        // If a contest is featured, don't show it in the "Upcoming" list as well
        if (featuredContest) {
            upcoming = upcoming.slice(1);
        }

        return { live, upcoming, past, featuredContest };
    }, [filteredContests]);

    const ContestCard = ({ contest }) => {
        const { status, timeReference } = getContestStatusInfo(contest.startTime, contest.duration);

        const stateStyles = {
            Live: {
                indicator: <span className="absolute top-3 right-3 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>,
                borderColor: 'border-red-500/50 hover:border-red-500',
                buttonClass: 'btn-error',
                buttonText: 'Join Now'
            },
            Upcoming: {
                indicator: null,
                borderColor: 'border-primary/30 hover:border-primary',
                buttonClass: 'btn-primary',
                buttonText: 'View & Register'
            },
            Ended: {
                indicator: null,
                borderColor: 'border-white/20 hover:border-white/40',
                buttonClass: 'btn-outline border-white/30',
                buttonText: 'View Results'
            }
        };

        const currentStyle = stateStyles[status];
        
        return (
            <div className={`relative bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border ${currentStyle.borderColor} transition-all duration-300 flex flex-col group`}>
                {currentStyle.indicator}
                <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{contest.title}</h3>
                    <p className="text-sm text-white/60 mb-4">{formatDateTime(new Date(contest.startTime))}</p>
                    <div className="flex justify-between items-center text-sm text-white/80">
                        <div className="flex items-center gap-2"><FaClock /> {contest.duration}</div>
                        <div className="flex items-center gap-2"><FaUsers /> {contest.participants.toLocaleString()}</div>
                    </div>
                </div>
                <div className="p-6 pt-4 bg-black/20">
                    <Link to={`/contests/${contest.slug}`} className={`btn btn-sm w-full ${currentStyle.buttonClass}`}>
                        {currentStyle.buttonText}
                    </Link>
                </div>
            </div>
        );
    };

    const ContestSection = ({ title, contests }) => {
        if (!contests || contests.length === 0) return null;
        return (
            <section className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests.map(contest => <ContestCard key={contest.id} contest={contest} />)}
                </div>
            </section>
        );
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-white sm:text-6xl animate-fade-in-down">
                        Coding <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Contests</span>
                    </h1>
                    <p className="mt-4 text-xl text-white/80 animate-fade-in-down animate-delay-100">
                        Test your skills, climb the leaderboard, and win prizes.
                    </p>
                </header>

                {/* Featured Contest */}
                {categorizedContests.featuredContest && <FeaturedContestCard contest={categorizedContests.featuredContest} />}

                {/* Filters */}
                <div className="my-10 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                         <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search by contest name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full bg-white/5 pl-10"
                        />
                    </div>
                    <div className="relative flex-grow w-full md:w-auto">
                        <FaFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="select select-bordered w-full bg-white/5 pl-10"
                        >
                            <option value="All">All Types</option>
                            <option value="Rated">Rated</option>
                            <option value="Unrated">Unrated</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </div>
                </div>

                {/* Contest Lists */}
                <ContestSection title="Live Now" contests={categorizedContests.live} />
                <ContestSection title="Upcoming" contests={categorizedContests.upcoming} />
                <ContestSection title="Past Contests" contests={categorizedContests.past} />

                {filteredContests.length === 0 && (
                    <div className="text-center py-16 bg-white/5 rounded-xl">
                        <p className="text-2xl text-white/70">No contests match your filters.</p>
                        <p className="text-white/60 mt-2">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ContestsPage;