import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import { FaTrash, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmationModal from '../features/problems/deleteProblem'; // Reusing the modal

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const fetchUsers = async () => {
        try {
            const { data } = await axiosClient.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await axiosClient.delete(`/admin/users/${userToDelete._id}`);
            toast.success('User deleted successfully!');
            fetchUsers(); // Refresh the list
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setShowConfirmModal(false);
            setUserToDelete(null);
        }
    };

    if (loading) return <LoadingSpinner message="Loading users..." />;

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Problems Solved</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} className="hover">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={user.avatar} alt="User Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.firstName} {user.lastName}</div>
                                            <div className="text-sm opacity-50">{user.emailId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <span className="badge badge-primary badge-outline"><FaUserShield className="mr-1"/> Admin</span>
                                    ) : (
                                        <span className="badge badge-ghost">User</span>
                                    )}
                                </td>
                                <td className="text-center font-semibold">
                                     <FaCheckCircle className="text-green-400 inline mr-2" />
                                    {user.problemsSolved}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteClick(user)} 
                                        className="btn btn-sm btn-outline btn-error"
                                        disabled={user.role === 'admin'}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmDelete}
                title="Delete User"
            >
                <p>Are you sure you want to delete this user: <br /> <strong className="text-primary">{userToDelete?.firstName} {userToDelete?.lastName}</strong>?</p>
                <p className="mt-2 text-sm text-red-400">This action cannot be undone.</p>
            </ConfirmationModal>
        </div>
    );
};

export default AdminUsersPage;