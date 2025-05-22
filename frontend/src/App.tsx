import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import ActiveRecordingPage from './pages/ActiveRecordingPage';
import ProcessingPage from './pages/ProcessingPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';
import CopyrightModal from './components/onboarding/CopyrightModal';
import LecturerPermissionModal from './components/onboarding/LecturerPermissionModal';
// import DataPrivacyInfo from './components/onboarding/DataPrivacyInfo'; // Placeholder for now
import PreRecordingPermissionModal from './components/PreRecordingPermissionModal';
import SettingsPage from './pages/SettingsPage';
import PastNotesPage from './pages/PastNotesPage';

export type AppView = 'home' | 'recording' | 'processing' | 'success' | 'error' | 'settings' | 'pastNotes';

const ONBOARDING_COMPLETED_KEY = 'autoNotesAI_onboardingCompleted';
const PAST_NOTES_STORAGE_KEY = 'autoNotesAI_pastNotes'; // Key for localStorage

// Define NoteItem structure (can be moved to a types file later)
interface NoteItem {
  id: string;
  title: string;
  dateProcessed: string; // ISO string format for dates
  googleDocUrl: string;
  duration?: string; // Optional duration of the recording
}

interface AppError {
  message: string;
  technicalDetails?: string;
  sessionID?: string;
  canRetry?: boolean; 
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showCopyrightModal, setShowCopyrightModal] = useState(false);
  const [showLecturerPermissionModal, setShowLecturerPermissionModal] = useState(false);
  // const [showDataPrivacyInfo, setShowDataPrivacyInfo] = useState(false); // For later
  const [showPreRecordingModal, setShowPreRecordingModal] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // State to hold document info for SuccessPage (will be set by backend logic later)
  const [processedDocumentInfo, setProcessedDocumentInfo] = useState<{title: string, url: string} | null>(null);
  const [currentError, setCurrentError] = useState<AppError | null>(null);

  // Added this state to remember the previous view before going to settings
  const [previousView, setPreviousView] = useState<AppView>('home');

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    setOnboardingCompleted(hasCompletedOnboarding);
    if (!hasCompletedOnboarding) {
      setShowCopyrightModal(true);
    } else {
      // If onboarding is done, ensure no onboarding modals are trying to show due to state persistence issues on refresh etc.
      setShowCopyrightModal(false);
      setShowLecturerPermissionModal(false);
    }
  }, []);

  const handleCopyrightAgree = () => {
    setShowCopyrightModal(false);
    setShowLecturerPermissionModal(true);
  };

  const handleLecturerPermissionAgree = () => {
    setShowLecturerPermissionModal(false);
    // setShowDataPrivacyInfo(true); // Next step would be data privacy or finish onboarding
    // For now, mark onboarding as complete
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setOnboardingCompleted(true);
    console.log("Onboarding completed.");
    // Navigate to home after onboarding is fully complete
    setCurrentView('home');
  };

  // const handleDataPrivacyAcknowledge = () => { // For later
  //   setShowDataPrivacyInfo(false);
  //   localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  //   setOnboardingCompleted(true);
  //   console.log("Onboarding completed with Data Privacy ack.");
  // };

  const handleAttemptStartRecording = () => {
    if (!onboardingCompleted) {
      // This case should ideally not happen if modals are blocking correctly
      // but as a fallback, restart onboarding.
      setShowCopyrightModal(true);
      return;
    }
    setCurrentError(null); // Clear any previous errors
    setShowPreRecordingModal(true);
  };

  const handlePreRecordingConfirm = () => {
    setShowPreRecordingModal(false);
    setCurrentView('recording');
    console.log("Pre-recording permission confirmed, starting recording...");
  };

  const handlePreRecordingCancel = () => {
    setShowPreRecordingModal(false);
    console.log("Pre-recording permission cancelled.");
  };

  const handleStopRecording = (lectureTitle: string) => {
    setCurrentView('processing');
    console.log(`Recording stopped (title: "${lectureTitle}"), transitioning to processing screen.`);
    // Simulate setting document info that would normally happen before success
    setProcessedDocumentInfo({
      title: lectureTitle,
      url: 'https://docs.google.com/document/d/example' 
    });
  };

  const handleProcessingComplete = () => {
    console.log("Processing complete. Navigating to success screen.");
    setCurrentError(null); 

    if (processedDocumentInfo) {
      const newNote: NoteItem = {
        id: crypto.randomUUID(), // Generate a unique ID
        title: processedDocumentInfo.title,
        googleDocUrl: processedDocumentInfo.url,
        dateProcessed: new Date().toISOString(), // Store current date/time as ISO string
        // duration: processedDocumentInfo.duration, // Add if available from backend in the future
      };

      try {
        const existingNotesString = localStorage.getItem(PAST_NOTES_STORAGE_KEY);
        const existingNotes: NoteItem[] = existingNotesString ? JSON.parse(existingNotesString) : [];
        existingNotes.unshift(newNote); // Add new note to the beginning of the array
        localStorage.setItem(PAST_NOTES_STORAGE_KEY, JSON.stringify(existingNotes));
        console.log("Note saved to localStorage:", newNote);
      } catch (error) {
        console.error("Error saving note to localStorage:", error);
        // Optionally, inform the user or log this more formally
      }
    }

    setCurrentView('success');
  };

  const handleProcessingError = (message: string, techDetails?: string, canRetry?: boolean, sessionId?: string) => {
    console.error("Processing error:", message, techDetails);
    setCurrentError({
      message: message || 'An unknown error occurred during processing.',
      technicalDetails: techDetails,
      sessionID: sessionId,
      canRetry: canRetry ?? false,
    });
    setCurrentView('error');
  };
  
  const handleReturnHomeFromError = () => {
    setCurrentError(null);
    setCurrentView('home');
  };

  const handleRetryProcessing = () => {
    console.log("Retrying processing...");
    setCurrentError(null);
    setCurrentView('processing'); // Go back to processing screen
    // TODO: Actual retry logic for the backend would be invoked here.
    // For simulation, ProcessingPage will restart its timers.
  };
  
  const handleRecordAnother = () => {
    setCurrentError(null); // Clear errors when starting afresh
    setCurrentView('home');
  };

  const handleGoToSettings = () => {
    setPreviousView(currentView); // Remember the current view
    setCurrentView('settings');
  };

  const handleNavigateBackFromSettings = () => {
    setCurrentView(previousView); // Go back to the view we were on before settings
  };
  
  const handleGoToPastNotes = () => {
    setPreviousView(currentView); // Remember current view if needed, or just go to pastNotes
    setCurrentView('pastNotes');
  };

  // const handleViewAllNotes = () => { // For future use
  //   console.log("Navigate to All Notes page");
  //   // setCurrentView('allNotes'); 
  // };

  // Render order matters for modals to stack if ever needed, though these are sequential
  if (!onboardingCompleted && showCopyrightModal) {
    return <CopyrightModal isOpen={showCopyrightModal} onAgree={handleCopyrightAgree} />;
  }
  if (!onboardingCompleted && showLecturerPermissionModal) {
    return <LecturerPermissionModal isOpen={showLecturerPermissionModal} onAgree={handleLecturerPermissionAgree} />;
  }
  // if (!onboardingCompleted && showDataPrivacyInfo) { // For later
  //   return <DataPrivacyInfo onAcknowledge={handleDataPrivacyAcknowledge} />;
  // }

  let pageContent;
  switch (currentView) {
    case 'recording':
      pageContent = <ActiveRecordingPage onStopRecording={handleStopRecording} />;
      break;
    case 'processing':
      pageContent = <ProcessingPage 
                        onProcessingComplete={handleProcessingComplete} 
                        onProcessingError={(msg) => handleProcessingError(msg, 'Processing failed internally.', true)} // Example error call
                      />;
      break;
    case 'success':
      pageContent = <SuccessPage 
                        documentTitle={processedDocumentInfo?.title}
                        documentUrl={processedDocumentInfo?.url}
                        onRecordAnother={handleRecordAnother}
                        onViewAllNotes={handleGoToPastNotes}
                      />;
      break;
    case 'error':
      pageContent = <ErrorPage 
                        errorMessage={currentError?.message}
                        technicalDetails={currentError?.technicalDetails}
                        sessionID={currentError?.sessionID}
                        onReturnHome={handleReturnHomeFromError}
                        onRetry={currentError?.canRetry ? handleRetryProcessing : undefined}
                      />;
      break;
    case 'settings':
      pageContent = <SettingsPage onNavigateBack={handleNavigateBackFromSettings} />;
      break;
    case 'pastNotes':
      pageContent = <PastNotesPage onGoHome={handleRecordAnother} />;
      break;
    case 'home':
    default:
      pageContent = <HomePage 
                        onStartRecording={handleAttemptStartRecording} 
                        onGoToSettings={handleGoToSettings} 
                        onGoToPastNotes={handleGoToPastNotes}
                      />;
      break;
  }

  return (
    <>
      {pageContent}
      {currentView === 'home' && showPreRecordingModal && (
        <PreRecordingPermissionModal 
          isOpen={showPreRecordingModal} 
          onConfirm={handlePreRecordingConfirm} 
          onCancel={handlePreRecordingCancel} 
        />
      )}
      {/* Render other global components or modals here if necessary */}
    </>
  );
}

export default App; 