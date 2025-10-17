/**
 * Options for converting and filtering an image.
 */
export interface ImageFilterOptions {
  brightness: number; // e.g., 1 for 100%
  contrast: number;   // e.g., 1 for 100%
  quality: number;    // 0 to 1 for JPEGs
}

/**
 * Converts a data URL string to a Blob object, applying specified filters.
 * @param dataUrl The data URL of the image to convert.
 * @param format The desired output MIME type ('image/png' or 'image/jpeg').
 * @param options An object with brightness, contrast, and quality settings.
 * @returns A Promise that resolves with the Blob or null if conversion fails.
 */
export const convertDataUrlToBlob = (
  dataUrl: string,
  format: 'image/png' | 'image/jpeg',
  options: ImageFilterOptions
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      // Apply CSS filters to the canvas context
      ctx.filter = `brightness(${options.brightness}) contrast(${options.contrast})`;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        format,
        options.quality
      );
    };
    img.onerror = () => {
        console.error("Failed to load image for canvas conversion.");
        resolve(null)
    };
    img.src = dataUrl;
  });
};