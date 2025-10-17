import React, { useState } from 'react';
import { Spinner } from './Spinner';
import type { ImageState } from '../types';
import { SaveModal } from './SaveModal';

interface ImageDisplayProps {
  originalImage: ImageState;
  editedImage: ImageState | null;
  isLoading: boolean;
  brightness: number;
  contrast: number;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ImageCard: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="w-full bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col gap-3">
    <div className="flex justify-center items-center relative h-8">
      <h3 className="text-lg font-semibold text-slate-400">{title}</h3>
      {action && <div className="absolute right-0 top-1/2 -translate-y-1/2">{action}</div>}
    </div>
    <div className="aspect-square w-full bg-slate-900 rounded-md overflow-hidden flex items-center justify-center">
      {children}
    </div>
  </div>
);

type SaveModalState = {
  image: ImageState;
  filename: string;
} | null;

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ originalImage, editedImage, isLoading, brightness, contrast }) => {
  const [saveModalState, setSaveModalState] = useState<SaveModalState>(null);

  const createDownloadButton = (imageState: ImageState | null, filename: string, disabled: boolean) => {
    if (!imageState) return null;
    return (
      <button
        onClick={() => setSaveModalState({ image: imageState, filename })}
        className="p-2 bg-slate-700 text-slate-300 rounded-full hover:bg-slate-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Save image as..."
        aria-label="Save image with options"
        disabled={disabled}
      >
        <DownloadIcon />
      </button>
    );
  };

  const editedImageStyle = {
    filter: `brightness(${brightness / 100}) contrast(${contrast / 100})`,
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <ImageCard 
            title="Original"
            action={createDownloadButton(originalImage, 'original-image', isLoading)}
        >
          <img src={`data:${originalImage.mimeType};base64,${originalImage.src}`} alt="Original user upload" className="object-contain w-full h-full"/>
        </ImageCard>
        
        <ImageCard 
          title="Edited"
          action={createDownloadButton(editedImage, 'edited-image', isLoading || !editedImage)}
        >
          {isLoading && !editedImage ? (
            <Spinner />
          ) : editedImage ? (
            <img 
              src={`data:${editedImage.mimeType};base64,${editedImage.src}`} 
              alt="AI edited result" 
              className="object-contain w-full h-full"
              style={editedImageStyle}
            />
          ) : (
            <div className="text-slate-500 text-center p-4">
              <p>Your generated image will appear here.</p>
            </div>
          )}
        </ImageCard>
      </div>

      {saveModalState && (
        <SaveModal 
            imageState={saveModalState.image}
            defaultFilename={saveModalState.filename}
            onClose={() => setSaveModalState(null)}
            brightness={brightness}
            contrast={contrast}
        />
      )}
    </>
  );
};