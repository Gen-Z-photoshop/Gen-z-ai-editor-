import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 group-hover:text-sky-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files);
    }
  }, [onImageUpload, handleDragEvents]);

  const dragOverClasses = isDragging ? 'border-sky-400 bg-slate-800/50 shadow-lg shadow-sky-500/10' : 'border-slate-800';
  
  return (
    <div className="w-full max-w-2xl text-center flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-bold mb-2 font-display">Start Your Creation</h2>
        <p className="text-slate-400 mb-8 max-w-md">Unleash your creativity. Upload single or multiple photos and transform them with a simple text prompt.</p>
        <label
            htmlFor="file-upload"
            className={`group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed ${dragOverClasses} rounded-xl cursor-pointer transition-all duration-300 hover:border-sky-400`}
            onDragEnter={(e) => handleDragEvents(e, true)}
            onDragLeave={(e) => handleDragEvents(e, false)}
            onDragOver={(e) => handleDragEvents(e, true)}
            onDrop={handleDrop}
            title="Click or drag and drop images to upload"
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon />
                <p className="mb-2 text-sm text-slate-400 mt-4">
                    <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP, and more.</p>
            </div>
            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" multiple />
        </label>
    </div>
  );
};