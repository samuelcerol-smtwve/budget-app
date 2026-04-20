import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center fade-in"
      style={{ background: 'rgba(15, 24, 35, 0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-night-700 rounded-t-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 modal-slide border-gold">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-cream-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-2xl text-secondary hover:text-cream-100 px-2 transition-colors"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
