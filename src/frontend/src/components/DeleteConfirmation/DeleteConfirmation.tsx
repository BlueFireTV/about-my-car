import React, { useEffect, useRef } from 'react';
import './DeleteConfirmation.css';

interface DeleteConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
    confirmationText: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onConfirm, onCancel, confirmationText }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCancel]);

    useEffect(() => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog ref={dialogRef} className="delete-dialog">
            <div className="delete-dialog-content">
                <p>{confirmationText}</p>
                <button onClick={onConfirm}>Löschen</button>
                <button onClick={onCancel}>Abbrechen</button>
            </div>
        </dialog>
    );
};

export default DeleteConfirmation;