import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaList, FaPlus, FaUsers, FaCog } from 'react-icons/fa'; // Added new icons
import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 

const AdminLayout = () => {
    const linkClasses = "flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-white/10 transition-colors duration-200";
    const activeLinkClasses = "bg-primary text-white shadow-lg";
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin/users')) return "User Management";
        if (path.includes('/admin/problems/create')) return "Create New Problem";
        if (path.includes('/admin/problems/edit')) return "Edit Problem";
        if (path.includes('/admin/problems')) return "Problems Dashboard";
        if (path.includes('/admin/settings')) return "Site Settings";
        return "Admin Dashboard"; // Default
    };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-fixed text-white">
            <Header />
            
            <div className="max-w-7xl mx-auto px-4 py-8 gap-8 flex">
                {/* --- Sidebar --- */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 h-full sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6">Admin Menu</h2>
                        <nav className="space-y-2">
                            <NavLink to="/admin" end className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                <FaTachometerAlt className="mr-3" /> Dashboard
                            </NavLink>
                            <NavLink to="/admin/users" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                <FaUsers className="mr-3" /> Users
                            </NavLink>
                            <NavLink to="/admin/problems" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                <FaList className="mr-3" /> Problems List
                            </NavLink>
                            <NavLink to="/admin/problems/create" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                <FaPlus className="mr-3" /> Create Problem
                            </NavLink>
                             <NavLink to="/admin/settings" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                                <FaCog className="mr-3" /> Site Settings
                            </NavLink>
                        </nav>
                    </div>
                </aside>

                {/* --- Main Content --- */}
                <main className="flex-1">
                    <div className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-xl border border-white/20 min-h-[75vh]">
                        <h1 className="text-3xl font-bold mb-6 text-primary">{getPageTitle()}</h1>
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AdminLayout;