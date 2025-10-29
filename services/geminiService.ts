import { GoogleGenAI } from "@google/genai";
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
        // Fallback or throw an error if the type is essential
        throw new Error("Type de fichier image non supporté ou non reconnu.");
    }
  };

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;
  const mimeType = getMimeType(file);

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: mimeType,
    },
  };
};

export const generatePoemFromImage = async (
  imageFile: File,
  poemType: PoemType
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("La variable d'environnement API_KEY n'est pas configurée.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = {
    text: `Agis comme un poète expert. En te basant sur l'image fournie, écris un poème en français sous la forme d'un "${poemType}". Le poème doit être émouvant, créatif et capturer l'essence de l'image. Ne génère que le texte du poème, sans introduction ni conclusion.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Une erreur est survenue lors de la communication avec l'API : ${error.message}`);
    }
    throw new Error("Une erreur inconnue est survenue lors de la génération du poème.");
  }
};

export const generateQuotesFromImage = async (
  imageFile: File
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("La variable d'environnement API_KEY n'est pas configurée.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = {
    text: "Agis comme un expert littéraire. En te basant sur l'image fournie, fournis une liste de 3 à 5 citations pertinentes d'auteurs célèbres qui résonnent avec le thème, l'ambiance ou les objets de l'image. Les citations doivent être en français. Si une citation originale est dans une autre langue, fournis une traduction française de haute qualité. Pour chaque citation, mentionne l'auteur sur une nouvelle ligne en le préfixant par '— '. Sépare chaque bloc citation/auteur du suivant par '---'. Ne génère que les citations et leurs auteurs, sans introduction ni conclusion.",
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Une erreur est survenue lors de la communication avec l'API : ${error.message}`);
    }
    throw new Error("Une erreur inconnue est survenue lors de la génération des citations.");
  }
};

export const generateTitleFromImage = async (
    imageFile: File
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("La variable d'environnement API_KEY n'est pas configurée.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = {
        text: "Agis comme un expert en titrage créatif. En te basant sur l'image fournie, génère un titre court, évocateur et pertinent en français. Le titre ne doit pas dépasser 5 mots. Ne génère que le texte du titre, sans introduction ni conclusion.",
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Une erreur est survenue lors de la communication avec l'API : ${error.message}`);
        }
        throw new Error("Une erreur inconnue est survenue lors de la génération du titre.");
    }
};

export const generateCaptionFromImage = async (
    imageFile: File
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("La variable d'environnement API_KEY n'est pas configurée.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = {
        text: "Agis comme un expert des réseaux sociaux. En te basant sur l'image fournie, écris une légende descriptive et captivante en français, idéale pour une plateforme comme Instagram. La légende doit faire entre 1 et 3 phrases. Ne génère que le texte de la légende, sans introduction ni conclusion.",
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Une erreur est survenue lors de la communication avec l'API : ${error.message}`);
        }
        throw new Error("Une erreur inconnue est survenue lors de la génération de la légende.");
    }
};
