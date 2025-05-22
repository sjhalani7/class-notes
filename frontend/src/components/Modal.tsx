import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void; // Optional: for modals that can be closed by clicking outside or an X button
  children: React.ReactNode;
  maxWidth?: string; // e.g., 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl' (550px is roughly max-w-xl or max-w-lg)
  nonDismissible?: boolean; // If true, clicking outside or pressing Esc won't close
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-xl', // Default to ~550px
  nonDismissible = false 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (!nonDismissible && onClose) {
      onClose();
    }
  };

  // Non-dismissible modals also shouldn't close on Escape key
  // This effect would need to be added if Esc key handling is desired for dismissible modals
  // useEffect(() => {
  //   const handleEsc = (event: KeyboardEvent) => {
  //     if (event.key === 'Escape' && !nonDismissible && onClose) {
  //       onClose();
  //     }
  //   };
  //   window.addEventListener('keydown', handleEsc);
  //   return () => window.removeEventListener('keydown', handleEsc);
  // }, [onClose, nonDismissible]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out"
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-dark-slate rounded-lg shadow-modal p-6 sm:p-8 ${maxWidth} w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalShow`}
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
      >
        {children}
      </div>
    </div>
  );
};

export default Modal; 