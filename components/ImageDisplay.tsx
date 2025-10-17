import React, { useState } from 'react';
import { Spinner } from './Spinner';
import type { ImageState } from '../types';
import { SaveModal } from './SaveModal';
import { saveImageFile } from '../utils/saveUtils';

interface ImageDisplayProps {
  originalImage: ImageState;
  editedImage: ImageState | null;
  isLoading: boolean;
}

const QuickDownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const OptionsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);


const ImageCard: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="w-full bg-slate-900/50 backdrop-blur-lg p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
    <div className="flex justify-between items-center relative h-8">
      <h3 className="text-xl font-bold text-slate-300 font-display tracking-wide">{title}</h3>
      {action}
    </div>
    <div className="aspect-square w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
      {children}
    </div>
  </div>
);

type SaveModalState = {
  image: ImageState;
  filename: string;
} | null;

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading }) => {
  const [saveModalState, setSaveModalState] = useState<SaveModalState>(null);
  const [isQuickSaving, setIsQuickSaving] = useState<boolean>(false);

  const handleQuickSaveJPG = async (imageState: ImageState, filename: string) => {
    setIsQuickSaving(true);
    try {
      await saveImageFile(imageState, {
        filename,
        format: 'jpeg',
        quality: 95, // High quality preset
      });
    } catch (error) {
      console.error("Quick save failed:", error);
      // In a real app, you might show a toast notification here.
      alert(`Error saving image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsQuickSaving(false);
    }
  };

  const createActionButtons = (imageState: ImageState | null, filename: string, disabled: boolean) => {
    if (!imageState) return null;
    const isDisabled = disabled || isQuickSaving;

    return (
      <div className="flex items-center gap-2">
         <button
          onClick={() => handleQuickSaveJPG(imageState, filename)}
          className="p-2 bg-slate-700/80 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download as High-Quality JPG"
          aria-label="Download as High-Quality JPG"
          disabled={isDisabled}
        >
          <QuickDownloadIcon />
        </button>
        <button
          onClick={() => setSaveModalState({ image: imageState, filename })}
          className="p-2 bg-slate-700/80 text-slate-300 rounded-full hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Save with more options..."
          aria-label="Save image with more options"
          disabled={isDisabled}
        >
          <OptionsIcon />
        </button>
      </div>
    );
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <ImageCard 
            title="Original"
            action={createActionButtons(originalImage, 'original-image', isLoading || isQuickSaving)}
        >
          <img src={`data:${originalImage.mimeType};base64,${originalImage.src}`} alt="Original user upload" className="object-contain w-full h-full"/>
        </ImageCard>
        
        <ImageCard 
          title="Edited"
          action={createActionButtons(editedImage, 'edited-image', isLoading || !editedImage || isQuickSaving)}
        >
          {isLoading && !editedImage ? (
            <Spinner />
          ) : editedImage ? (
            <img 
              src={`data:${editedImage.mimeType};base64,${editedImage.src}`} 
              alt="AI edited result" 
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="text-slate-500 text-center p-4">
              <p>Your AI-generated image will appear here.</p>
            </div>
          )}
        </ImageCard>
      </div>

      {saveModalState && (
        <SaveModal 
            imageState={saveModalState.image}
            defaultFilename={saveModalState.filename}
            onClose={() => setSaveModalState(null)}
        />
      )}
    </>
  );
};
