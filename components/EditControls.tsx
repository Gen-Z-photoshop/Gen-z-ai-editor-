import React from 'react';

interface EditControlsProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onReset: () => void;
  isMagicPromptLoading: boolean;
  onMagicPrompt: () => void;
  brightness: number;
  setBrightness: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
}

const MagicWandIcon: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
    if (isLoading) {
        return (
            <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    )
};


export const EditControls: React.FC<EditControlsProps> = ({ 
  prompt, setPrompt, onGenerate, isLoading, onReset, 
  isMagicPromptLoading, onMagicPrompt,
  brightness, setBrightness, contrast, setContrast
}) => {
  const isAnyLoading = isLoading || isMagicPromptLoading;
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 w-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full">
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'add a futuristic cyberpunk city in the background'"
            className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={isAnyLoading}
            />
            <button
                onClick={onMagicPrompt}
                disabled={isAnyLoading}
                title="Generate a creative prompt"
                aria-label="Generate a creative prompt"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full group hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
                <MagicWandIcon isLoading={isMagicPromptLoading} />
            </button>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onGenerate}
            disabled={isAnyLoading || !prompt.trim()}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate'}
          </button>
          <button
            onClick={onReset}
            disabled={isAnyLoading}
            className="p-3 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 disabled:opacity-50 transition-colors"
            title="Upload new image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label htmlFor="brightness" className="block text-sm font-medium text-slate-400 mb-1">Brightness: {brightness - 100}</label>
              <input
                  type="range"
                  id="brightness"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  disabled={isAnyLoading}
              />
          </div>
          <div>
              <label htmlFor="contrast" className="block text-sm font-medium text-slate-400 mb-1">Contrast: {contrast - 100}</label>
              <input
                  type="range"
                  id="contrast"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  disabled={isAnyLoading}
              />
          </div>
      </div>
    </div>
  );
};