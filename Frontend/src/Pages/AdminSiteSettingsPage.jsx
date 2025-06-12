import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AdminSiteSettingsPage = () => {
    const [aboutContent, setAboutContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const { data } = await axiosClient.get('/admin/site-content/about');
                setAboutContent(data.content);
            } catch (error) {
                toast.error("Could not fetch site content.");
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await axiosClient.put('/admin/site-content/about', { content: aboutContent });
            toast.success("About page content updated successfully!");
        } catch (error) {
            toast.error("Failed to save content.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading settings..." />;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-4">About Page Content</h2>
            <p className="text-white/70 mb-6">
                Edit the content for the public "About Us" page. You can use Markdown for formatting.
            </p>
            <div className="form-control">
                <textarea
                    className="textarea textarea-bordered h-96 bg-gray-900 text-white/90 font-mono text-base"
                    value={aboutContent}
                    onChange={(e) => setAboutContent(e.target.value)}
                    placeholder="Enter About Us content here..."
                ></textarea>
            </div>
            <div className="mt-6">
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={isSaving}
                >
                    {isSaving ? <span className="loading loading-spinner"></span> : 'Save Content'}
                </button>
            </div>
        </div>
    );
};

export default AdminSiteSettingsPage;