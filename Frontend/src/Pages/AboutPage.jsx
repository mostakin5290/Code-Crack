import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { FiTarget, FiCode, FiUsers, FiAward } from 'react-icons/fi';

const AboutPage = () => {

    const teamMembers = [
        { name: 'Mostakin Mondal', role: 'Full Control', avatar: 'https://drive.google.com/file/d/1S3u3mLjusoV5noeGTpfXcaMF_B8qP5o3/view' }
    ];

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center text-white">
            <Header />

            <main className="py-20">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto px-4">
                    <h1 className="text-5xl font-extrabold text-white sm:text-6xl animate-fade-in-down">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            CodeCrack:
                        </span>
                        <span> Sharpening the World's Coders</span>
                    </h1>
                    <p className="mt-6 text-xl text-white/80 animate-fade-in-down animate-delay-100">
                        We are a passionate team dedicated to building the best platform for developers to hone their skills, prepare for interviews, and connect with a global community.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="max-w-5xl mx-auto mt-20 px-4">
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-12 text-center">
                        <FiTarget className="text-primary text-5xl mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-white/70">
                            Our mission is to create a comprehensive and accessible ecosystem for learning, practice, and competition. We believe that anyone with a passion for coding should have the tools to succeed and reach their full potential, regardless of their background.
                        </p>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto mt-20 px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center hover:-translate-y-2 transition-transform duration-300">
                            <FiCode className="text-primary text-4xl mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Vast Problem Library</h3>
                            <p className="text-white/70">Access thousands of problems curated from real-world interviews at top tech companies, spanning all major topics and difficulty levels.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center hover:-translate-y-2 transition-transform duration-300">
                            <FiAward className="text-primary text-4xl mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Live Contests</h3>
                            <p className="text-white/70">Compete in regular contests to benchmark your skills against others, improve your speed, and earn recognition in the community.</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 text-center hover:-translate-y-2 transition-transform duration-300">
                            <FiUsers className="text-primary text-4xl mx-auto mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">Thriving Community</h3>
                            <p className="text-white/70">Join discussions, share solutions, and learn from millions of other developers in our active community forums.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="max-w-7xl mx-auto mt-20 px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">Meet the Team</h2>
                    <div className="flex items-center justify-center gap-8">
                        {teamMembers.map(member => (
                            <div key={member.name} className=" flex flex-col bg-white/5 backdrop-blur-lg p-10 rounded-xl border border-white/20 text-center">
                                <img src={member.avatar} alt={member.name} className=" w-30 h-30 rounded-full flex items-center justify-center text-center mx-auto mb-4 border-2 border-primary" />
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-primary">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;