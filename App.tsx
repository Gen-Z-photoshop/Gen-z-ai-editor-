import React, { useState, useCallback } from 'react';
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

const App: React.FC = () => {
  const [originalImages, setOriginalImages] = useState<ImageState[]>([]);
  const [activeOriginalImageIndex, setActiveOriginalImageIndex] = useState<number>(0);
  const [editedImageHistories, setEditedImageHistories] = useState<Record<number, ImageState[]>>({});
  const [selectedEditedImageIndices, setSelectedEditedImageIndices] = useState<Record<number, number | null>>({});

  const [prompt, setPrompt] = useState<string>('');
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);
  const [processingImageIndex, setProcessingImageIndex] = useState<number | null>(null);
  const [isMagicPromptLoading, setIsMagicPromptLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  const resetState = useCallback(() => {
    setOriginalImages([]);
    setActiveOriginalImageIndex(0);
    setEditedImageHistories({});
    setSelectedEditedImageIndices({});
    setPrompt('');
    setError(null);
    setIsBatchProcessing(false);
    setProcessingImageIndex(null);
    setBrightness(100);
    setContrast(100);
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
            console.error(`Error processing image ${i + 1}:`, err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate image ${i + 1}: ${errorMessage}. Batch processing stopped.`);
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
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Magic prompt failed: ${errorMessage}`);
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
              brightness={brightness}
              setBrightness={setBrightness}
              contrast={contrast}
              setContrast={setContrast}
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
              brightness={brightness}
              contrast={contrast}
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
      <Footer />
    </div>
  );
};

export default App;