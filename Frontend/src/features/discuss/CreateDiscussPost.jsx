import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import MonacoEditor from '@monaco-editor/react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const CreateDiscussPost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    
    const [problemQuery, setProblemQuery] = useState('');
    const [searchedProblems, setSearchedProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchRef = useRef(null);

    // Debounced search for problems
    useEffect(() => {
        if (problemQuery.length < 2) {
            setSearchedProblems([]);
            return;
        }
        setIsSearching(true);
        const handler = setTimeout(() => {
            axiosClient.get(`/problem/search?q=${problemQuery}`)
                .then(response => setSearchedProblems(response.data))
                .catch(err => console.error("Problem search failed:", err))
                .finally(() => setIsSearching(false));
        }, 500);
        return () => clearTimeout(handler);
    }, [problemQuery]);
    
    const handleSelectProblem = (problem) => {
        setSelectedProblem(problem);
        setProblemQuery(problem.title);
        setSearchedProblems([]);
    };
    
    const clearSelectedProblem = () => {
        setSelectedProblem(null);
        setProblemQuery('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !selectedProblem) {
            toast.error("Please fill in the title, description, and select a problem.");
            return;
        }

        setIsSubmitting(true);
        try {
            const postData = {
                title,
                description,
                code,
                language,
                problemId: selectedProblem._id,
            };
            const { data } = await axiosClient.post('/discuss/create', postData);
            toast.success('Post created successfully!');
            navigate(`/discuss/create/${data.slug}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const editorOptions = { minimap: { enabled: false }, fontSize: 14 };

    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1672009190560-12e7bade8d09?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
            <div className='mb-10'><Header /></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-lg p-8 rounded-xl border border-white/20 space-y-6">
                    <h1 className="text-3xl font-bold text-white">Create a New Discussion Post</h1>
                    
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Link to a Problem *</label>
                        <div className="relative" ref={searchRef}>
                            <input 
                                type="text"
                                value={problemQuery}
                                onChange={(e) => setProblemQuery(e.target.value)}
                                placeholder="Search for a problem by title..."
                                disabled={!!selectedProblem}
                                className="input input-bordered w-full bg-white/10 !pr-10"
                            />
                            {selectedProblem ? (
                                <button type="button" onClick={clearSelectedProblem} className="absolute top-1/2 right-3 -translate-y-1/2 text-white/70 hover:text-red-400">
                                    <FaTimes />
                                </button>
                            ) : (
                                <FaSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-white/50" />
                            )}
                            
                            {searchedProblems.length > 0 && (
                                <ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-60 overflow-y-auto">
                                    {searchedProblems.map(p => (
                                        <li 
                                            key={p._id}
                                            onClick={() => handleSelectProblem(p)}
                                            className="px-4 py-2 hover:bg-primary/20 cursor-pointer text-white"
                                        >
                                            {p.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">Post Title *</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full bg-white/10" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Description *</label>
                        <div className="h-48 border border-white/20 rounded-md overflow-hidden">
                            <MonacoEditor language="markdown" theme="vs-dark" value={description} onChange={setDescription} options={editorOptions} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">Code Snippet (Optional)</label>
                        <div className="flex gap-2 mb-2">
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="select select-sm select-bordered bg-white/10">
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                            </select>
                        </div>
                        <div className="h-60 border border-white/20 rounded-md overflow-hidden">
                            <MonacoEditor language={language} theme="vs-dark" value={code} onChange={setCode} options={editorOptions} />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? <span className="loading loading-spinner"></span> : "Create Post"}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default CreateDiscussPost;