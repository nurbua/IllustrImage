import { PoemType } from '../types';

const getMimeType = (file: File): string => {
    if (file.type) {
      return file.type;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        throw new Error("Type de fichier image non supporté ou non reconnu.");
    }
  };

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

const callGeminiFunction = async (payload: object): Promise<string> => {
    // On appelle notre fonction Netlify à l'URL '/gemini'
    const response = await fetch('/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Server error:", data);
        // Afficher l'erreur renvoyée par notre fonction Netlify ou un message par défaut.
        if (data.error && data.error.includes("API_KEY")) {
             throw new Error("Erreur de configuration : La variable d'environnement API_KEY n'est pas configurée.");
        }
        throw new Error(data.error || "Une erreur est survenue lors de la communication avec le serveur.");
    }

    return data.text;
}

export const generatePoemFromImage = async (
  imageFile: File,
  poemType: PoemType
): Promise<string> => {
  const imageData = await fileToBase64(imageFile);
  return callGeminiFunction({
      imageData,
      mimeType: getMimeType(imageFile),
      action: 'generatePoem',
      poemType,
  });
};

export const generateQuotesFromImage = async (
  imageFile: File
): Promise<string> => {
  const imageData = await fileToBase64(imageFile);
  return callGeminiFunction({
      imageData,
      mimeType: getMimeType(imageFile),
      action: 'generateQuotes',
  });
};

export const generateTitleFromImage = async (
    imageFile: File
): Promise<string> => {
    const imageData = await fileToBase64(imageFile);
    return callGeminiFunction({
        imageData,
        mimeType: getMimeType(imageFile),
        action: 'generateTitle',
    });
};

export const generateCaptionFromImage = async (
    imageFile: File
): Promise<string> => {
    const imageData = await fileToBase64(imageFile);
    return callGeminiFunction({
        imageData,
        mimeType: getMimeType(imageFile),
        action: 'generateCaption',
    });
};

export const generateLiteraryTextFromImage = async (
  imageFile: File
): Promise<string> => {
    const imageData = await fileToBase64(imageFile);
    return callGeminiFunction({
        imageData,
        mimeType: getMimeType(imageFile),
        action: 'generateLiteraryText',
    });
};