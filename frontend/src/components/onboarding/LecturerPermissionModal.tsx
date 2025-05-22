import React, { useState } from 'react';
import Modal from '../Modal';
import { FiUsers } from 'react-icons/fi';

interface LecturerPermissionModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

const LecturerPermissionModal: React.FC<LecturerPermissionModalProps> = ({ isOpen, onAgree }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Modal isOpen={isOpen} nonDismissible maxWidth="max-w-xl">
      <div className="flex flex-col items-center text-center">
        <FiUsers size={40} className="text-electric-teal mb-4" />
        <h2 className="text-2xl font-semibold text-off-white mb-4">Crucial: Permission to Record Lectures</h2>
        
        <p className="text-base text-off-white/90 leading-relaxed mb-6">
          You <strong className="font-semibold">MUST</strong> obtain explicit permission from the lecturer, professor, or speaker <strong className="font-semibold">BEFORE</strong> you record any classroom session, lecture, or presentation using AutoNotes AI. Recording individuals without their consent may have legal consequences for which you are <strong className="font-semibold">solely responsible</strong>.
        </p>

        <label className="flex items-center self-start mb-6 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="form-checkbox h-5 w-5 text-electric-teal bg-dark-slate border-cool-gray rounded focus:ring-electric-teal focus:ring-offset-dark-slate mr-3 shrink-0"
          />
          <span className="text-sm text-off-white">I understand and affirm that I am solely responsible for obtaining explicit permission before recording any session.</span>
        </label>

        <button
          onClick={onAgree}
          disabled={!agreed}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ease-out 
                      ${agreed ? 'bg-electric-teal text-deep-charcoal hover:brightness-110' 
                               : 'bg-gray-divider text-cool-gray cursor-not-allowed'}`}
        >
          Understood & Proceed
        </button>
      </div>
    </Modal>
  );
};

export default LecturerPermissionModal; 