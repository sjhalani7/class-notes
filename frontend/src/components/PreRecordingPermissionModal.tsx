import React, { useState } from 'react';
import Modal from './Modal';
import { FiCheckSquare } from 'react-icons/fi';

interface PreRecordingPermissionModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PreRecordingPermissionModal: React.FC<PreRecordingPermissionModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  const [agreed, setAgreed] = useState(false);

  const handleConfirm = () => {
    if (agreed) {
      onConfirm();
      setAgreed(false); // Reset for next time
    }
  };

  const handleCancel = () => {
    onCancel();
    setAgreed(false); // Reset for next time
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} nonDismissible={false} maxWidth="max-w-lg">
      <div className="flex flex-col items-center text-center">
        <FiCheckSquare size={32} className="text-electric-teal mb-4" />
        <h2 className="text-xl font-semibold text-off-white mb-3">Confirm Recording Permission</h2>
        
        <p className="text-base text-off-white/90 mb-6">
          Have you obtained explicit permission from the lecturer/speaker to record <strong className="font-semibold">this specific session</strong>?
        </p>

        <label className="flex items-center self-start mb-8 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="form-checkbox h-5 w-5 text-electric-teal bg-dark-slate border-cool-gray rounded focus:ring-electric-teal focus:ring-offset-dark-slate mr-3 shrink-0"
          />
          <span className="text-sm text-off-white">Yes, I have permission for this session.</span>
        </label>

        <div className="flex justify-end gap-4 w-full">
          <button
            onClick={handleCancel}
            className="py-2.5 px-6 rounded-lg font-medium text-cool-gray border border-cool-gray hover:bg-gray-divider hover:text-off-white transition-all duration-200 ease-out"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!agreed}
            className={`py-2.5 px-6 rounded-lg font-semibold transition-all duration-200 ease-out 
                        ${agreed ? 'bg-electric-teal text-deep-charcoal hover:brightness-110' 
                                 : 'bg-gray-divider text-cool-gray cursor-not-allowed'}`}
          >
            Proceed to Record
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PreRecordingPermissionModal; 