import React from 'react';

interface ApiKeySelectorProps {
  onKeySelect: () => void;
}

const KeyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 group-hover:text-sky-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h1a2 2 0 012 2" />
    </svg>
);

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelect }) => {
  const handleSelectKey = async () => {
    try {
      await window.aistudio.openSelectKey();
      onKeySelect();
    } catch (e) {
      console.error('Error opening API key selection dialog:', e);
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl text-center flex flex-col items-center justify-center p-8 bg-slate-900/50 backdrop-blur-lg rounded-xl border border-slate-800">
            <KeyIcon />
            <h2 className="text-4xl font-bold mt-6 mb-2 font-display">API Key Required</h2>
            <p className="text-slate-400 mb-6 max-w-md">
                This AI-powered editor requires a Google Gemini API key to function. 
                Please select your key to continue.
            </p>
            <button
                onClick={handleSelectKey}
                className="w-full max-w-xs flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg hover:from-sky-500 hover:to-cyan-400 transition-all shadow-md hover:shadow-lg shadow-sky-500/10"
            >
                Select Your API Key
            </button>
            <p className="text-xs text-slate-500 mt-4">
                This helps manage usage and prevent rate-limiting. For more information on API keys and billing, see the{' '}
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">
                    official documentation
                </a>.
            </p>
        </div>
    </div>
  );
};