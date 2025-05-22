import React from 'react';
import { FiInfo } from 'react-icons/fi';

interface DataPrivacyInfoProps {
  onAcknowledge?: () => void; // If an explicit ack is needed later
}

const DataPrivacyInfo: React.FC<DataPrivacyInfoProps> = ({ onAcknowledge }) => {
  return (
    <div className="bg-dark-slate p-6 rounded-lg shadow-modal max-w-xl w-full text-center mx-auto mt-8">
      <FiInfo size={32} className="text-electric-teal mb-3 mx-auto" />
      <h3 className="text-xl font-semibold text-off-white mb-3">Data Privacy</h3>
      <p className="text-sm text-off-white/80 mb-4">
        We take your privacy seriously. Please review our Data Privacy Policy to understand how we handle your data.
      </p>
      <a 
        href="#" // Replace with actual link to Privacy Policy page/modal trigger
        onClick={(e) => { e.preventDefault(); console.log('Navigate to Privacy Policy'); /* TODO: Implement actual navigation or modal display */}}
        className="text-electric-teal hover:underline focus:underline focus:outline-none focus:ring-1 focus:ring-electric-teal rounded px-1 py-0.5"
      >
        Read our Privacy Policy
      </a>
      {onAcknowledge && (
        <button
          onClick={onAcknowledge}
          className="mt-6 w-full py-2.5 px-5 rounded-lg font-semibold bg-electric-teal text-deep-charcoal hover:brightness-110 transition-colors duration-150"
        >
          Acknowledge & Finish Setup
        </button>
      )}
    </div>
  );
};

export default DataPrivacyInfo; 