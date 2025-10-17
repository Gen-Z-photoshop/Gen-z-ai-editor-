import { convertDataUrlToBlob } from './imageUtils';
import type { ImageState } from '../types';

interface SaveOptions {
  format: 'png' | 'jpeg';
  quality: number; // 1-100
  filename: string;
}

export const saveImageFile = async (imageState: ImageState, options: SaveOptions): Promise<void> => {
    const { format, quality, filename } = options;

    const mimeType = `image/${format}` as 'image/png' | 'image/jpeg';
    const fileExtension = format;
    const filenameWithExt = `${filename}.${fileExtension}`;
    const dataUrl = `data:${imageState.mimeType};base64,${imageState.src}`;
    
    const blob = await convertDataUrlToBlob(dataUrl, mimeType, {
      quality: quality / 100,
    });

    if (!blob) {
        throw new Error("Failed to convert image for saving.");
    }

    // Use the reliable anchor link fallback method directly.
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filenameWithExt;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
