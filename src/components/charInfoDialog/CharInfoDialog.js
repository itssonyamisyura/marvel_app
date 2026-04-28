import { useEffect, useRef } from 'react';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import './charInfoDialog.scss';

const SWIPE_CLOSE_THRESHOLD = 80;

const CharInfoDialog = ({ charId, onClose }) => {

    const panelRef = useRef(null);
    const touchStartY = useRef(0);
    const touchDeltaY = useRef(0);

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

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        touchDeltaY.current = 0;
        if (panelRef.current) {
            panelRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e) => {
        const delta = e.touches[0].clientY - touchStartY.current;
        touchDeltaY.current = delta;
        if (delta > 0 && panelRef.current) {
            panelRef.current.style.transform = `translateY(${delta}px)`;
        }
    };

    const handleTouchEnd = () => {
        if (touchDeltaY.current > SWIPE_CLOSE_THRESHOLD) {
            onClose();
        } else {
            // Snap back
            if (panelRef.current) {
                panelRef.current.style.transition = 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)';
                panelRef.current.style.transform = '';
            }
        }
    };

    return (
        <div className="char-dialog__backdrop" onClick={onClose}>
            <div
                ref={panelRef}
                className="char-dialog__panel"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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
                <div className="char-dialog__scroll">
                    <ErrorBoundary>
                        <CharInfo charId={charId} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default CharInfoDialog;
