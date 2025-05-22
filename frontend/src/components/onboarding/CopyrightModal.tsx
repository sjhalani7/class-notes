import React, { useState } from 'react';
import Modal from '../Modal';
import { FiShield } from 'react-icons/fi';

interface CopyrightModalProps {
  isOpen: boolean;
  onAgree: () => void;
}

const CopyrightModal: React.FC<CopyrightModalProps> = ({ isOpen, onAgree }) => {
  const [agreed, setAgreed] = useState(false);

  const placeholderText = `
    Please read this policy carefully. By using AutoNotes AI, you agree to respect all applicable copyright laws and fair use principles. 
    You acknowledge that recording, transcribing, or distributing copyrighted material without proper authorization from the copyright holder is unlawful and unethical. 
    AutoNotes AI is intended for personal note-taking from lectures and presentations where you have the right or permission to record. 
    You are solely responsible for ensuring that your use of this application complies with all relevant copyright regulations in your jurisdiction and the policies of your institution. 
    Misuse of this tool for copyright infringement is strictly prohibited and may lead to legal consequences for which AutoNotes AI and its developers bear no responsibility. 
    We encourage you to use this tool responsibly and ethically. If you are unsure about the copyright status of material you intend to record, please seek clarification from the content owner or legal counsel.
    Further terms about content ownership, data generated, and limitations of liability are outlined in our full Terms of Service.
  `;

  return (
    <Modal isOpen={isOpen} nonDismissible maxWidth="max-w-2xl"> {/* Slightly wider for text content */}
      <div className="flex flex-col items-center text-center">
        <FiShield size={40} className="text-electric-teal mb-4" />
        <h2 className="text-2xl font-semibold text-off-white mb-3">Important: Copyright & Fair Use Policy</h2>
        
        <div className="text-left text-sm text-off-white/90 leading-relaxed max-h-[40vh] overflow-y-auto pr-2 mb-6 
                        scrollbar-thin scrollbar-thumb-electric-teal/70 scrollbar-track-deep-charcoal/50">
          <p className="whitespace-pre-line">{placeholderText}</p>
        </div>

        <label className="flex items-center self-start mb-6 cursor-pointer">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="form-checkbox h-5 w-5 text-electric-teal bg-dark-slate border-cool-gray rounded focus:ring-electric-teal focus:ring-offset-dark-slate mr-3 shrink-0"
          />
          <span className="text-sm text-off-white">I have read, understood, and agree to the Copyright & Fair Use Policy.</span>
        </label>

        <button
          onClick={onAgree}
          disabled={!agreed}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ease-out 
                      ${agreed ? 'bg-electric-teal text-deep-charcoal hover:brightness-110' 
                               : 'bg-gray-divider text-cool-gray cursor-not-allowed'}`}
        >
          Agree & Continue
        </button>
      </div>
    </Modal>
  );
};

export default CopyrightModal; 