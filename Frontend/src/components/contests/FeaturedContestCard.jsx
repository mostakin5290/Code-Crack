import React from 'react';
import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import { FaCalendarAlt, FaClock, FaUsers, FaTrophy } from 'react-icons/fa';

const FeaturedContestCard = ({ contest }) => {
    if (!contest) return null;

    const formatDateTime = (date) => {
        return date.toLocaleString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };
    
    return (
        <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl border border-primary/50 p-8 shadow-2xl overflow-hidden mb-12">
            {/* Background Glow */}
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side: Details */}
                <div>
                    <span className="text-primary font-semibold uppercase tracking-wider">Next Up</span>
                    <h2 className="text-4xl font-bold text-white mt-2 mb-4">{contest.title}</h2>
                    <p className="text-white/70 mb-6 text-lg">
                        {contest.description || 'Get ready for the next challenge. Sharpen your skills and compete!'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-white/90">
                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-primary"/>
                            <span>{formatDateTime(new Date(contest.startTime))}</span>
                        </div>
                         <div className="flex items-center gap-3">
                            <FaClock className="text-primary"/>
                            <span>{contest.duration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaTrophy className="text-primary"/>
                            <span className="capitalize">{contest.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaUsers className="text-primary"/>
                            <span>{contest.participants.toLocaleString()} Registered</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Countdown & Action */}
                <div className="text-center">
                    <h3 className="text-2xl font-semibold text-white mb-3">Starts In</h3>
                    <Countdown targetDate={contest.startTime} />
                    <Link to={`/contests/${contest.slug}`} className="btn btn-primary btn-lg w-full max-w-xs mt-4">
                        Register Now & View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedContestCard;