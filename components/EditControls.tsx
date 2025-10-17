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
  imageCount: number;
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    )
};


export const EditControls: React.FC<EditControlsProps> = ({ 
  prompt, setPrompt, onGenerate, isLoading, onReset, 
  isMagicPromptLoading, onMagicPrompt,
  brightness, setBrightness, contrast, setContrast,
  imageCount
}) => {
  const isAnyLoading = isLoading || isMagicPromptLoading;
  const generateButtonText = imageCount > 1 ? `Generate All (${imageCount})` : 'Generate';

  return (
    <div className="bg-slate-900/50 backdrop-blur-lg p-4 rounded-xl border border-slate-800 w-full flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full">
            <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'make the background a vibrant, futuristic cityscape'"
            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 outline-none transition-all"
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
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onGenerate}
            disabled={isAnyLoading || !prompt.trim()}
            className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold rounded-lg hover:from-sky-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shadow-sky-500/10"
            title={imageCount > 1 ? `Generate new versions for all ${imageCount} images` : 'Generate a new version of the image'}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : generateButtonText}
          </button>
          <button
            onClick={onReset}
            disabled={isAnyLoading}
            className="p-3 bg-slate-800/80 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors border border-slate-700"
            title="Clear all images and start over"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
          <div>
              <label htmlFor="brightness" className="block text-sm font-medium text-slate-400 mb-2">Brightness: <span className="font-semibold text-slate-200">{brightness - 100}</span></label>
              <input
                  type="range"
                  id="brightness"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isAnyLoading}
                  title="Adjust the brightness of the final edited image"
              />
          </div>
          <div>
              <label htmlFor="contrast" className="block text-sm font-medium text-slate-400 mb-2">Contrast: <span className="font-semibold text-slate-200">{contrast - 100}</span></label>
              <input
                  type="range"
                  id="contrast"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isAnyLoading}
                  title="Adjust the contrast of the final edited image"
              />
          </div>
      </div>
    </div>
  );
};