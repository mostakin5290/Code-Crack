import React from 'react';

// You can keep this component in its own file or move it here.
// For simplicity, I'm putting it in the same file.
const AnimatedLogo = () => {
    return (
        <div className="flex-shrink-0">
            <div
                className="flex items-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded">
                <span className="text-primary">Code</span>Crack
            </div>
        </div>
    );
};


const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div
            className="flex flex-col justify-center items-center h-full p-4 space-y-6 bg-gray-900/50"
            aria-label="Loading content"
        >
            <AnimatedLogo />
            <p className="text-sm text-gray-500 animate-pulse tracking-widest">
                {message}
            </p>
        </div>
    );
};

export default LoadingSpinner;