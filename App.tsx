
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { EditControls } from './components/EditControls';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { ImageHistory } from './components/ImageHistory';
import { OriginalImageGallery } from './components/OriginalImageGallery';
import { editImageWithPrompt, generateMagicPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { ImageState } from './types';
import { ApiKeySelector } from './components/ApiKeySelector';
import { Spinner } from './components/Spinner';

// FIX: Define AIStudio interface to match existing global declarations and resolve TypeScript errors.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [isCheckingApiKey, setIsCheckingApiKey] = useState<boolean>(true);

  const [originalImages, setOriginalImages] = useState<ImageState[]>([]);
  const [activeOriginalImageIndex, setActiveOriginalImageIndex] = useState<number>(0);
  const [editedImageHistories, setEditedImageHistories] = useState<Record<number, ImageState[]>>({});
  const [selectedEditedImageIndices, setSelectedEditedImageIndices] = useState<Record<number, number | null>>({});

  const [prompt, setPrompt] = useState<string>('');
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [processingImageIndex, setProcessingImageIndex] = useState<number | null>(null);
  const [isMagicPromptLoading, setIsMagicPromptLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
        try {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setHasApiKey(hasKey);
            } else {
                console.warn('aistudio API not found, proceeding without key check.');
                setHasApiKey(true);
            }
        } catch (e) {
            console.error("Error checking for API key:", e);
            setHasApiKey(false);
        } finally {
            setIsCheckingApiKey(false);
        }
    };
    checkApiKey();
  }, []);

  const handleKeySelected = () => {
    setHasApiKey(true);
  };
  
  const handleApiError = (err: unknown) => {
    console.error(`API Error:`, err);
    const genericMessage = 'An unknown error occurred.';
    let errorMessage = err instanceof Error ? err.message : genericMessage;

    if (typeof errorMessage === 'string') {
        if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
            return "You have exceeded the quota for your selected API key. Please check your plan and billing details with Google AI Studio.";
        } else if (errorMessage.includes("Requested entity was not found")) {
            setHasApiKey(false); // Reset to show the key selector again
            return "The selected API key is invalid. Please select a valid key to continue.";
        }
    }
    
    return `An API error occurred. Details: ${errorMessage}`;
  };

  const resetState = useCallback(() => {
    setOriginalImages([]);
    setActiveOriginalImageIndex(0);
    setEditedImageHistories({});
    setSelectedEditedImageIndices({});
    setPrompt('');
    setError(null);
    setIsBatchProcessing(false);
    setProcessingImageIndex(null);
  }, []);

  const handleImageUpload = useCallback(async (files: FileList) => {
    if (!files || files.length === 0) return;
    resetState();
    try {
      const imagePromises = Array.from(files).map(file => fileToBase64(file));
      const imagesData = await Promise.all(imagePromises);
      setOriginalImages(imagesData.map(data => ({ src: data.base64, mimeType: data.mimeType })));
      setActiveOriginalImageIndex(0);
    } catch (err) {
      setError('Failed to load images. Please try again.');
      console.error(err);
    }
  }, [resetState]);
  
  const handleGenerate = useCallback(async () => {
    if (originalImages.length === 0 || !prompt.trim()) {
      setError('Please upload at least one image and enter a prompt.');
      return;
    }

    setIsBatchProcessing(true);
    setError(null);

    for (let i = 0; i < originalImages.length; i++) {
        setProcessingImageIndex(i);
        setActiveOriginalImageIndex(i); // Follow the processing live
        const currentImage = originalImages[i];
        
        try {
            const newImage = await editImageWithPrompt(currentImage.src, currentImage.mimeType, prompt);
            
            setEditedImageHistories(prevHistories => {
                const newHistory = [...(prevHistories[i] || []), newImage];
                setSelectedEditedImageIndices(prevIndices => ({
                    ...prevIndices,
                    [i]: newHistory.length - 1,
                }));
                return {
                    ...prevHistories,
                    [i]: newHistory,
                };
            });
        } catch (err) {
            const friendlyError = handleApiError(err);
            setError(`Failed to generate image ${i + 1}: ${friendlyError} Batch processing stopped.`);
            break; // Stop processing on error
        }
    }

    setProcessingImageIndex(null);
    setIsBatchProcessing(false);
  }, [originalImages, prompt]);

  const handleMagicPrompt = useCallback(async () => {
    setIsMagicPromptLoading(true);
    setError(null);
    try {
        const enhancedPrompt = await generateMagicPrompt(prompt);
        setPrompt(enhancedPrompt);
    } catch (err) {
        const friendlyError = handleApiError(err);
        setError(`Magic prompt failed: ${friendlyError}`);
    } finally {
        setIsMagicPromptLoading(false);
    }
  }, [prompt]);

  const handleSelectEditedImage = (imageIndex: number) => {
    setSelectedEditedImageIndices(prev => ({
        ...prev,
        [activeOriginalImageIndex]: imageIndex
    }));
  };

  const activeOriginalImage = originalImages.length > 0 ? originalImages[activeOriginalImageIndex] : null;
  const activeEditedHistory = editedImageHistories[activeOriginalImageIndex] || [];
  const activeSelectedEditedImageIndex = selectedEditedImageIndices[activeOriginalImageIndex] ?? null;
  const selectedEditedImage = activeSelectedEditedImageIndex !== null ? activeEditedHistory[activeSelectedEditedImageIndex] : null;
  const isCurrentlyProcessingActive = processingImageIndex === activeOriginalImageIndex;
  
  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <Header />
      {isCheckingApiKey ? (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
          <Spinner />
        </main>
      ) : !hasApiKey ? (
        <ApiKeySelector onKeySelect={handleKeySelected} />
      ) : (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
          {!activeOriginalImage ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <div className="w-full max-w-6xl flex flex-col gap-8">
              <EditControls 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isBatchProcessing}
                onReset={resetState}
                isMagicPromptLoading={isMagicPromptLoading}
                onMagicPrompt={handleMagicPrompt}
                imageCount={originalImages.length}
              />
               {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md w-full text-center -mt-4">
                  <p>{error}</p>
                </div>
              )}
              <OriginalImageGallery
                images={originalImages}
                activeIndex={activeOriginalImageIndex}
                onSelect={setActiveOriginalImageIndex}
                processingIndex={processingImageIndex}
                isBatchProcessing={isBatchProcessing}
              />
              <ImageDisplay 
                originalImage={activeOriginalImage} 
                editedImage={selectedEditedImage} 
                isLoading={isCurrentlyProcessingActive}
              />
              <ImageHistory 
                images={activeEditedHistory}
                selectedIndex={activeSelectedEditedImageIndex}
                onSelect={handleSelectEditedImage}
                isLoading={isCurrentlyProcessingActive}
              />
            </div>
          )}
        </main>
      )}
      <Footer />
    </div>
  );
};

export default App;