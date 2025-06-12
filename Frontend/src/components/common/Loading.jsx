import React from 'react'

const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center space-y-6">
                {/* Animated gradient spinner */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary animate-spin-slow"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-accent border-l-info animate-spin-slow-reverse"></div>
                    <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-success border-r-warning animate-spin-medium"></div>

                    {/* Center logo or icon */}
                    <div className="absolute inset-6 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-white animate-pulse"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Loading text with animated dots */}
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        Authenticating
                        <span className="inline-block ml-1 animate-dots">
                            <span className="opacity-0">.</span>
                            <span className="animate-fade-in-out">.</span>
                            <span className="animate-fade-in-out animation-delay-200">.</span>
                        </span>
                    </h3>
                    <p className="text-white/70 text-sm">Securely connecting to your account</p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary animate-progress"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading



