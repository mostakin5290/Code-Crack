import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { FaFileContract } from 'react-icons/fa';

const LegalPageLayout = ({ title, children }) => {
    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center text-white">
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 p-8 sm:p-12 shadow-2xl">
                    <div className="text-center mb-8">
                        <FaFileContract className="text-primary text-5xl mx-auto mb-4" />
                        <h1 className="text-4xl font-bold">{title}</h1>
                        <p className="text-white/60 mt-2">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    {/* The `prose` classes from Tailwind provide nice default styling for typography */}
                    <div className="prose prose-invert lg:prose-lg max-w-none text-white/80 prose-headings:text-white prose-a:text-primary hover:prose-a:text-secondary prose-strong:text-white/90">
                        {children}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LegalPageLayout;