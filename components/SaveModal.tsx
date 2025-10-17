import React, { useState, useEffect } from 'react';
import type { ImageState } from '../types';
import { convertDataUrlToBlob } from '../utils/imageUtils';

interface SaveModalProps {
  imageState: ImageState | null;
  defaultFilename: string;
  onClose: () => void;
  brightness: number;
  contrast: number;
}

export const SaveModal: React.FC<SaveModalProps> = ({ imageState, defaultFilename, onClose, brightness, contrast }) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState<number>(92);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (imageState?.mimeType === 'image/png') {
        setFormat('png');
    } else {
        setFormat('jpeg');
    }
  }, [imageState]);

  if (!imageState) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Fix: Use a conditional to ensure correct type inference for mimeType.
    const mimeType: 'image/png' | 'image/jpeg' = `image/${format}` as 'image/png' | 'image/jpeg';
    const fileExtension = format;
    const filenameWithExt = `${defaultFilename}.${fileExtension}`;
    const dataUrl = `data:${imageState.mimeType};base64,${imageState.src}`;
    
    try {
        const blob = await convertDataUrlToBlob(dataUrl, mimeType, {
          quality: quality / 100,
          brightness: brightness / 100,
          contrast: contrast / 100,
        });

        if (!blob) {
            throw new Error("Failed to convert image.");
        }

        if ('showSaveFilePicker' in window) {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: filenameWithExt,
                types: [{
                    description: `${format.toUpperCase()} Image`,
                    accept: { [mimeType]: [`.${fileExtension}`] },
                }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        } else {
            // Fallback for older browsers
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filenameWithExt;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        onClose();
    } catch (err: any) {
        if (err.name === 'AbortError') {
             console.log("Save operation cancelled by user.");
        } else {
            console.error("Save failed:", err);
            setError("Could not save the image. Please try again.");
        }
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="save-modal-title">
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md border border-slate-700" onClick={(e) => e.stopPropagation()}>
        <h2 id="save-modal-title" className="text-2xl font-bold mb-4 font-display">Save Image</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">File Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setFormat('png')} className={`px-4 py-2 rounded-lg text-sm w-full transition-colors duration-200 border-2 ${format === 'png' ? 'bg-sky-500/20 border-sky-500 text-white' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`} title="Save as a lossless PNG file. Best for quality.">PNG</button>
              <button onClick={() => setFormat('jpeg')} className={`px-4 py-2 rounded-lg text-sm w-full transition-colors duration-200 border-2 ${format === 'jpeg' ? 'bg-sky-500/20 border-sky-500 text-white' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`} title="Save as a compressed JPEG file. Smaller file size.">JPEG</button>
            </div>
          </div>

          {format === 'jpeg' && (
            <div>
              <label htmlFor="quality" className="block text-sm font-medium text-slate-400 mb-2">Quality: <span className="font-semibold text-slate-200">{quality}</span></label>
              <input
                type="range"
                id="quality"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                title="Adjust compression quality. Lower values mean smaller file size."
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 transition-colors" title="Close this dialog without saving">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold hover:from-sky-500 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-wait transition-all flex items-center"
            title="Save the image to your device"
          >
            {isSaving && (
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};