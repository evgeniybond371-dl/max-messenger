import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export default function Modal({ isOpen, isClose, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal__overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>

          {isClose ? (
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          ) : ('')}

        </div>

        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
