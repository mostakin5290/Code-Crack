import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { z } from 'zod';

// --- Constants ---
const difficultyOptions = ['easy', 'medium', 'hard'];
const tagOptions = ['array', 'linkedList', 'tree', 'graph', 'dp', 'string', 'hashTable', 'math', 'sorting', 'binarySearch'];
const languageOptions = ['javascript', 'python', 'java', 'c++'];
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

// --- Zod Schema ---
const problemSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long.'),
    description: z.string().min(50, 'Description must be at least 50 characters long.'),
    difficulty: z.enum(difficultyOptions),
    tags: z.array(z.enum(tagOptions)).min(1, 'At least one tag is required.'),
    visibleTestCases: z.array(z.object({
        input: z.string().min(1, 'Input is required.'),
        output: z.string().min(1, 'Output is required.'),
        explanation: z.string().optional(),
    })).min(1, 'At least one visible test case is required.'),
    hiddenTestCases: z.array(z.object({
        input: z.string().min(1, 'Input is required.'),
        output: z.string().min(1, 'Output is required.'),
    })).min(1, 'At least one hidden test case is required.'),
    starterCode: z.array(z.object({
        language: z.enum(languageOptions),
        code: z.string().min(1, 'Starter code is required.'),
    })).min(1, 'At least one starter code template is required.'),
    referenceSolution: z.array(z.object({
        language: z.enum(languageOptions),
        completeCode: z.string().min(1, 'Solution code cannot be empty if a solution entry is added.'),
    })).optional(),
});

const ProblemForm = ({ initialData = null, onSubmit, isSubmitting, isEditing = false, onValidationFail }) => {
    const blankForm = {
        title: '', description: '', difficulty: 'easy', tags: [],
        visibleTestCases: [{ input: '', output: '', explanation: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
        starterCode: [{ language: 'javascript', code: '' }],
        referenceSolution: [],
    };

    const [formData, setFormData] = useState(initialData || blankForm);
    const [currentTags, setCurrentTags] = useState(initialData?.tags?.join(', ') || '');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setCurrentTags(initialData.tags?.join(', ') || '');
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (value) => {
        setFormData(prev => ({ ...prev, description: value || '' }));
    };

    const handleTagsChange = (e) => {
        setCurrentTags(e.target.value);
        const newTags = e.target.value.split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tagOptions.includes(tag) && tag !== '');
        setFormData(prev => ({ ...prev, tags: [...new Set(newTags)] }));
    };

    const handleDynamicListChange = (listName, index, field, value) => {
        setFormData(prev => {
            const newList = [...prev[listName]];
            const currentItem = prev[listName][index];
            newList[index] = { ...currentItem, [field]: value };
            return { ...prev, [listName]: newList };
        });
    };

    const addDynamicListItem = (listName) => {
        let newItem = {};
        if (listName === 'visibleTestCases') newItem = { input: '', output: '', explanation: '' };
        else if (listName === 'hiddenTestCases') newItem = { input: '', output: '' };
        else if (listName === 'starterCode') newItem = { language: 'javascript', code: '' };
        else if (listName === 'referenceSolution') newItem = { language: 'javascript', completeCode: '' };
        setFormData(prev => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] }));
    };

    const removeDynamicListItem = (listName, index) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };
    
    const handleSubmitForm = (e) => {
        e.preventDefault();
        setErrors({});

        const cleanedDataForValidation = {
            ...formData,
            tags: formData.tags || [],
            visibleTestCases: (formData.visibleTestCases || []).map(tc => ({...tc, explanation: tc.explanation || undefined })),
            hiddenTestCases: formData.hiddenTestCases || [],
            starterCode: formData.starterCode || [],
            referenceSolution: (formData.referenceSolution || []).filter(sol => sol.completeCode && sol.completeCode.trim() !== ''),
        };
        
        const validationResult = problemSchema.safeParse(cleanedDataForValidation);

        if (!validationResult.success) {
            const flatErrors = validationResult.error.flatten().fieldErrors;
            setErrors(flatErrors);
            if (onValidationFail) onValidationFail();
            return;
        }

        onSubmit(validationResult.data);
    };
    
    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        padding: { top: 10 }
    };

    return (
        <form onSubmit={handleSubmitForm} className="space-y-8">
            <section className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20">
                <h2 className="text-xl font-semibold mb-4 text-secondary">Basic Information</h2>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={`input w-full bg-gray-800 border-gray-600 focus:border-primary focus:ring-primary ${errors.title ? 'input-error' : 'input-bordered'}`} />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title[0]}</p>}
                </div>
                <div className="mt-4">
                    <label htmlFor="difficulty" className="block text-sm font-medium mb-1">Difficulty <span className="text-red-500">*</span></label>
                    <select name="difficulty" id="difficulty" value={formData.difficulty} onChange={handleInputChange} className={`select w-full bg-gray-800 border-gray-600 focus:border-primary focus:ring-primary ${errors.difficulty ? 'select-error' : 'select-bordered'}`}>
                        {difficultyOptions.map(opt => (<option key={opt} value={opt}>{capitalizeFirstLetter(opt)}</option>))}
                    </select>
                </div>
                <div className="mt-4">
                    <label htmlFor="tags-input" className="block text-sm font-medium mb-1">Tags (comma-separated) <span className="text-red-500">*</span></label>
                    <input type="text" id="tags-input" value={currentTags} onChange={handleTagsChange} placeholder="array, string, dp" className={`input w-full bg-gray-800 border-gray-600 focus:border-primary focus:ring-primary ${errors.tags ? 'input-error' : 'input-bordered'}`} />
                    <div className="mt-2 text-xs text-gray-400">Selected: {formData.tags.join(', ') || 'None'}</div>
                    {errors.tags && <p className="text-red-400 text-sm mt-1">{Array.isArray(errors.tags) ? errors.tags[0] : errors.tags}</p>}
                </div>
            </section>

            <section className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20">
                <h2 className="text-xl font-semibold mb-4 text-secondary">Problem Description <span className="text-red-500">*</span></h2>
                <div className={`h-60 border rounded-md overflow-hidden ${errors.description ? 'border-red-500' : 'border-gray-600'}`}>
                    <MonacoEditor language="markdown" theme="vs-dark" value={formData.description} onChange={handleDescriptionChange} options={editorOptions} />
                </div>
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description[0]}</p>}
            </section>
            
            {['visibleTestCases', 'hiddenTestCases'].map(listName => (
                <section key={listName} className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">{listName === 'visibleTestCases' ? 'Visible' : 'Hidden'} Test Cases <span className="text-red-500">*</span></h2>
                     {Array.isArray(errors[listName]) && <p className="text-red-400 text-sm my-2">{errors[listName].join(', ')}</p>}
                    {(formData[listName] || []).map((tc, index) => (
                        <div key={index} className="mb-6 p-4 border border-gray-600 rounded-md relative bg-gray-800/30">
                            <h3 className="text-md font-medium mb-2 text-gray-300">Test Case {index + 1}</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Input *</label>
                                    <textarea value={tc.input} onChange={e => handleDynamicListChange(listName, index, 'input', e.target.value)} rows={3} className="textarea w-full bg-gray-800 border-gray-600 font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Output *</label>
                                    <textarea value={tc.output} onChange={e => handleDynamicListChange(listName, index, 'output', e.target.value)} rows={3} className="textarea w-full bg-gray-800 border-gray-600 font-mono text-sm" />
                                </div>
                            </div>
                            {listName === 'visibleTestCases' && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Explanation (Optional)</label>
                                    <input type="text" value={tc.explanation || ''} onChange={e => handleDynamicListChange(listName, index, 'explanation', e.target.value)} className="input input-bordered w-full bg-gray-800 border-gray-600" />
                                </div>
                            )}
                            {formData[listName].length > 1 && (
                                <button type="button" onClick={() => removeDynamicListItem(listName, index)} className="btn btn-sm btn-circle btn-outline btn-error absolute -top-3 -right-3"><FaTrash /></button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem(listName)} className="btn btn-outline btn-primary btn-sm mt-2"><FaPlus className="mr-2" /> Add Test Case</button>
                </section>
            ))}

            {['starterCode', 'referenceSolution'].map(listName => (
                <section key={listName} className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-secondary">{listName === 'starterCode' ? 'Starter Code' : 'Reference Solution'} {listName === 'starterCode' && <span className="text-red-500">*</span>}</h2>
                    {(formData[listName] || []).map((item, index) => (
                         <div key={index} className="mb-6 p-4 border border-gray-600 rounded-md relative bg-gray-800/30">
                            <h3 className="text-md font-medium mb-2 text-gray-300">{listName === 'starterCode' ? 'Template' : 'Solution'} #{index + 1}</h3>
                             <div>
                                <label className="block text-sm font-medium mb-1">Language *</label>
                                <select value={item.language} onChange={e => handleDynamicListChange(listName, index, 'language', e.target.value)} className="select select-bordered w-full md:w-1/2 bg-gray-800 border-gray-600">
                                    {languageOptions.map(lang => (<option key={lang} value={lang}>{capitalizeFirstLetter(lang)}</option>))}
                                </select>
                            </div>
                             <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Code *</label>
                                <div className="h-48 border border-gray-600 rounded-md overflow-hidden">
                                    <MonacoEditor language={item.language} theme="vs-dark" value={item.code || item.completeCode} onChange={value => handleDynamicListChange(listName, index, listName === 'starterCode' ? 'code' : 'completeCode', value || '')} options={editorOptions} />
                                </div>
                            </div>
                            {(formData[listName].length > 1 || (listName === 'referenceSolution' && formData[listName].length > 0)) && (
                                <button type="button" onClick={() => removeDynamicListItem(listName, index)} className="btn btn-sm btn-circle btn-outline btn-error absolute -top-3 -right-3"><FaTrash /></button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem(listName)} className="btn btn-outline btn-primary btn-sm mt-2"><FaPlus className="mr-2" /> Add {listName === 'starterCode' ? 'Template' : 'Solution'}</button>
                </section>
            ))}

            <div className="mt-10 text-center">
                <button type="submit" disabled={isSubmitting} className="btn btn-lg btn-primary bg-gradient-to-r from-primary to-secondary border-none">
                    {isSubmitting ? (
                        <><span className="loading loading-spinner mr-2"></span>{isEditing ? 'Saving...' : 'Creating...'}</>
                    ) : (
                        <><FaSave className="mr-2" /> {isEditing ? 'Save Changes' : 'Create Problem'}</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ProblemForm;