import { useEffect } from 'react';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import './charInfoDialog.scss';

const CharInfoDialog = ({ charId, onClose }) => {

    // Lock body scroll while dialog is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <div className="char-dialog__backdrop" onClick={onClose}>
            <div
                className="char-dialog__panel"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Character information"
            >
                <div className="char-dialog__handle" aria-hidden="true" />
                <button
                    className="char-dialog__close"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    ✕
                </button>
                <ErrorBoundary>
                    <CharInfo charId={charId} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default CharInfoDialog;
