import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../../components/common/Loading';
import ProblemForm from './components/ProblemForm';

const EditProblem = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axiosClient.get(`/problem/problemByIdForAdmin/${id}`);
                const fetchedData = response.data;
                const sanitizedData = {
                    ...fetchedData,
                    tags: fetchedData.tags || [],
                    visibleTestCases: (fetchedData.visibleTestCases || []).map(tc => ({ ...tc, input: JSON.stringify(tc.input, null, 2), output: JSON.stringify(tc.output, null, 2) })),
                    hiddenTestCases: (fetchedData.hiddenTestCases || []).map(tc => ({ ...tc, input: JSON.stringify(tc.input, null, 2), output: JSON.stringify(tc.output, null, 2) })),
                    starterCode: fetchedData.starterCode || [],
                    referenceSolution: fetchedData.referenceSolution || [],
                };
                setInitialData(sanitizedData);
            } catch (error) {
                toast.error("Could not fetch problem data. Redirecting...");
                setTimeout(() => navigate('/admin/problems'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id, navigate]);

    const handleUpdateProblem = async (data) => {
        setIsSubmitting(true);
        toast.info("Updating problem...");
        try {
            await axiosClient.put(`/problem/update/${id}`, data);
            toast.success("Problem updated successfully!");
            setTimeout(() => navigate('/admin/problems'), 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update problem.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleValidationFail = () => {
        toast.error("Please fix the validation errors.");
    };

    if (loading) return <LoadingSpinner />;
    if (!initialData) return <div className="text-center text-xl text-warning">Could not load problem data.</div>;

    return (
        <div>
            <ProblemForm
                initialData={initialData}
                onSubmit={handleUpdateProblem}
                onValidationFail={handleValidationFail}
                isSubmitting={isSubmitting}
                isEditing={true}
            />
        </div>
    );
};

export default EditProblem;