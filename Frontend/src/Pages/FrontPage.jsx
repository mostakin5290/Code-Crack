import React from 'react';
import { FiSearch, FiTrendingUp, FiCode, FiAward, FiUsers, FiStar, FiZap } from 'react-icons/fi';

const FrontPage = () => {
    const stats = [
        { value: '1500+', label: 'Problems', icon: <FiCode className="text-xl" /> },
        { value: '5M+', label: 'Users', icon: <FiUsers className="text-xl" /> },
        { value: '300+', label: 'Contests', icon: <FiAward className="text-xl" /> },
        { value: '95%', label: 'Satisfaction', icon: <FiTrendingUp className="text-xl" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-900 bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center p-4 md:p-8">
            {/* Animated background elements */}
            <div className="fixed -top-20 -left-20 w-64 h-64 bg-purple-500 rounded-full opacity-10 animate-blob animation-delay-2000"></div>
            <div className="fixed -bottom-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 animate-blob animation-delay-4000"></div>
            <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-teal-500 rounded-full opacity-10 animate-blob"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white bg-white/10 backdrop-blur-lg px-6 py-3 rounded-lg border border-white/20">
                        Code<span className="text-primary">Crack</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button className="btn  border-none text-white hover:-translate-y-1 transition-transform flex items-center">
                            <FiStar className="mr-2" />
                            <a href="/" className="font-medium text-white transition-colors duration-200">
                                Premium
                            </a>
                        </button>
                        <button className="btn btn-ghost text-white hover:bg-white/10">
                            <a href="/" className="font-medium text-white transition-colors duration-200">
                                Explore
                            </a>
                        </button>
                        <button className="btn btn-ghost text-white hover:bg-white/10">
                            <a href="/login" className="font-medium text-white transition-colors duration-200">
                                Login
                            </a>
                        </button>
                        <button className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none text-white hover:-translate-y-1 transition-transform">
                            <a href="/signup" className="font-medium text-white transition-colors duration-200">
                                Sign up
                            </a>
                        </button>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="mb-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                CodeCrack Interviews
                            </h2>
                            <p className="text-white/80 mb-6 text-lg">
                                Practice with our collection of coding challenges and ace your next technical interview.
                            </p>
                            {/* <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search problems..."
                                    className="input input-bordered w-full bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-white/40 pl-12"
                                />
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                            </div> */}
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <div className="grid grid-cols-2 gap-4">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="text-primary mb-2">{stat.icon}</div>
                                        <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                        <p className="text-white/70">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Description */}
                <section className="mb-12 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">About Our Platform</h2>
                        <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/20">
                            <FiZap className="text-primary text-3xl mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-white/80">
                                CodeCrack is designed to help developers of all levels sharpen their problem-solving skills and prepare for technical interviews.
                                We provide a curated collection of coding challenges that mirror real-world interview questions from top tech companies.
                            </p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-xl border border-white/20">
                            <FiTrendingUp className="text-primary text-3xl mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Why Choose Us</h3>
                            <p className="text-white/80">
                                With our interactive coding environment, personalized learning paths, and detailed solution explanations,
                                we make the journey from beginner to interview-ready smoother than ever. Join our community of millions
                                of developers who trust CodeCrack for their interview preparation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
                        <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                            <div className="text-primary text-2xl mb-3">01</div>
                            <h3 className="text-xl font-bold text-white mb-2">Interactive Coding</h3>
                            <p className="text-white/70">
                                Write, run, and test your code directly in the browser with our powerful IDE.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                            <div className="text-primary text-2xl mb-3">02</div>
                            <h3 className="text-xl font-bold text-white mb-2">Detailed Solutions</h3>
                            <p className="text-white/70">
                                Access comprehensive explanations and optimal solutions for every problem.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:border-primary/50 transition-all hover:-translate-y-1">
                            <div className="text-primary text-2xl mb-3">03</div>
                            <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
                            <p className="text-white/70">
                                Monitor your improvement with detailed statistics and personalized reports.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Coding?</h2>
                    <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                        Join our community of developers and take your coding skills to the next level.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button className="btn btn-primary bg-gradient-to-r from-primary to-secondary border-none text-white hover:-translate-y-1 transition-transform">
                            Explore Problems
                        </button>
                        <button className="btn btn-outline border-white/20 text-white hover:bg-white/10">
                            Learn More
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FrontPage;