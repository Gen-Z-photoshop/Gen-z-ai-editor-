import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, handleDragEvents]);

  const dragOverClasses = isDragging ? 'border-blue-500 bg-slate-800/50' : 'border-slate-700';
  
  return (
    <div className="w-full max-w-2xl text-center flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-semibold mb-2">Start by uploading a photo</h2>
        <p className="text-slate-400 mb-8">Let your creativity run wild. Edit your photos with a simple text prompt.</p>
        <label
            htmlFor="file-upload"
            className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed ${dragOverClasses} rounded-lg cursor-pointer transition-colors duration-300 hover:bg-slate-800/50 hover:border-blue-500`}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon />
                <p className="mb-2 text-sm text-slate-400">
                    <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">PNG, JPG, GIF or WEBP</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
        </label>
    </div>
  );
};