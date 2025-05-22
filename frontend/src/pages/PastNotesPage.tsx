import React, { useState, useEffect } from 'react';
import { FiFileText, FiSearch, FiMoreVertical, FiEdit, FiTrash2, FiExternalLink, FiHome } from 'react-icons/fi';
import { SiGoogledocs as GoogleDocsIcon } from 'react-icons/si';

const PAST_NOTES_STORAGE_KEY = 'autoNotesAI_pastNotes';

// Define a type for individual note items
interface NoteItem {
  id: string;
  title: string;
  dateProcessed: string; // ISO string format
  googleDocUrl: string;
  duration?: string; 
}

interface PastNotesPageProps {
  onGoHome?: () => void;
}

// Mock data removed, will be loaded from localStorage
// const mockNotes: NoteItem[] = [...];

const PastNotesPage: React.FC<PastNotesPageProps> = ({ onGoHome }) => {
  const [notes, setNotes] = useState<NoteItem[]>([]); // Initial state is empty array
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  // Add other states for sorting, filtering, etc.

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedNotesString = localStorage.getItem(PAST_NOTES_STORAGE_KEY);
      if (storedNotesString) {
        const storedNotes: NoteItem[] = JSON.parse(storedNotesString);
        // Sort by dateProcessed by default (newest first)
        storedNotes.sort((a, b) => new Date(b.dateProcessed).getTime() - new Date(a.dateProcessed).getTime());
        setNotes(storedNotes);
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      // Handle error, e.g., set an error state
    }
    setIsLoading(false);
  }, []);

  const handleOpenDoc = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  // Filtered and sorted notes would be derived here
  const displayedNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format date string (basic example)
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-charcoal text-off-white flex items-center justify-center p-4 sm:p-8 font-sans">
        {/* Basic Loading Spinner - Can be replaced with skeleton cards */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-electric-teal"></div>
        <p className="ml-4 text-xl">Loading your notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-off-white">My Lecture Notes</h1>
            {displayedNotes.length > 0 && (
              <p className="text-sm text-cool-gray mt-1">You have {displayedNotes.length} saved note{displayedNotes.length === 1 ? '' : 's'}.</p>
            )}
          </div>
          {onGoHome && (
            <button 
              onClick={onGoHome}
              className="flex items-center px-4 py-2 bg-electric-teal text-deep-charcoal font-semibold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-offset-2 focus:ring-offset-dark-slate text-sm whitespace-nowrap"
            >
              <FiHome size={18} className="mr-2" />
              Go to Home
            </button>
          )}
        </header>

        {/* Controls Area: Search and Sort - Basic Implementation */}
        <div className="mb-8 p-4 bg-dark-slate rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search notes by title..."
                className="w-full bg-deep-charcoal border border-gray-divider text-off-white rounded-md p-3 pl-10 text-sm focus:ring-electric-teal focus:border-electric-teal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cool-gray" size={18}/>
            </div>
            {/* Basic Sort Placeholder - More advanced sorting can be added */}
            {/* 
            <div className="flex-shrink-0">
              <select className="bg-deep-charcoal border border-gray-divider text-off-white rounded-md p-3 text-sm focus:ring-electric-teal focus:border-electric-teal h-full">
                <option>Sort by: Date (Newest)</option>
                <option>Sort by: Date (Oldest)</option>
                <option>Sort by: Title (A-Z)</option>
                <option>Sort by: Title (Z-A)</option>
              </select>
            </div>
            */}
          </div>
        </div>

        {/* List of Note Items */}
        {displayedNotes.length > 0 ? (
          <div className="space-y-6">
            {displayedNotes.map((note) => (
              <div 
                key={note.id} 
                className="bg-dark-slate p-5 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start gap-4"
              >
                <div className="flex-grow">
                  <h2 className="text-lg sm:text-xl font-semibold text-off-white mb-1 break-words">{note.title}</h2>
                  <p className="text-xs sm:text-sm text-cool-gray mb-1">Processed: {formatDate(note.dateProcessed)}</p>
                  {note.duration && (
                    <p className="text-xs sm:text-sm text-cool-gray mb-3">Duration: {note.duration}</p>
                  )}
                </div>
                <div className="flex-shrink-0 mt-3 sm:mt-0 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => handleOpenDoc(note.googleDocUrl)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-electric-teal text-deep-charcoal font-semibold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-offset-2 focus:ring-offset-dark-slate text-sm whitespace-nowrap"
                  >
                    <GoogleDocsIcon size={18} className="mr-2" />
                    Open Notes
                  </button>
                  {/* Placeholder for kebab menu / secondary actions */}
                  {/* <button className="p-2 text-cool-gray hover:text-electric-teal rounded-full"><FiMoreVertical size={20} /></button> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <FiFileText size={64} className="mx-auto text-cool-gray mb-6" />
            <h2 className="text-2xl font-semibold text-off-white mb-2">No lecture notes found.</h2>
            {searchTerm && displayedNotes.length === 0 ? (
                 <p className="text-cool-gray">No notes match your search for "{searchTerm}". Try a different term.</p>
            ) : (
              <>
                <p className="text-cool-gray mb-6">
                    You haven't recorded any lectures yet. 
                    <br />Ready to create your first set of smart notes?
                </p>
                {onGoHome && !searchTerm && (
                  <button 
                    onClick={onGoHome}
                    className="mt-4 px-6 py-2 bg-electric-teal text-deep-charcoal font-semibold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-offset-2 focus:ring-offset-dark-slate text-sm"
                  >
                    Start New Recording
                  </button>
                )}
              </>
            )}
          </div>
        )}
        
        {/* Pagination Placeholder */}
        {/* 
        {displayedNotes.length > 20 && ( // Example condition for showing pagination
          <div className="mt-10 flex justify-center">
            <span className="px-3 py-1 bg-dark-slate rounded-md text-sm text-cool-gray">Pagination controls would go here</span>
          </div>
        )} 
        */}

      </div>
    </div>
  );
};

// Need to import useState and useEffect from React if they are used more extensively.
// For now, useState is used for mockNotes.
// import { useState, useEffect } from 'react'; // This line is duplicated at the top, will remove from here.

export default PastNotesPage; 