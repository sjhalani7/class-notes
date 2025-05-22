import React, { useState, useEffect } from 'react';
import { FiKey, FiFileText, FiUserCheck, FiInfo, FiMic, FiSave, FiRotateCcw, FiLogIn, FiLogOut, FiLink2, FiLoader, FiChevronLeft } from 'react-icons/fi';
// Potentially SiGoogledocs from 'react-icons/si' for Google icon

// Placeholder for where API keys and prompts would be stored/retrieved
// In a real app, this would come from localStorage, context, backend, etc.
const initialSettings = {
  openaiWhisperApiKey: '',
  openaiGptApiKey: '',
  customPrompt: `You are an expert note taker. You are going to be fed in a transcript of a class session, and your job is to extract information from the lecture transcript as if taking notes in class to best capture the material.\nMake sure you extract all relevant information, including any mentions of important topics for exams, or anything else that may be important. \nMake sure to take detailed notes about the material covered in class. Try to keep them detailed and relevant, but concise where needed. \nYou will format it into three possible categories: title, subtitle, and body. \nEach subtopic discussed in the lecture will have an overall title. \nEach title will then have multiple subtitles. \nEach subtitle will have a body that expands on the information in the subtitle. \nThe professor said that test will cover her slides, discussions and questions in class. So think about that as you format the notes. \n\n\n**SPECIAL TOPICS**\n- IF the professor talks about the test, or something about "pay extra attention to" or topics they mention may be important for the test, put them in a "Test Focus" section. Do not add this section if the test is not mentioned or hinted about. \n- The second to last section should be an "AI Supplemental" section, where you build on your own knowledge and add short clarifications/helpful information to the material provided. When possible, try to draw metaphorical analogies, but don't force anything. \n- At the end, so the last topic, should be a "Summary" topic that essentially summarizes the topics discussed. \n\nYour input will be a big blob of text which is the lecture transcript. There can be multiple different topics discussed in a given lecture transcript. You must analyze the material provided and determine the right time to separate lecture notes into different topics or not.`,
  googleUserEmail: null as string | null, // e.g., 'user@example.com' or null
};

// Props for the SettingsPage, e.g., if it needs to navigate back or interact with App state
interface SettingsPageProps {
  onNavigateBack?: () => void; // Example: For a back button if not using router
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigateBack }) => {
  const [whisperKey, setWhisperKey] = useState(initialSettings.openaiWhisperApiKey);
  const [gptKey, setGptKey] = useState(initialSettings.openaiGptApiKey);
  const [prompt, setPrompt] = useState(initialSettings.customPrompt);
  const [googleUser, setGoogleUser] = useState<string | null>(initialSettings.googleUserEmail);

  // States for save feedback
  const [apiKeySaveStatus, setApiKeySaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [promptSaveStatus, setPromptSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Simulate loading settings on mount (replace with actual loading logic)
  useEffect(() => {
    // In a real app, load these from localStorage or a backend service
    console.log("SettingsPage mounted, ideally load saved settings here.");
    // Example: Simulate connecting to Google
    // setGoogleUser('test.user@example.com'); 
  }, []);

  const handleSaveApiKeys = () => {
    setApiKeySaveStatus('saving');
    console.log('Saving API Keys:', { whisperKey, gptKey });
    // Simulate API call
    setTimeout(() => {
      // localStorage.setItem('whisperKey', whisperKey);
      // localStorage.setItem('gptKey', gptKey);
      setApiKeySaveStatus('saved');
      setTimeout(() => setApiKeySaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleSavePrompt = () => {
    setPromptSaveStatus('saving');
    console.log('Saving Custom Prompt:', prompt);
    setTimeout(() => {
      // localStorage.setItem('customPrompt', prompt);
      setPromptSaveStatus('saved');
      setTimeout(() => setPromptSaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleResetPrompt = () => {
    setPrompt(initialSettings.customPrompt); // Reset to default from initialSettings
    // User still needs to click "Save Custom Prompt" to persist this reset
  };

  const handleGoogleConnect = () => {
    console.log('Attempting to connect Google Account...');
    // Simulate Google Auth flow
    setGoogleUser('connected.user@example.com');
  };

  const handleGoogleDisconnect = () => {
    console.log('Disconnecting Google Account...');
    setGoogleUser(null);
  };

  const renderSaveButtonContent = (status: 'idle' | 'saving' | 'saved' | 'error', defaultText: string) => {
    if (status === 'saving') return <FiLoader className="animate-spin h-5 w-5 mx-auto" />;
    if (status === 'saved') return <span className="text-vivid-mint-green">Saved!</span>;
    if (status === 'error') return <span className="text-bright-coral">Error!</span>;
    return defaultText;
  };

  return (
    <div className="min-h-screen bg-deep-charcoal text-off-white p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          {onNavigateBack && (
             <button onClick={onNavigateBack} className="text-cool-gray hover:text-electric-teal mb-4 flex items-center text-sm">
               <FiChevronLeft size={20} className="mr-1" /> Back
             </button>
          )}
          <h1 className="text-4xl font-bold text-off-white">Settings</h1>
        </header>

        <div className="space-y-12">
          {/* Section 1: API Key Management */}
          <section id="api-keys" className="p-6 bg-dark-slate rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-off-white mb-2 flex items-center">
              <FiKey size={24} className="mr-3 text-electric-teal" /> API Key Management
            </h2>
            <p className="text-sm text-cool-gray mb-6">
              Provide your OpenAI API keys. These are used for audio transcription and note generation and are stored locally in your browser.
            </p>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="whisperKey" className="block text-sm font-medium text-off-white mb-1">OpenAI Whisper API Key</label>
                <input 
                  type="password"
                  id="whisperKey"
                  value={whisperKey}
                  onChange={(e) => setWhisperKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-deep-charcoal border border-gray-divider text-off-white rounded-md p-3 text-sm focus:ring-electric-teal focus:border-electric-teal"
                />
                <p className="text-xs text-cool-gray mt-1">Used for audio transcription.</p>
              </div>

              <div>
                <label htmlFor="gptKey" className="block text-sm font-medium text-off-white mb-1">OpenAI GPT API Key</label>
                <input 
                  type="password"
                  id="gptKey"
                  value={gptKey}
                  onChange={(e) => setGptKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-deep-charcoal border border-gray-divider text-off-white rounded-md p-3 text-sm focus:ring-electric-teal focus:border-electric-teal"
                />
                <p className="text-xs text-cool-gray mt-1">Used for note generation and structuring.</p>
              </div>

              <button
                onClick={handleSaveApiKeys}
                disabled={apiKeySaveStatus === 'saving'}
                className="w-full sm:w-auto mt-2 px-6 py-2.5 bg-electric-teal text-deep-charcoal font-semibold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-offset-2 focus:ring-offset-dark-slate transition-all duration-150 flex items-center justify-center min-w-[120px]"
              >
                {renderSaveButtonContent(apiKeySaveStatus, 'Save API Keys')}
              </button>
            </div>
          </section>

          {/* Section 2: Prompt Customization */}
          <section id="prompt-customization" className="p-6 bg-dark-slate rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-off-white mb-2 flex items-center">
              <FiFileText size={24} className="mr-3 text-electric-teal" /> Note Generation Prompt
            </h2>
            <p className="text-sm text-cool-gray mb-6">
              Customize the instructions given to the AI for structuring your notes. Advanced users only. Click "Save" to apply changes.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="customPrompt" className="block text-sm font-medium text-off-white mb-1">Custom Prompt</label>
                <textarea 
                  id="customPrompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={15}
                  className="w-full bg-deep-charcoal border border-gray-divider text-off-white rounded-md p-3 text-sm focus:ring-electric-teal focus:border-electric-teal scrollbar-thin scrollbar-thumb-electric-teal/70 scrollbar-track-deep-charcoal/50"
                  placeholder="Enter your custom AI prompt here..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSavePrompt}
                  disabled={promptSaveStatus === 'saving'}
                  className="px-6 py-2.5 bg-electric-teal text-deep-charcoal font-semibold rounded-md hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-electric-teal focus:ring-offset-2 focus:ring-offset-dark-slate transition-all duration-150 flex items-center justify-center min-w-[150px] order-1 sm:order-2"
                >
                  {renderSaveButtonContent(promptSaveStatus, 'Save Custom Prompt')}
                </button>
                <button
                  onClick={handleResetPrompt}
                  className="px-6 py-2.5 text-cool-gray font-medium rounded-md border border-cool-gray hover:bg-gray-divider hover:text-off-white focus:outline-none focus:ring-2 focus:ring-cool-gray focus:ring-offset-2 focus:ring-offset-dark-slate transition-colors duration-150 order-2 sm:order-1"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Google Account Integration - Placeholder */}
          <section id="google-account">
            <h2 className="text-2xl font-semibold text-off-white mb-2">Google Account</h2>
            {/* Google connection status and buttons will go here */}
          </section>

          {/* Section 4: Legal & Privacy - Placeholder */}
          <section id="legal-privacy">
            <h2 className="text-2xl font-semibold text-off-white mb-2">Legal & Privacy</h2>
            {/* Links to policies will go here */}
          </section>

          {/* Section 5: User Guidance - Placeholder */}
          <section id="audio-quality">
            <h2 className="text-2xl font-semibold text-off-white mb-2">Audio Quality Tip</h2>
            {/* Guidance text will go here */}
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 