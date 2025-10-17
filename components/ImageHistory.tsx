
import React from 'react';
import type { ImageState } from '../types';

interface ImageHistoryProps {
  images: ImageState[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  isLoading: boolean;
}

const Thumbnail: React.FC<{
  image: ImageState;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}> = ({ image, isSelected, onClick, index }) => {
  const selectionClasses = isSelected
    ? 'ring-4 ring-offset-2 ring-offset-slate-800 ring-blue-500'
    : 'ring-2 ring-slate-700 hover:ring-blue-500';

  return (
    <button
      onClick={onClick}
      className={`w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 ${selectionClasses}`}
      aria-pressed={isSelected}
      aria-label={`Select edited image #${index + 1}`}
    >
      <img
        src={`data:${image.mimeType};base64,${image.src}`}
        alt={`Edited image history thumbnail ${index + 1}`}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

const LoadingThumbnail: React.FC = () => {
    return (
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-slate-900 border-2 border-slate-700 flex items-center justify-center flex-shrink-0" aria-label="Generating new image">
            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-blue-500"></div>
        </div>
    );
};


export const ImageHistory: React.FC<ImageHistoryProps> = ({
  images,
  selectedIndex,
  onSelect,
  isLoading,
}) => {
  if (images.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="w-full bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-400 mb-4">History</h3>
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <Thumbnail
            key={index}
            image={image}
            index={index}
            isSelected={index === selectedIndex}
            onClick={() => onSelect(index)}
          />
        ))}
        {isLoading && <LoadingThumbnail />}
      </div>
    </div>
  );
};
