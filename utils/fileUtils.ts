
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // The result is a data URL: "data:image/png;base64,iVBORw0KGgo..."
        // We need to extract just the base64 part.
        const base64String = reader.result.split(',')[1];
        resolve({ base64: base64String, mimeType: file.type });
      } else {
        reject(new Error('Failed to read file as a data URL.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
