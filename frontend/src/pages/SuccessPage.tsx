import React, { useState } from 'react';
import { FiCheckCircle, FiThumbsUp, FiThumbsDown, FiEdit3 } from 'react-icons/fi';
import { SiGoogledocs } from 'react-icons/si';

interface SuccessPageProps {
  documentTitle?: string; // Optional: Title of the generated document
  documentUrl?: string;   // Optional: URL to the Google Doc
  onRecordAnother: () => void;
  onViewAllNotes?: () => void; // Optional: If a notes list page exists
}

const SuccessPage: React.FC<SuccessPageProps> = ({
  documentTitle = 'Your Lecture Notes - May 24, 2025', // Default placeholder
  documentUrl = '#', // Default placeholder
  onRecordAnother,
  onViewAllNotes,
}) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleOpenDocument = () => {
    if (documentUrl && documentUrl !== '#') {
      window.open(documentUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Document URL not provided for SuccessPage.');
      // Optionally, disable the button or show a message if URL is missing
    }
  };

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white flex flex-col items-center justify-center p-6 font-sans">
      <main className="flex flex-col items-center text-center w-full max-w-md">
        {/* Success Indicator */}
        <FiCheckCircle size={72} className="text-vivid-mint-green mb-5" />
        <h1 className="text-3xl font-bold text-off-white mb-3">
          Notes Ready!
        </h1>
        <p className="text-lg text-cool-gray mb-8">
          Your lecture notes have been successfully prepared.
        </p>

        {/* Note Title/Identifier (Optional) */}
        {documentTitle && (
          <p className="text-cool-gray text-base mb-8">Lecture: {documentTitle}</p>
        )}

        {/* Primary CTA: Open in Google Docs */}
        <button
          onClick={handleOpenDocument}
          className="bg-electric-teal text-deep-charcoal font-semibold text-xl w-full px-8 py-4 rounded-lg shadow-lg hover:shadow-glow-teal hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-electric-teal focus:ring-opacity-50 transition-all duration-200 ease-out flex items-center justify-center group mb-6"
          disabled={!documentUrl || documentUrl === '#'} // Disable if no valid URL
        >
          <SiGoogledocs size={23} className="mr-3 text-deep-charcoal transition-transform duration-200 ease-out group-hover:scale-110" />
          Open in Google Docs
        </button>

        {/* Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mb-10">
          <button
            onClick={onRecordAnother}
            className="flex-1 py-3 px-6 rounded-lg font-medium text-electric-teal border-2 border-electric-teal hover:bg-electric-teal hover:text-deep-charcoal focus:bg-electric-teal focus:text-deep-charcoal transition-all duration-200 ease-out flex items-center justify-center"
          >
            <FiEdit3 size={20} className="mr-2" />
            Record Another Lecture
          </button>
          {onViewAllNotes && (
            <button
              onClick={onViewAllNotes}
              className="flex-1 py-3 px-6 rounded-lg font-medium text-cool-gray border-2 border-cool-gray hover:bg-cool-gray hover:text-deep-charcoal focus:bg-cool-gray focus:text-deep-charcoal transition-all duration-200 ease-out"
            >
              View All My Notes
            </button>
          )}
        </div>

        {/* Optional Feedback Mechanism */}
        <div className="w-full pt-6 border-t border-gray-divider/50">
          <p className="text-cool-gray mb-3 text-sm">How were these notes?</p>
          <div className="flex justify-center gap-5">
            <button 
              aria-label="Good quality notes"
              onClick={() => setFeedback('up')} 
              className={`p-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50 
                          ${feedback === 'up' ? 'text-vivid-mint-green ring-vivid-mint-green' : 'text-cool-gray hover:text-vivid-mint-green focus:ring-vivid-mint-green'}`}
            >
              <FiThumbsUp size={28} />
            </button>
            <button 
              aria-label="Bad quality notes"
              onClick={() => setFeedback('down')} 
              className={`p-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-50 
                          ${feedback === 'down' ? 'text-electric-teal ring-electric-teal' : 'text-cool-gray hover:text-electric-teal focus:ring-electric-teal'}`}
            >
              <FiThumbsDown size={28} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default SuccessPage; 