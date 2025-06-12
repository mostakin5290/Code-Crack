import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import { FaCheck, FaTimes, FaRegCopy, FaPlay, FaExpand, FaCompress, FaSyncAlt, FaHistory, FaBookmark, FaList, FaArrowLeft } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import Header from '../components/layout/Header';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';
import * as themes from '../utils/themes';

const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const ProblemPanel = ({ problem, activeTab, setActiveTab, submissionHistory, testResults, setTestResults }) => {
    const difficultyColorMap = { easy: 'text-green-600', medium: 'text-yellow-600', hard: 'text-red-600' };
    const statusColorMap = {
        'Accepted': 'text-green-400',
        'Wrong Answer': 'text-red-400',
        'Runtime Error': 'text-red-400',
        'Time Limit Exceeded': 'text-yellow-400',
        'Compilation Error': 'text-red-400',
        'Memory Limit Exceeded': 'text-yellow-400',
        'Submission Error': 'text-red-400'
    };

    return (
        <div className="flex flex-col w-full h-full bg-gray-800 border-r border-gray-700 overflow-hidden">
            <div className="p-4 sticky top-0 bg-gray-800 z-10 border-b border-gray-700">
                <div className="flex space-x-2">
                    {['Description', 'Solutions', 'Submissions'].map(tabName => (
                        <button
                            key={tabName}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                activeTab === tabName.toLowerCase()
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                            onClick={() => setActiveTab(tabName.toLowerCase())}
                        >
                            {tabName}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'description' && <ProblemDescription problem={problem} difficultyColorMap={difficultyColorMap} />}
                {activeTab === 'solutions' && (
                    <div className="p-4">
                        <div className="border-b border-gray-700 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-white">Solutions</h3>
                            <div className="text-gray-400 mt-2">
                                <div className="flex items-center justify-between py-2">
                                    <span>C++</span>
                                    <span className="text-sm text-gray-500">Auto</span>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-md">
                                    <pre className="text-sm text-gray-300">
                                        {`class Solution {
public:
    vector<int> partitionLabels(string s) {
        // Implementation goes here
    }
};`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md font-bold text-white mb-2">Text Result</h4>
                            <div className="text-gray-400 text-sm">
                                Sample result explanation would appear here.
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'submissions' && (
                    <div className="p-4">
                        {testResults ? (
                            <SubmissionResultDetails testResults={testResults} setTestResults={setTestResults} />
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-white mb-4">Submission History</h3>
                                {submissionHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {submissionHistory.map((submission) => (
                                            <div 
                                                key={submission._id} 
                                                className="bg-gray-900/50 p-3 rounded-md border border-gray-700 hover:bg-gray-800 cursor-pointer"
                                                onClick={() => setTestResults(submission)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className={`font-medium ${statusColorMap[submission.status] || 'text-gray-400'}`}>
                                                            {submission.status}
                                                        </span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(submission.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-300">
                                                            {capitalizeFirstLetter(submission.language)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {submission.runtime} · {submission.memory}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-400">No submissions yet.</div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const ProblemDescription = ({ problem, difficultyColorMap }) => (
    <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-2">{problem.title}</h1>
        <div className="flex items-center space-x-4 mb-6">
            <span className={`px-2 py-1 text-xs text-white font-semibold rounded-full bg-opacity-20 ${difficultyColorMap[problem.difficulty.toLowerCase()]?.replace('text-', 'bg-')} ${difficultyColorMap[problem.difficulty.toLowerCase()]}`}>
                {capitalizeFirstLetter(problem.difficulty)}
            </span>
            <span className="text-sm text-gray-400">ID: {problem._id}</span>
        </div>
        <div className="prose prose-invert max-w-none text-gray-300">
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: problem.description }}></div>
            {problem.visibleTestCases?.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold text-white mt-8 mb-3">Examples</h3>
                    {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-4 mt-3 border border-gray-700">
                            <strong className="text-white">Example {index + 1}:</strong>
                            <div className="mt-3 space-y-3 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-400">Input:</span>
                                    <pre className="mt-1 p-2 bg-gray-800 rounded overflow-x-auto">
                                        {JSON.stringify(example.input, null, 2)}
                                    </pre>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-400">Output:</span>
                                    <pre className="mt-1 p-2 bg-gray-800 rounded overflow-x-auto">
                                        {JSON.stringify(example.output, null, 2)}
                                    </pre>
                                </div>
                                {example.explanation && (
                                    <div>
                                        <span className="font-semibold text-gray-400">Explanation:</span>
                                        <p className="mt-1 p-2 bg-gray-800 rounded">{example.explanation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </>
            )}
            {problem.constraints && (
                <>
                    <h3 className="text-lg font-semibold text-white mt-8 mb-3">Constraints</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {problem.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                        ))}
                    </ul>
                </>
            )}
            {problem.tags?.length > 0 && (
                <>
                    <h3 className="text-lg font-semibold text-white mt-8 mb-3">Related Topics</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {problem.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline border-gray-600 text-gray-300 hover:bg-gray-700 cursor-pointer">
                                {capitalizeFirstLetter(tag)}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
);

const SubmissionResultDetails = ({ testResults, setTestResults }) => {
    const statusColorMap = {
        'Accepted': 'text-green-400',
        'Wrong Answer': 'text-red-400',
        'Runtime Error': 'text-red-400',
        'Time Limit Exceeded': 'text-yellow-400',
        'Compilation Error': 'text-red-400',
        'Memory Limit Exceeded': 'text-yellow-400',
        'Submission Error': 'text-red-400'
    };

    const formatRuntime = (runtime) => {
        if (runtime === undefined || runtime === null) return 'N/A';
        const timeInSeconds = parseFloat(runtime);
        if (isNaN(timeInSeconds)) return 'N/A';
        return timeInSeconds < 1 ? `${(timeInSeconds * 1000).toFixed(0)} ms` : `${timeInSeconds.toFixed(3)} s`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-start mb-4">
                <button 
                    onClick={() => setTestResults(null)}
                    className="btn btn-sm btn-ghost text-gray-400 hover:text-white"
                >
                    <FaArrowLeft className="mr-2"/> Back to History
                </button>
            </div>

            <div className={`p-4 rounded-lg ${testResults.status === "Accepted" ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className={`font-bold text-2xl ${statusColorMap[testResults.status] || 'text-white'}`}>
                            {testResults.status}
                        </h3>
                        {testResults.total > 0 && (
                            <div className="text-sm mt-1 text-gray-300">
                                {testResults.passed} / {testResults.total} test cases passed.
                            </div>
                        )}
                    </div>
                    <div className="text-right text-sm text-gray-300 space-y-1">
                        {testResults.runtime && (
                            <div>
                                Runtime: <span className="font-semibold text-white">{testResults.runtime}</span>
                            </div>
                        )}
                        {testResults.memory && (
                            <div>
                                Memory: <span className="font-semibold text-white">{testResults.memory}</span>
                            </div>
                        )}
                    </div>
                </div>
                {testResults.errorMessage && (
                    <div className="mt-4 border-t border-gray-700 pt-3">
                        <h4 className="font-semibold text-red-300">Error Details:</h4>
                        <pre className="mt-2 p-3 bg-gray-900 rounded font-mono text-sm overflow-x-auto">
                            {testResults.errorMessage}
                        </pre>
                    </div>
                )}
            </div>
            {testResults.testCases?.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-lg text-white mb-3">Test Case Details</h4>
                    <div className="space-y-3">
                        {testResults.testCases.map((tc, index) => (
                            <div key={index} className={`p-4 rounded-lg border ${tc.passed ? 'border-green-800 bg-gray-900/40' : 'border-red-800 bg-red-900/20'}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center font-medium">
                                        {tc.passed ? <FaCheck className="text-green-400 mr-3" /> : <FaTimes className="text-red-400 mr-3" />}
                                        Test Case {index + 1}:
                                        <span className={`ml-2 font-bold ${tc.passed ? 'text-green-400' : 'text-red-400'}`}>{tc.passed ? 'Passed' : 'Failed'}</span>
                                    </div>
                                    {tc.runtime !== undefined && <span className="text-xs text-gray-400">{formatRuntime(tc.runtime)}</span>}
                                </div>
                                {!tc.passed && (
                                    <div className="mt-4 pt-3 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-400 font-semibold mb-1">Input</div>
                                            <pre className="p-2 bg-gray-800 rounded overflow-x-auto">{JSON.stringify(tc.input, null, 2)}</pre>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 font-semibold mb-1">Your Output</div>
                                            <pre className="p-2 bg-red-900/30 rounded overflow-x-auto text-red-300">{JSON.stringify(tc.output, null, 2)}</pre>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 font-semibold mb-1">Expected Output</div>
                                            <pre className="p-2 bg-green-900/30 rounded overflow-x-auto text-green-300">{JSON.stringify(tc.expected, null, 2)}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Codefield = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const editorContainerRef = useRef(null);
    const panelRef = useRef(null);
    const [panelWidth, setPanelWidth] = useState(400);
    const [isDraggingPanel, setIsDraggingPanel] = useState(false);
    
    const statusColorMap = {
        'Accepted': 'text-green-400',
        'Wrong Answer': 'text-red-400',
        'Runtime Error': 'text-red-400',
        'Time Limit Exceeded': 'text-yellow-400',
        'Compilation Error': 'text-red-400',
        'Memory Limit Exceeded': 'text-yellow-400',
        'Submission Error': 'text-red-400'
    };

    const [problem, setProblem] = useState(null);
    const [loadingProblem, setLoadingProblem] = useState(true);
    const [problemError, setProblemError] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [customInput, setCustomInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [activeConsoleTab, setActiveConsoleTab] = useState('input');
    const [consoleHeight, setConsoleHeight] = useState(200);
    const [isDraggingConsole, setIsDraggingConsole] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [theme, setTheme] = useState('vs-dark');
    const [submissionHistory, setSubmissionHistory] = useState([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monaco.editor.defineTheme('monokai', themes.monokaiTheme);
        monaco.editor.defineTheme('dracula', themes.draculaTheme);
        monaco.editor.defineTheme('one-dark-pro', themes.oneDarkProTheme);
        monaco.editor.defineTheme('nord', themes.nordTheme);
        editor.focus();
    };

    useEffect(() => {
        const fetchProblem = async () => {
            if (!problemId) {
                setProblemError("No problem ID provided.");
                setLoadingProblem(false);
                return;
            }
            setLoadingProblem(true);
            try {
                const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
                setProblem(data);
                const savedCode = localStorage.getItem(`code_${problemId}_${language}`);
                if (savedCode) {
                    setCode(savedCode);
                } else {
                    const starter = data.starterCode.find(sc => sc.language === language);
                    setCode(starter?.code || '');
                }
            } catch (err) {
                setProblemError(err.response?.data?.message || "Failed to load problem data.");
            } finally {
                setLoadingProblem(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!problemId) return;
            try {
                const { data } = await axiosClient.get(`/submission/history/${problemId}`);
                setSubmissionHistory(data);
            } catch (err) {
                console.error("Failed to fetch submission history", err);
            }
        };
        fetchHistory();
    }, [problemId]);

    useEffect(() => {
        if (problem?.starterCode) {
            const starter = problem.starterCode.find(sc => sc.language === language);
            const saved = localStorage.getItem(`code_${problemId}_${language}`);
            setCode(saved || starter?.code || `// Starter code for ${language} not available.`);
        }
    }, [language, problem, problemId]);

    useEffect(() => {
        if (problemId && language && code) {
            localStorage.setItem(`code_${problemId}_${language}`, code);
        }
    }, [code, language, problemId]);

    const handlePanelMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDraggingPanel(true);
    }, []);

    const handleConsoleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDraggingConsole(true);
    }, []);

    const handleMouseUp = useCallback(() => {
        setIsDraggingPanel(false);
        setIsDraggingConsole(false);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (isDraggingPanel && panelRef.current) {
            const newWidth = e.clientX;
            setPanelWidth(Math.max(300, Math.min(newWidth, 800)));
        }
        if (isDraggingConsole && editorContainerRef.current) {
            const rect = editorContainerRef.current.getBoundingClientRect();
            const height = rect.bottom - e.clientY;
            setConsoleHeight(Math.max(80, Math.min(height, rect.height - 100)));
        }
    }, [isDraggingPanel, isDraggingConsole]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const handleRunCode = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setActiveConsoleTab('result');
        setConsoleOutput([{ type: 'info', message: `Running...` }]);
        try {
            const { data } = await axiosClient.post(`/submission/run/${problemId}`, {
                code,
                language,
                input: customInput
            });
            const { result } = data;
            const output = [
                { type: 'info', message: `Submission: ${data.status}` },
                { type: 'info', message: `Runtime: ${data.runtime || 'N/A'}` },
                { type: 'info', message: `Memory: ${data.memory || 'N/A'}` },
            ];
            if (data.errorMessage) {
                output.push({ type: 'error', message: `Error:\n${data.errorMessage}` });
            }
            
            if (data.testCases) {
                output.push({ type: 'info', message: `Test Cases: ${data.passed}/${data.total} passed` });
            }
            setConsoleOutput(output);
        } catch (err) {
            setConsoleOutput([{ type: 'error', message: err.response?.data?.message || "An error occurred." }]);
        } finally {
            setIsRunning(false);
        }
    };

const handleSubmitCode = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        setConsoleOutput([]);
        setTestResults(null);
        setActiveTab('submissions');
        setActiveConsoleTab('result');
        toast.info('Submitting your solution...');
        
        try {
            const { data } = await axiosClient.post(`/submission/submit/${problemId}`, { code, language });
            
            // Format the submission result for console output
            const output = [
                { type: 'info', message: `Submission: ${data.status}` },
                { type: 'info', message: `Runtime: ${data.runtime || 'N/A'}` },
                { type: 'info', message: `Memory: ${data.memory || 'N/A'}` },
            ];
            
            if (data.errorMessage) {
                output.push({ type: 'error', message: `Error:\n${data.errorMessage}` });
            }
            
            if (data.testCases) {
                output.push({ type: 'info', message: `Test Cases: ${data.passed}/${data.total} passed` });
            }
            
            setConsoleOutput(output);
            setTestResults(data);
            setSubmissionHistory(prev => [data, ...prev]);
            toast.success(`Submission: ${data.status}`);
            
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Submission error.";
            setConsoleOutput([{ type: 'error', message: errorMsg }]);
            
            const errorResult = {
                status: 'Submission Error',
                errorMessage: errorMsg,
                passed: 0,
                total: 0,
                testCases: []
            };
            
            setTestResults(errorResult);
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetCode = () => {
        const starter = problem?.starterCode.find(sc => sc.language === language)?.code;
        if (starter) {
            setCode(starter);
            toast.info('Code reset to default template.');
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied!');
    };

    if (loadingProblem) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <LoadingSpinner message="Loading Problem..." size="lg" />
        </div>
    );

    if (problemError) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-red-400 text-xl text-center p-4">
            Error: {problemError}
            <Link to="/problems" className="btn btn-primary mt-4">Back to Problems</Link>
        </div>
    );

    if (!problem) return null;

    return (
        <div className={`flex flex-col h-screen bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
            {!isFullscreen && <Header />}

            <main className={`flex flex-1 overflow-hidden ${!isFullscreen ? 'pt-16' : ''}`}>
                {showSidebar && (
                    <>
                        <div 
                            ref={panelRef}
                            className="h-full flex-shrink-0 bg-gray-800 border-r border-gray-700 overflow-hidden"
                            style={{ width: `${panelWidth}px` }}
                        >
                            <ProblemPanel
                                problem={problem}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                submissionHistory={submissionHistory}
                                testResults={testResults}
                                setTestResults={setTestResults}
                            />
                        </div>
                        <div
                            onMouseDown={handlePanelMouseDown}
                            className="w-1 bg-gray-700 cursor-col-resize hover:bg-primary transition-colors"
                        />
                    </>
                )}

                <div
                    ref={editorContainerRef}
                    className={`flex flex-col flex-1 bg-gray-900 overflow-hidden ${isFullscreen ? 'w-full' : ''}`}
                >
                    <div className="flex justify-between items-center p-2 border-b border-gray-700 bg-gray-800 text-white">
                        <div className="flex items-center gap-2">
                            <select
                                className="select select-bordered select-sm bg-gray-700"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                {problem.starterCode?.map(sc => (
                                    <option key={sc.language} value={sc.language}>
                                        {capitalizeFirstLetter(sc.language)}
                                    </option>
                                ))}
                            </select>

                            <div className="dropdown dropdown-hover">
                                <button tabIndex={0} className="btn btn-sm btn-ghost" aria-label="Editor Settings">
                                    <IoMdSettings size={18} />
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><h3 className="menu-title">Theme</h3></li>
                                    <li>
                                        <select
                                            className="select select-sm"
                                            value={theme}
                                            onChange={e => setTheme(e.target.value)}
                                        >
                                            <option value="vs-dark">VS Dark</option>
                                            <option value="light">VS Light</option>
                                            <option value="monokai">Monokai</option>
                                            <option value="dracula">Dracula</option>
                                            <option value="one-dark-pro">One Dark Pro</option>
                                            <option value="nord">Nord</option>
                                            <option value="hc-black">High Contrast</option>
                                        </select>
                                    </li>
                                    <li className="mt-2">
                                        <h3 className="menu-title">Font Size: {fontSize}px</h3>
                                    </li>
                                    <li>
                                        <input
                                            type="range"
                                            min={10}
                                            max={24}
                                            value={fontSize}
                                            onChange={e => setFontSize(parseInt(e.target.value))}
                                            className="range range-xs"
                                        />
                                    </li>
                                </ul>
                            </div>

                            <div className="dropdown dropdown-hover">
                                <button tabIndex={0} className="btn btn-sm btn-ghost" aria-label="Submission History">
                                    <FaHistory size={16} />
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-72 max-h-96 overflow-y-auto">
                                    <li className="menu-title">Recent Submissions</li>
                                    {submissionHistory.length > 0 ? submissionHistory.map((sub) => (
                                        <li key={sub._id}>
                                            <a
                                                className="flex justify-between items-center"
                                                onClick={() => {
                                                    setTestResults(sub);
                                                    setActiveTab('submissions');
                                                }}
                                            >
                                                <span className={`font-bold ${statusColorMap[sub.status] || 'text-gray-400'}`}>
                                                    {sub.status}
                                                </span>
                                                <div className="text-right text-xs text-gray-400">
                                                    <div>{capitalizeFirstLetter(sub.language)}</div>
                                                    <div>{new Date(sub.createdAt).toLocaleTimeString()}</div>
                                                </div>
                                            </a>
                                        </li>
                                    )) : (
                                        <li><span className="text-gray-500">No submissions yet.</span></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleCopyCode} className="btn btn-sm btn-ghost" aria-label="Copy Code">
                                <FaRegCopy size={16} />
                            </button>
                            <button onClick={handleResetCode} className="btn btn-sm btn-ghost" aria-label="Reset Code">
                                <FaSyncAlt size={16} />
                            </button>
                            <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn btn-sm btn-ghost" aria-label="Toggle Fullscreen">
                                {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                            </button>
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="md:hidden btn btn-sm btn-ghost"
                                aria-label="Toggle Sidebar"
                            >
                                <FaList size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <MonacoEditor
                            height="100%"
                            language={language}
                            theme={theme}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: true },
                                fontSize: fontSize,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on'
                            }}
                        />
                    </div>

                    <div
                        onMouseDown={handleConsoleMouseDown}
                        className="w-full h-1 bg-gray-700 cursor-row-resize hover:bg-primary transition-colors"
                    />

                    <div className="flex flex-col bg-gray-800" style={{ height: `${consoleHeight}px` }}>
                        <div className="flex justify-between items-center border-b border-gray-700 px-4">
                            <div className="flex">
                                <button
                                    className={`px-4 py-2 text-sm font-medium ${activeConsoleTab === 'input' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveConsoleTab('input')}
                                >
                                    Custom Input
                                </button>
                                <button
                                    className={`px-4 py-2 text-sm font-medium ${activeConsoleTab === 'result' ? 'text-white border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveConsoleTab('result')}
                                >
                                    Result
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleRunCode} disabled={isSubmitting || isRunning} className="btn btn-sm gap-2 btn-outline btn-success">
                                    {isRunning ? <span className="loading loading-spinner loading-xs" /> : <FaPlay />} Run
                                </button>
                                <button onClick={handleSubmitCode} disabled={isRunning || isSubmitting} className="btn btn-sm btn-primary gap-2">
                                    {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : <FaPlay />} Submit
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-sm">
                            {activeConsoleTab === 'input' && (
                                <textarea
                                    value={customInput}
                                    onChange={(e) => setCustomInput(e.target.value)}
                                    className="w-full h-full p-2 bg-gray-800 text-white font-mono rounded border border-gray-700 focus:outline-none focus:border-primary resize-none"
                                    placeholder="Enter custom test input here..."
                                    spellCheck="false"
                                />
                            )}
                            {activeConsoleTab === 'result' &&  (
                                <pre className="font-mono whitespace-pre-wrap">
                                    {consoleOutput.length > 0 ? (
                                        consoleOutput.map((line, i) => (
                                            <div
                                                key={i}
                                                className={line.type === 'error' ? 'text-red-400' : line.type === 'info' ? 'text-blue-400' : 'text-gray-300'}
                                            >
                                                {line.message}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">see the result here...</span>
                                    )}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Codefield;