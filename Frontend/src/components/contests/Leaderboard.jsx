import React from 'react';
import { FaTrophy, FaUserCircle } from 'react-icons/fa';

const Leaderboard = ({ rankings }) => {
    if (!rankings || rankings.length === 0) {
        return <div className="text-center p-8 text-white/70">Leaderboard data is not available.</div>;
    }

    const rankColor = (rank) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-yellow-600';
        return 'text-white/80';
    };

    return (
        <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/20 p-4">
            <table className="table w-full">
                {/* head */}
                <thead>
                    <tr>
                        <th className="text-white/80">Rank</th>
                        <th className="text-white/80">User</th>
                        <th className="text-white/80">Score</th>
                        <th className="text-white/80">Finish Time</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((entry) => (
                        <tr key={entry.rank} className="hover:bg-white/10 transition-colors">
                            <td className={`font-bold text-lg ${rankColor(entry.rank)}`}>
                                {entry.rank <= 3 ? <FaTrophy className="inline mr-2" /> : ''}
                                {entry.rank}
                            </td>
                            <td>
                                <div className="flex items-center gap-3">
                                    <FaUserCircle className="text-2xl text-primary" />
                                    <span className="font-medium text-white">{entry.user}</span>
                                </div>
                            </td>
                            <td className="font-mono text-white/90">{entry.score}</td>
                            <td className="font-mono text-white/70">{entry.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;