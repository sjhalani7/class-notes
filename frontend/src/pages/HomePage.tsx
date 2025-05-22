import React, { useState, useEffect, useRef } from 'react';
import { FiMic, FiSettings, FiAlertTriangle, FiList } from 'react-icons/fi';

// Assume this state would be managed globally or fetched (e.g., via Context or Redux)
const initialApiKeysConfigured = false; // Example: Set to true if keys are configured

interface HomePageProps {
  onStartRecording: () => void;
  onGoToSettings?: () => void;
  onGoToPastNotes?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartRecording, onGoToSettings, onGoToPastNotes }) => {
  const [apiKeysConfigured, setApiKeysConfigured] = useState(initialApiKeysConfigured);

  const handleStartRecordingClick = () => {
    // TODO: Implement permission modal invocation
    console.log('Start New Recording button clicked on HomePage');
    // For now, let's toggle the API key status for demo purposes
    // setApiKeysConfigured(!apiKeysConfigured); // This was for demo, actual start is handled by prop
    onStartRecording(); // Call the prop function passed from App.tsx
  };

  const handleGoToSettingsClick = () => {
    onGoToSettings?.();
  };

  const handleGoToPastNotesClick = () => {
    onGoToPastNotes?.();
  };

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white flex flex-col items-center justify-center p-4 font-sans relative">
      {/* Header Icons Container */}
      <div className="absolute top-6 right-6 flex items-center space-x-3">
        {/* Past Notes Icon Button */}
        {onGoToPastNotes && (
          <button 
            onClick={handleGoToPastNotesClick}
            className="text-cool-gray hover:text-electric-teal focus:text-electric-teal focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-opacity-50 rounded-full p-2 transition-all duration-200 ease-out"
            aria-label="Past Notes"
          >
            <FiList size={28} />
          </button>
        )}

        {/* Settings Icon Button */}
        {onGoToSettings && (
          <button 
            onClick={handleGoToSettingsClick}
            className="text-cool-gray hover:text-electric-teal focus:text-electric-teal focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-opacity-50 rounded-full p-2 transition-all duration-200 ease-out"
            aria-label="Settings"
          >
            <FiSettings size={28} />
          </button>
        )}
      </div>

      <main className="flex flex-col items-center justify-center text-center w-full flex-grow">
        {/* Application Title */}
        <h1 className="text-5xl font-bold text-off-white mb-4">
          AutoNotes AI
        </h1>

        {/* Instructional Text */}
        <p className="text-cool-gray text-lg mb-10 max-w-md">
          Ready to capture your lecture? Place your device near the speaker for best results.
        </p>

        {/* Start New Recording Button */}
        <button
          onClick={handleStartRecordingClick}
          className="bg-electric-teal text-deep-charcoal font-semibold text-xl px-10 py-5 rounded-lg shadow-lg hover:shadow-glow-teal hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-electric-teal focus:ring-opacity-50 transition-all duration-200 ease-out flex items-center group"
        >
          <FiMic size={26} className="mr-3 text-deep-charcoal transition-transform duration-200 ease-out group-hover:scale-110" />
          Start New Recording
        </button>

        {/* API Key Status Warning (Conditional) */}
        {!apiKeysConfigured && (
          <div className="mt-10 bg-dark-slate p-4 rounded-lg shadow-md border border-cool-gray/30 max-w-lg w-full">
            <div className="flex items-center">
              <FiAlertTriangle size={24} className="text-cool-gray mr-3 shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-off-white">API Keys Not Configured</p>
                <p className="text-cool-gray text-sm">
                  Please update in <button onClick={handleGoToSettingsClick} className="underline hover:text-electric-teal focus:text-electric-teal transition-colors duration-150">Settings</button> for full functionality.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Legal Footer */}
      <footer className="w-full py-6 text-center fixed bottom-0">
        <p className="text-xs text-cool-gray">
          <span className="font-semibold">Important:</span> Always obtain lecturer permission <span className="font-semibold">before</span> recording.
        </p>
      </footer>
    </div>
  );
};

export default HomePage; 