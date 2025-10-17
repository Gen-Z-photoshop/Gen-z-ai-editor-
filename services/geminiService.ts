
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithPrompt = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ src: string, mimeType: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return { src: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }

    throw new Error('No image data found in the API response.');
  } catch (error) {
    console.error("Error calling Gemini API for image editing:", error);
    throw new Error("The AI model failed to process the image editing request.");
  }
};

export const generateMagicPrompt = async (currentPrompt: string): Promise<string> => {
    try {
        const systemInstruction = "You are a creative assistant for an AI photo editor. Your task is to enhance a user's simple idea into a rich, descriptive prompt suitable for an image generation model. Make it artistic and detailed. The prompt should be a concise instruction, not a conversation. If the user's idea is blank, generate a completely random, creative, and inspiring photo editing prompt.";
        
        const contents = `User's idea: "${currentPrompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction,
                temperature: 0.8,
            }
        });

        const text = response.text.trim();
        // Sometimes the model might still add quotes, so we remove them.
        return text.replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error calling Gemini API for magic prompt:", error);
        throw new Error("The AI model failed to generate a prompt.");
    }
};
