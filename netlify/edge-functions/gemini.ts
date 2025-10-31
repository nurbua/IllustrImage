import { GoogleGenAI, GenerateContentResponse } from "https://esm.sh/@google/genai";

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

/**
 * Extrait de manière fiable le contenu textuel de la réponse de l'API Gemini.
 * Cette fonction est nécessaire car l'accesseur `.text` peut ne pas fonctionner
 * de manière cohérente dans tous les environnements d'exécution.
 * @param response La réponse complète de l'API Gemini.
 * @returns Le contenu textuel, ou une chaîne vide si aucun texte n'est trouvé.
 */
const extractTextFromGeminiResponse = (response: GenerateContentResponse): string => {
  if (response.candidates && response.candidates.length > 0) {
    const candidate = response.candidates[0];
    if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
      // Concatène le texte de toutes les parties, au cas où il y en aurait plusieurs.
      return candidate.content.parts.map(part => part.text ?? '').join('');
    }
  }
  // Gère le cas où la réponse est bloquée pour des raisons de sécurité.
  if (response.promptFeedback?.blockReason) {
    console.warn(`La réponse a été bloquée. Raison : ${response.promptFeedback.blockReason}`);
    return `Désolé, je ne peux pas générer de contenu pour cette demande. Raison du blocage : ${response.promptFeedback.blockReason}.`;
  }
  return ""; // Retourne une chaîne vide si aucun contenu textuel n'est trouvé.
};


export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("API_KEY");
    if (!apiKey) {
      console.error("API_KEY environment variable is not set on the server.");
      return new Response(JSON.stringify({ error: "La configuration du serveur est incomplète. La variable d'environnement API_KEY n'est pas configurée." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { imageData, mimeType, action } = await req.json();
    if (!imageData || !mimeType || !action) {
        return new Response(JSON.stringify({ error: "Données de requête invalides." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: mimeType,
      },
    };

    let geminiResponse: GenerateContentResponse;
    let textPrompt: string;

    switch (action) {
      case 'transformToWatercolor': {
        const textPart = { text: "Transforme cette image en une peinture à l'aquarelle de haute qualité." };
        geminiResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [imagePart, textPart] },
          config: {
              responseModalities: ['IMAGE'],
          },
        });
        
        let base64Image = '';
        if (geminiResponse.candidates?.[0]?.content?.parts) {
            for (const part of geminiResponse.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    base64Image = part.inlineData.data;
                    break;
                }
            }
        }

        if (!base64Image) {
             throw new Error("L'IA n'a pas pu générer d'image. La réponse était peut-être bloquée.");
        }

        return new Response(JSON.stringify({ base64Image }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      case 'generateQuotes':
        textPrompt = "Agis comme un expert littéraire. En te basant sur l'image fournie, fournis une liste de 3 à 5 citations pertinentes d'auteurs célèbres qui résonnent avec le thème, l'ambiance ou les objets de l'image. Les citations doivent être en français. Si une citation originale est dans une autre langue, fournis une traduction française de haute qualité. Pour chaque citation, mentionne l'auteur sur une nouvelle ligne en le préfixant par '— '. Sépare chaque bloc citation/auteur du suivant par '---'. Ne génère que les citations et leurs auteurs, sans introduction ni conclusion.";
        break;

      case 'generateTitle':
        textPrompt = "Agis comme un expert en titrage créatif. En te basant sur l'image fournie, génère un titre court, évocateur et pertinent en français. Le titre ne doit pas dépasser 5 mots. Ne génère que le texte du titre, sans introduction ni conclusion.";
        break;
        
      case 'generateCaption':
        textPrompt = "Agis comme un expert des réseaux sociaux. En te basant sur l'image fournie, écris une légende descriptive et captivante en français, idéale pour une plateforme comme Instagram. La légende doit faire entre 1 et 3 phrases. Ne génère que le texte de la légende, sans introduction ni conclusion.";
        break;

      case 'generateLiteraryText':
        textPrompt = "Agis comme un expert en littérature mondiale. En te basant sur l'image fournie, trouve un ou plusieurs extraits de textes littéraires (romans, nouvelles, essais) d'auteurs du monde entier qui entrent en résonance avec le thème, l'ambiance ou les éléments de l'image. Les extraits doivent être en français. Si un extrait original est dans une autre langue, fournis une traduction française de haute qualité. Pour chaque extrait, fournis le texte entre guillemets, puis sur une nouvelle ligne l'auteur préfixé par '— ', et sur une autre nouvelle ligne le titre de l'oeuvre en italique. Sépare chaque bloc (extrait/auteur/titre) du suivant par '---'. Ne génère que les extraits, titres et auteurs, sans introduction ni conclusion.";
        break;
        
      default:
        return new Response(JSON.stringify({ error: "Action non reconnue." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    // Appel commun pour toutes les actions textuelles
    geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: textPrompt }] },
    });

    const text = extractTextFromGeminiResponse(geminiResponse);
    if (!text) {
        throw new Error("L'IA n'a pas généré de texte ou la réponse était vide.");
    }

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in Netlify function:", error);
    const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
    return new Response(JSON.stringify({ error: `Erreur du serveur: ${errorMessage}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};