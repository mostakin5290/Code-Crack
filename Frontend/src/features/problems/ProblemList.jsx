import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../api/axiosClient'; 
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/Loading';
import ConfirmationModal from './deleteProblem';

const ProblemList = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [problemToDelete, setProblemToDelete] = useState(null);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axiosClient.get('/problem/getAllProblem');
                setProblems(response.data);
            } catch (err) {
                setError('Failed to fetch problems. Please try again later.');
                toast.error('Failed to fetch problems.');
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    const handleDeleteClick = (problem) => {
        setProblemToDelete(problem);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!problemToDelete) return;
        try {
            await axiosClient.delete(`/problem/delete/${problemToDelete._id}`);
            setProblems(problems.filter(p => p._id !== problemToDelete._id));
            toast.success('Problem deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete problem.');
        } finally {
            setShowConfirmModal(false);
            setProblemToDelete(null);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <ToastContainer theme="dark" position="top-right" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-primary">Manage Problems</h1>
                <Link to="/admin/problems/create" className="btn btn-primary">
                    <FaPlus className="mr-2" /> Create New
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Tags</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.length > 0 ? problems.map(problem => (
                            <tr key={problem._id} className="hover">
                                <td className="font-medium">{problem.title}</td>
                                <td>
                                    <span className={`badge ${
                                        problem.difficulty === 'easy' ? 'badge-success' :
                                        problem.difficulty === 'medium' ? 'badge-warning' : 'badge-error'
                                    }`}>{problem.difficulty}</span>
                                </td>
                                <td>{problem.tags.join(', ')}</td>
                                <td className="flex gap-2">
                                    <Link to={`/admin/problems/edit/${problem._id}`} className="btn btn-sm btn-outline btn-info">
                                        <FaEdit />
                                    </Link>
                                    <button onClick={() => handleDeleteClick(problem)} className="btn btn-sm btn-outline btn-error">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8">No problems found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Problem"
            >
                <p>Are you sure you want to delete the problem titled: <br /> <strong className="text-primary">{problemToDelete?.title}</strong>?</p>
                <p className="mt-2 text-sm text-red-400">This action cannot be undone.</p>
            </ConfirmationModal>
        </div>
    );
};

export default ProblemList;