import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { EditControls } from './components/EditControls';
import { ImageDisplay } from './components/ImageDisplay';
import { Footer } from './components/Footer';
import { ImageHistory } from './components/ImageHistory';
import { editImageWithPrompt, generateMagicPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { ImageState } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [editedImages, setEditedImages] = useState<ImageState[]>([]);
  const [selectedEditedImageIndex, setSelectedEditedImageIndex] = useState<number | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMagicPromptLoading, setIsMagicPromptLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setEditedImages([]);
    setSelectedEditedImageIndex(null);
    setBrightness(100);
    setContrast(100);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      setOriginalImage({ src: base64, mimeType });
    } catch (err) {
      setError('Failed to load image. Please try another file.');
      console.error(err);
    }
  }, []);
  
  const handleGenerate = useCallback(async () => {
    if (!originalImage || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newImage = await editImageWithPrompt(originalImage.src, originalImage.mimeType, prompt);
      setEditedImages(prevImages => {
        const updatedImages = [...prevImages, newImage];
        setSelectedEditedImageIndex(updatedImages.length - 1);
        return updatedImages;
      });
    } catch (err) {
      console.error(err);
      setError('Failed to generate image. The model may not have been able to fulfill the request. Please try a different prompt.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, prompt]);

  const handleMagicPrompt = useCallback(async () => {
    setIsMagicPromptLoading(true);
    setError(null);
    try {
        const enhancedPrompt = await generateMagicPrompt(prompt);
        setPrompt(enhancedPrompt);
    } catch (err) {
        console.error(err);
        setError("Failed to generate a magic prompt. Please try again.");
    } finally {
        setIsMagicPromptLoading(false);
    }
  }, [prompt]);

  const resetState = useCallback(() => {
    setOriginalImage(null);
    setEditedImages([]);
    setSelectedEditedImageIndex(null);
    setPrompt('');
    setError(null);
    setIsLoading(false);
    setBrightness(100);
    setContrast(100);
  }, []);

  const selectedEditedImage = selectedEditedImageIndex !== null ? editedImages[selectedEditedImageIndex] : null;

  return (
    <div className="min-h-screen text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="w-full max-w-6xl flex flex-col gap-8">
            <EditControls 
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onReset={resetState}
              isMagicPromptLoading={isMagicPromptLoading}
              onMagicPrompt={handleMagicPrompt}
              brightness={brightness}
              setBrightness={setBrightness}
              contrast={contrast}
              setContrast={setContrast}
            />
             {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md w-full text-center -mt-4">
                <p>{error}</p>
              </div>
            )}
            <ImageDisplay 
              originalImage={originalImage} 
              editedImage={selectedEditedImage} 
              isLoading={isLoading && editedImages.length === 0}
              brightness={brightness}
              contrast={contrast}
            />
            <ImageHistory 
              images={editedImages}
              selectedIndex={selectedEditedImageIndex}
              onSelect={setSelectedEditedImageIndex}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;