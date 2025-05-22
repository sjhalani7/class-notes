import React, { useState, useEffect, useCallback } from 'react';
import { FiMic, FiSquare } from 'react-icons/fi';

interface ActiveRecordingPageProps {
  onStopRecording: (lectureTitle: string) => void; // Updated to accept lectureTitle
}

const ActiveRecordingPage: React.FC<ActiveRecordingPageProps> = ({ onStopRecording }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lectureTitle, setLectureTitle] = useState(''); // Added state for lecture title

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedTime(prevTime => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleStopRecording = () => {
    console.log('Stop Recording clicked. Lecture Title:', lectureTitle, 'Elapsed Time:', formatTime(elapsedTime));
    // Transition to a "Processing" state/screen would happen here
    onStopRecording(lectureTitle || `Recorded Lecture - ${new Date().toLocaleDateString()}`); // Pass title, or default if empty
  };

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white flex flex-col items-center justify-center p-4 font-sans">
      <main className="flex flex-col items-center justify-center text-center w-full flex-grow">
        {/* Recording Status Indicator */}
        <div className="flex items-center mb-6">
          <FiMic size={32} className="text-electric-teal mr-3 animate-pulse" />
          <p className="text-3xl font-semibold text-electric-teal">Recording...</p>
        </div>

        {/* Lecture Title Input */}
        <div className="mb-8 w-full max-w-md">
          <label htmlFor="lectureTitle" className="sr-only">Lecture Title</label>
          <input 
            type="text"
            id="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter Lecture Title (Optional)"
            className="w-full bg-dark-slate border border-cool-gray/50 text-off-white rounded-md p-3 text-lg focus:ring-2 focus:ring-electric-teal focus:border-electric-teal placeholder-cool-gray/70 text-center"
          />
        </div>

        {/* Elapsed Time Display */}
        <div className="text-7xl font-mono text-off-white mb-12 tracking-wider">
          {formatTime(elapsedTime)}
        </div>

        {/* Stop Recording Button */}
        <button
          onClick={handleStopRecording}
          className="bg-electric-teal text-deep-charcoal font-semibold text-xl px-10 py-5 rounded-lg shadow-lg hover:shadow-glow-teal hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-electric-teal focus:ring-opacity-50 transition-all duration-200 ease-out flex items-center group"
        >
          <FiSquare size={24} className="mr-3 text-deep-charcoal fill-deep-charcoal transition-transform duration-200 ease-out group-hover:scale-110" />
          Stop Recording
        </button>
      </main>

      {/* Subtle Audio Quality Guidance */}
      <footer className="w-full py-6 text-center fixed bottom-0">
        <p className="text-sm text-cool-gray">
          Tip: Keep microphone close to speaker for best quality.
        </p>
      </footer>
    </div>
  );
};

export default ActiveRecordingPage; 