import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, checkAuth } from '../../features/auth/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Check auth status on component mount
    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/login');
            setIsMobileMenuOpen(false);
            setIsProfileMenuOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        // Close profile menu if mobile menu is opened
        if (!isMobileMenuOpen) {
            setIsProfileMenuOpen(false);
        }
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    // Common classes
    const navLinkBaseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300";
    const activeNavLinkClasses = "text-primary bg-white/10";
    const inactiveNavLinkClasses = "text-white hover:text-primary hover:bg-white/5";

    const getNavLinkClass = ({ isActive }) =>
        `${navLinkBaseClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`;

    // Mobile menu classes
    const mobileNavLinkBaseClasses = "block px-4 py-3 rounded-md text-base font-medium transition-colors duration-300";
    const getMobileNavLinkClass = ({ isActive }) =>
        `${mobileNavLinkBaseClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`;

    // User menu classes
    const userMenuLinkClasses = "block px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors duration-300";
    const mobileUserMenuLinkClasses = "block px-4 py-3 rounded-md text-base font-medium text-white hover:text-primary hover:bg-white/10";

    return (
        <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-100/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-base-100/80 backdrop-blur-sm border-b border-white/5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Desktop Nav Links */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link
                                to="/home"
                                className="flex items-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded"
                                onClick={closeAllMenus}
                            >
                                <span className="text-primary">Code</span>Crack
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-1">
                                <NavLink to="/home" className={getNavLinkClass} onClick={closeAllMenus}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/problems" className={getNavLinkClass} onClick={closeAllMenus}>
                                    Problems
                                </NavLink>
                                <NavLink to="/contests" className={getNavLinkClass} onClick={closeAllMenus}>
                                    Contests
                                </NavLink>
                                <NavLink to="/discuss" className={getNavLinkClass} onClick={closeAllMenus}>
                                    Discuss
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    {/* Desktop User Actions */}
                    {isAuthenticated ? (
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                                {/* Notification Button with Badge */}
                                <button
                                    type="button"
                                    className="relative p-1 rounded-full text-white hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
                                    onClick={closeAllMenus}
                                >
                                    <span className="sr-only">View notifications</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-base-100/95"></span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        type="button"
                                        className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
                                        onClick={toggleProfileMenu}
                                        aria-expanded={isProfileMenuOpen}
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className=" rounded-full  flex items-center justify-center">
                                            <img
                                                src={user?.avatar}
                                                alt={`${user?.firstName}'s avatar`}
                                                className="h-8 w-8 rounded-full mx-auto  shadow-lg object-cover"
                                            />
                                        </div>
                                        <span className="ml-2 text-white text-sm font-medium hidden lg:inline-flex items-center">
                                            {user?.firstName || 'User'}
                                            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-base-100/95 backdrop-blur-lg border border-white/10 z-50"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="user-menu"
                                        >
                                            <div className="px-4 py-3 border-b border-white/10">
                                                <p className="text-sm text-white font-medium">{user?.firstName} {user?.lastName}</p>
                                                <p className="text-sm text-white/70 truncate">{user?.email}</p>
                                            </div>
                                            <NavLink
                                                to="/profile"
                                                className={userMenuLinkClasses}
                                                onClick={closeAllMenus}
                                                role="menuitem"
                                            >
                                                Your Profile
                                            </NavLink>
                                            <NavLink
                                                to="/settings"
                                                className={userMenuLinkClasses}
                                                onClick={closeAllMenus}
                                                role="menuitem"
                                            >
                                                Settings
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className={`${userMenuLinkClasses} w-full text-left`}
                                                role="menuitem"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <NavLink
                                to="/login"
                                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-primary hover:bg-white/5 transition-colors duration-300"
                                onClick={closeAllMenus}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors duration-300"
                                onClick={closeAllMenus}
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        {/* Show notification icon for authenticated users */}
                        {isAuthenticated && (
                            <button
                                type="button"
                                className="p-1 mr-2 rounded-full text-white hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                onClick={closeAllMenus}
                            >
                                <span className="sr-only">View notifications</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                        )}

                        <button
                            onClick={toggleMobileMenu}
                            type="button"
                            className="bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-primary hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-base-100/95 backdrop-blur-lg shadow-xl`}
                id="mobile-menu"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavLink
                        to="/home"
                        className={getMobileNavLinkClass}
                        onClick={closeAllMenus}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/problems"
                        className={getMobileNavLinkClass}
                        onClick={closeAllMenus}
                    >
                        Problems
                    </NavLink>
                    <NavLink
                        to="/contests"
                        className={getMobileNavLinkClass}
                        onClick={closeAllMenus}
                    >
                        Contests
                    </NavLink>
                    <NavLink
                        to="/discuss"
                        className={getMobileNavLinkClass}
                        onClick={closeAllMenus}
                    >
                        Discuss
                    </NavLink>
                </div>

                {/* Mobile User Actions */}
                {isAuthenticated ? (
                    <div className="pt-4 pb-3 border-t border-white/10">
                        <div className="flex items-center px-5">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{user?.firstName} {user?.lastName}</div>
                                <div className="text-sm font-medium text-white/70">{user?.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <NavLink
                                to="/profile"
                                className={mobileUserMenuLinkClasses}
                                onClick={closeAllMenus}
                            >
                                Your Profile
                            </NavLink>
                            <NavLink
                                to="/settings"
                                className={mobileUserMenuLinkClasses}
                                onClick={closeAllMenus}
                            >
                                Settings
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className={`${mobileUserMenuLinkClasses} w-full text-left`}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="pt-4 pb-3 border-t border-white/10 px-2 space-y-1">
                        <NavLink
                            to="/login"
                            className={getMobileNavLinkClass}
                            onClick={closeAllMenus}
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/signup"
                            className={`${mobileNavLinkBaseClasses} bg-primary hover:bg-primary/90 text-white`}
                            onClick={closeAllMenus}
                        >
                            Sign Up
                        </NavLink>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;