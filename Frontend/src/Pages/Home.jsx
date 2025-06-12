import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 

const Home = () => {
    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            {/* Navigation Bar */}
                <Header/>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary rounded-full opacity-10 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full opacity-10 animate-blob"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center">
                        <h1 className="text-5xl font-extrabold text-white sm:text-6xl sm:tracking-tight lg:text-7xl animate-fade-in-down">
                            <span className="block">Master Coding</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Crack the Challenges
                            </span>
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-white/80 animate-fade-in-down animate-delay-100">
                            Join the community of developers and improve your coding skills by solving real-world problems.
                        </p>
                        <div className="mt-10 flex justify-center space-x-4 animate-fade-in-up animate-delay-200">
                            <Link
                                to="/problems"
                                className="btn btn-primary px-8 py-3 text-base font-medium rounded-full bg-gradient-to-r from-primary to-secondary border-none hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                            >
                                Start Solving
                            </Link>
                            <Link
                                to="/contests"
                                className="btn btn-outline px-8 py-3 text-base font-medium rounded-full text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                            >
                                Join Contest
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-white/5 backdrop-blur-lg border-t border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                            Features
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Why Choose CodeCrack?
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-100">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-primary to-secondary text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-white">
                                    Curated Challenges
                                </h3>
                                <p className="mt-2 text-base text-white/70">
                                    Hand-picked problems from top tech companies to help you prepare for technical interviews.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-200">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-primary to-secondary text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-white">
                                    Real-time Execution
                                </h3>
                                <p className="mt-2 text-base text-white/70">
                                    Write, compile and run code in multiple languages with our powerful online editor.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-300">
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-primary to-secondary text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="mt-6 text-lg font-medium text-white">
                                    Detailed Solutions
                                </h3>
                                <p className="mt-2 text-base text-white/70">
                                    Learn from community solutions and discussions to improve your problem-solving skills.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problem Categories */}
            <div className="py-16 bg-base-100/10 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Problem Categories
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
                            Practice problems categorized by difficulty and topics
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Category 1 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-100">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h3 className="text-lg font-medium text-white">
                                            Data Structures
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            150+ problems
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-white/80">
                                        <span>Easy</span>
                                        <span>50</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: '33%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Medium</span>
                                        <span>75</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Hard</span>
                                        <span>25</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: '17%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/problems/data-structures"
                                        className="btn btn-sm btn-outline w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                                    >
                                        View Problems
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Category 2 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h3 className="text-lg font-medium text-white">
                                            Algorithms
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            200+ problems
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-white/80">
                                        <span>Easy</span>
                                        <span>60</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: '30%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Medium</span>
                                        <span>100</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: '50%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Hard</span>
                                        <span>40</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: '20%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/problems/algorithms"
                                        className="btn btn-sm btn-outline w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                                    >
                                        View Problems
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Category 3 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-300">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-5">
                                        <h3 className="text-lg font-medium text-white">
                                            Database
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            80+ problems
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <div className="flex justify-between text-sm text-white/80">
                                        <span>Easy</span>
                                        <span>30</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: '38%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Medium</span>
                                        <span>35</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ width: '44%' }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-white/80 mt-2">
                                        <span>Hard</span>
                                        <span>15</span>
                                    </div>
                                    <div className="mt-1 w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ width: '19%' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/problems/database"
                                        className="btn btn-sm btn-outline w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                                    >
                                        View Problems
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Contests */}
            <div className="py-16 bg-white/5 backdrop-blur-lg border-t border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                            Contests
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Upcoming Coding Challenges
                        </p>
                    </div>

                    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Contest 1 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-100">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">
                                            Weekly Contest 245
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            June 12, 2023 • 1.5 hours
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        Free
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm text-white/80">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Starts in 2 days
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/contests/weekly-245"
                                        className="btn btn-sm btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                    >
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Contest 2 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">
                                            Biweekly Contest 58
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            June 19, 2023 • 2 hours
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        Free
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm text-white/80">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Starts in 9 days
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/contests/biweekly-58"
                                        className="btn btn-sm btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                    >
                                        Register Now
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Contest 3 */}
                        <div className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-primary/50 transition-all duration-300 animate-fade-in-up animate-delay-300">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">
                                            CodeCrack Championship
                                        </h3>
                                        <p className="mt-1 text-sm text-white/70">
                                            July 1, 2023 • 3 hours
                                        </p>
                                    </div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                                        Premium
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center text-sm text-white/80">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Starts in 21 days
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link
                                        to="/contests/championship"
                                        className="btn btn-sm btn-primary w-full bg-gradient-to-r from-primary to-secondary border-none"
                                    >
                                        Upgrade & Register
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            to="/contests"
                            className="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                        >
                            View All Contests
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer/>
        </div>
    );
};

export default Home;