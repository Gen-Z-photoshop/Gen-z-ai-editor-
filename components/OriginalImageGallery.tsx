import React from 'react';
import type { ImageState } from '../types';

interface OriginalImageGalleryProps {
  images: ImageState[];
  activeIndex: number;
  onSelect: (index: number) => void;
  processingIndex: number | null;
  isBatchProcessing: boolean;
}

const Thumbnail: React.FC<{
  image: ImageState;
  isSelected: boolean;
  isProcessing: boolean;
  onClick: () => void;
  index: number;
  isBatchProcessing: boolean;
}> = ({ image, isSelected, isProcessing, onClick, index, isBatchProcessing }) => {
  const selectionClasses = isSelected && !isBatchProcessing
    ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-sky-500'
    : 'ring-2 ring-slate-700/50 hover:ring-sky-500';

  return (
    <button
      onClick={onClick}
      className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:opacity-75 disabled:cursor-not-allowed ${selectionClasses}`}
      aria-pressed={isSelected}
      aria-label={`Select original image #${index + 1}`}
      disabled={isBatchProcessing}
      title={`View original image #${index + 1}`}
    >
      <img
        src={`data:${image.mimeType};base64,${image.src}`}
        alt={`Original image thumbnail ${index + 1}`}
        className="w-full h-full object-cover"
      />
      {isProcessing && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center" aria-label="Processing image">
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-sky-500"></div>
        </div>
      )}
    </button>
  );
};

export const OriginalImageGallery: React.FC<OriginalImageGalleryProps> = ({
  images,
  activeIndex,
  onSelect,
  processingIndex,
  isBatchProcessing,
}) => {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-lg p-4 rounded-xl border border-slate-800">
      <h3 className="text-xl font-bold text-slate-300 font-display tracking-wide mb-4">Uploaded Images</h3>
      <div className="flex items-center gap-4 overflow-x-auto pb-2 -mx-4 px-4">
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            index={index}
            isSelected={index === activeIndex}
            isProcessing={index === processingIndex}
            onClick={() => onSelect(index)}
            isBatchProcessing={isBatchProcessing}
          />
        ))}
      </div>
    </div>
  );
};