import React, { useState } from 'react';
import { FiAlertTriangle, FiChevronDown, FiChevronUp, FiHome, FiRefreshCw } from 'react-icons/fi';

interface ErrorPageProps {
  errorMessage?: string;
  technicalDetails?: string;
  onRetry?: () => void; // Optional: For a "Try Again" action
  onReturnHome: () => void;
  sessionID?: string; // Optional
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorMessage = 'An unexpected issue occurred. Please try again later.',
  technicalDetails,
  onRetry,
  onReturnHome,
  sessionID,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white flex flex-col items-center justify-center p-6 font-sans">
      <main className="flex flex-col items-center text-center w-full max-w-lg">
        {/* Error Indicator */}
        <FiAlertTriangle size={72} className="text-bright-coral mb-5" />
        <h1 className="text-3xl font-bold text-off-white mb-4">
          Oops! Something Went Wrong
        </h1>

        {/* User-Friendly Error Description */}
        <p className="text-lg text-cool-gray mb-6">
          {errorMessage}
        </p>

        {/* Optional Technical Details */}
        {technicalDetails && (
          <div className="w-full mb-6">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-cool-gray hover:text-electric-teal flex items-center justify-center mx-auto mb-2 focus:outline-none"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
              {showDetails ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
            </button>
            {showDetails && (
              <div className="bg-dark-slate p-4 rounded-md text-left text-xs text-cool-gray/80 whitespace-pre-wrap overflow-x-auto scrollbar-thin scrollbar-thumb-cool-gray/50 scrollbar-track-deep-charcoal/50">
                <code>{technicalDetails}</code>
              </div>
            )}
          </div>
        )}

        {/* Suggested Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 py-3 px-6 rounded-lg font-semibold bg-electric-teal text-deep-charcoal hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-opacity-50 transition-all duration-200 ease-out flex items-center justify-center"
            >
              <FiRefreshCw size={18} className="mr-2" />
              Try Again
            </button>
          )}
          <button
            onClick={onReturnHome}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ease-out flex items-center justify-center 
                        ${onRetry ? 'text-cool-gray border-2 border-cool-gray hover:bg-cool-gray hover:text-deep-charcoal focus:bg-cool-gray focus:text-deep-charcoal' 
                                 : 'bg-electric-teal text-deep-charcoal hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-opacity-50'}`}
          >
            <FiHome size={18} className="mr-2"/>
            Return to Home
          </button>
        </div>

        {/* Optional Session ID */}
        {sessionID && (
          <p className="text-xs text-cool-gray/70">
            Reference ID: {sessionID}
          </p>
        )}

        {/* Contact Support - Example Link (Can be made more robust) */}
        {/* <p className="text-xs text-cool-gray/70 mt-4">
          If the problem persists, <a href="mailto:support@example.com" className="underline hover:text-electric-teal">contact support</a>.
        </p> */}
      </main>
    </div>
  );
};

export default ErrorPage; 