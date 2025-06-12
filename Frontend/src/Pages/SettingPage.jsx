import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setUser } from '../features/auth/authSlice';
import Header from "../components/layout/Header";
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        headline: '',
        bio: '',
        location: '',
        avatar: '',
        github: '',
        linkedin: '',
        twitter: '',
        website: '',
        language: 'javascript',
        theme: 'vs-dark'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    // Delete account modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    // Loading states
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Initialize form data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                headline: user.headline || '',
                bio: user.bio || '',
                location: user.location || '',
                avatar: user.avatar || '',
                github: user.socialLinks?.github || '',
                linkedin: user.socialLinks?.linkedin || '',
                twitter: user.socialLinks?.twitter || '',
                website: user.socialLinks?.website || '',
                language: user.preferences?.language || 'javascript',
                theme: user.preferences?.theme || 'vs-dark'
            });
        }
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // Form submission handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        
        try {
            // Prepare data for backend
            const dataToSend = {
                ...formData,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    twitter: formData.twitter,
                    website: formData.website
                },
                preferences: {
                    language: formData.language,
                    theme: formData.theme
                }
            };

            const { data } = await axiosClient.put('/user/profile', dataToSend);
            dispatch(setUser(data.user));
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        
        setIsChangingPassword(true);
        try {
            await axiosClient.put('/user/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeletePassword('');
        setDeleteConfirmation('');
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeletePassword('');
        setDeleteConfirmation('');
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'delete my account') {
            toast.error("Please type 'delete my account' to confirm");
            return;
        }

        setIsDeleting(true);
        try {
            await axiosClient.delete('/user/account', { data: { password: deletePassword } });
            toast.success('Account deleted successfully');
            dispatch(logoutUser());
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account.');
        } finally {
            setIsDeleting(false);
            closeDeleteModal();
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center flex items-center justify-center text-white">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-10'><Header /></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold text-white">Settings</h1>
                    <p className="text-lg text-white/70 mt-1">Manage your account and profile information.</p>
                </header>

                {/* Profile Information Form */}
                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-xl border border-white/20 mb-8 shadow-lg">
                    <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
                    
                    <div className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center space-x-4">
                            <img 
                                src={formData.avatar || 'https://via.placeholder.com/150'} 
                                alt="User Avatar" 
                                className="w-20 h-20 rounded-full border-2 border-primary bg-white/5 backdrop-blur-lg" 
                            />
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-white/80 mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="URL to your avatar image"
                                />
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="Your first name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="Your last name"
                                />
                            </div>
                        </div>

                        {/* Email (readonly) */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                            <input
                                type="email"
                                value={user.emailId}
                                readOnly
                                className="mt-1 block w-full bg-white/10 border border-white/20 text-white/70 rounded-lg shadow-sm py-2 px-3 sm:text-sm cursor-not-allowed"
                            />
                        </div>

                        {/* Headline */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Headline</label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="e.g., Full-Stack Developer"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Bio</label>
                            <textarea
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="e.g., San Francisco, CA"
                            />
                        </div>

                        {/* Social Links */}
                        <h3 className="text-xl font-semibold text-white pt-4 border-t border-white/20">Social Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">GitHub</label>
                                <input
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="github.com/your-username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="linkedin.com/in/your-profile"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Twitter</label>
                                <input
                                    type="text"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="twitter.com/your-handle"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                    placeholder="your-domain.com"
                                />
                            </div>
                        </div>

                        {/* Preferences */}
                        <h3 className="text-xl font-semibold text-white pt-4 border-t border-white/20">Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Default Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="c++">C++</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Editor Theme</label>
                                <select
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                >
                                    <option value="vs-dark">VS Dark</option>
                                    <option value="light">Light</option>
                                    <option value="monokai">Monokai</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-white/20">
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn bg-gradient-to-r from-primary to-secondary border-none text-white px-6 py-2.5 hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                            >
                                {isUpdating ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Change Password Form */}
                <form onSubmit={handlePasswordSubmit} className="bg-white/5 backdrop-blur-lg p-6 sm:p-8 rounded-xl border border-white/20 mb-8 shadow-lg">
                    <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="Enter your current password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="Enter your new password"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmNewPassword"
                                value={passwordData.confirmNewPassword}
                                onChange={handlePasswordChange}
                                className="mt-1 block w-full bg-white/5 backdrop-blur-lg border border-white/20 text-white rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                                placeholder="Confirm your new password"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-6 py-2.5 transition-all duration-300"
                            >
                                {isChangingPassword ? 'Updating...' : 'Change Password'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Delete Account Section */}
                <div className="bg-red-500/10 backdrop-blur-lg p-6 sm:p-8 rounded-xl border border-red-500/30 shadow-lg">
                    <h2 className="text-2xl font-semibold text-red-300 mb-4">Delete Account</h2>
                    <p className="text-sm text-red-200/80 mb-6">
                        Once you delete your account, this action cannot be undone. All your data will be permanently removed. Please be certain.
                    </p>
                    <button
                        onClick={openDeleteModal}
                        className="btn bg-red-600 hover:bg-red-700 border-red-700 text-white px-6 py-2.5 transition-all duration-300"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-xl border border-red-500/30 w-full max-w-md">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-red-400 mb-2">Delete Account</h2>
                            <p className="text-gray-300 mb-4">
                                This action is irreversible. All your data will be permanently deleted. To confirm, please enter your password and type "delete my account" below.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={deletePassword}
                                        onChange={(e) => setDeletePassword(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Enter your password"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Type <span className="font-mono text-red-400">delete my account</span> to confirm
                                    </label>
                                    <input
                                        type="text"
                                        value={deleteConfirmation}
                                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="delete my account"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={closeDeleteModal}
                                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center"
                                    disabled={isDeleting}
                                >
                                    {isDeleting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isDeleting ? 'Deleting...' : 'Delete Account Permanently'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;