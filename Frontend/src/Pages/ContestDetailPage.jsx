import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Countdown from '../components/contests/Countdown';
import Leaderboard from '../components/contests/Leaderboard';
import { allContests, getContestStatusInfo } from '../data/mockContests'; // Using shared mock data
import { FaClock, FaListOl, FaExclamationTriangle, FaTrophy, FaHourglassHalf } from 'react-icons/fa';

const ContestDetailPage = () => {
    const { slug } = useParams();
    const contest = allContests.find(c => c.slug === slug);

    if (!contest) {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white">Contest Not Found</h1>
                    <p className="text-white/70 mt-2">The contest you are looking for does not exist.</p>
                    <Link to="/contests" className="btn btn-primary mt-6">Back to Contests</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const { status, timeReference } = getContestStatusInfo(contest.startTime, contest.duration);

    const ProblemRow = ({ problem }) => {
        const difficultyColor = {
            easy: 'text-green-400',
            medium: 'text-yellow-400',
            hard: 'text-red-400',
        };
        return (
            <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Link to={`/codefield/${problem.id}`} className="font-medium text-white hover:text-primary col-span-2">
                    {problem.title}
                </Link>
                <div className={`font-semibold ${difficultyColor[problem.difficulty]}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-white sm:text-6xl">{contest.title}</h1>
                    <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">{contest.description}</p>
                </header>

                <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-8">
                    {status === 'Upcoming' && (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3"><FaClock className="text-primary" />Contest Starts In</h2>
                            <Countdown targetDate={timeReference} />
                            <button className="btn btn-primary btn-lg">Register Now</button>
                        </div>
                    )}

                    {status === 'Live' && (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-red-500 animate-pulse flex items-center justify-center gap-3"><FaHourglassHalf />Contest is Live!</h2>
                                <p className="text-white/80 mt-2">Time Remaining:</p>
                                <Countdown targetDate={timeReference} />
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3"><FaListOl /> Problems</h3>
                                <div className="space-y-2">
                                    {contest.problems.map(p => <ProblemRow key={p.id} problem={p} />)}
                                </div>
                            </div>
                        </div>
                    )}

                    {status === 'Ended' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3"><FaTrophy className="text-yellow-400" />Contest Ended</h2>
                                <p className="text-white/70 mt-2">See the final results and review the problems.</p>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><FaListOl /> Problems</h3>
                                <div className="space-y-2">
                                    {contest.problems.map(p => <ProblemRow key={p.id} problem={p} />)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3"><FaTrophy /> Final Leaderboard</h3>
                                <Leaderboard rankings={contest.rankings} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContestDetailPage;