import React, { useEffect, useRef } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    children, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel', 
    isLoading = false 
}) => {
    const modalRef = useRef(null);

    // Effect for handling the 'Escape' key to close the modal
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    // Effect for trapping focus within the modal for accessibility
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        firstElement?.focus();
        modalRef.current.addEventListener('keydown', handleTabKey);

        return () => {
            modalRef.current?.removeEventListener('keydown', handleTabKey);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // The modal overlay with a fade-in animation
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* The modal panel with a scale-up animation */}
            <div
                ref={modalRef}
                className="bg-white/5 backdrop-blur-2xl rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border border-white/20 animate-scale-up"
            >
                <div className="flex items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <FaExclamationTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-xl font-bold text-white mb-2" id="modal-title">
                            {title}
                        </h3>
                        <div className="text-gray-300 text-sm">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 sm:mt-8 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="btn btn-error w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            confirmText
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="btn btn-ghost w-full sm:w-auto mt-3 sm:mt-0"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;