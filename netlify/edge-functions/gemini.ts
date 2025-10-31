import { GoogleGenAI } from "https://esm.sh/@google/genai";

// Déclaration pour que TypeScript reconnaisse l'objet Deno disponible dans l'environnement Netlify.
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Ceci est le gestionnaire principal de la fonction Edge de Netlify.
export default async (req: Request): Promise<Response> => {
  // N'autoriser que les requêtes POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Obtenir la clé API depuis les variables d'environnement de Netlify
    const apiKey = Deno.env.get("API_KEY");
    if (!apiKey) {
      // C'est une erreur serveur, car la clé doit être configurée sur Netlify
      console.error("API_KEY environment variable is not set on the server.");
      return new Response(JSON.stringify({ error: "La configuration du serveur est incomplète. La variable d'environnement API_KEY n'est pas configurée." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Analyser le corps de la requête envoyée depuis le frontend
    const { imageData, mimeType, action, poemType } = await req.json();
    if (!imageData || !mimeType || !action) {
        return new Response(JSON.stringify({ error: "Données de requête invalides." }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: mimeType,
      },
    };

    let textPrompt = "";

    // Déterminer le bon prompt en fonction de l'action
    switch (action) {
      case 'generatePoem':
        textPrompt = `Agis comme un poète expert. En te basant sur l'image fournie, écris un poème en français sous la forme d'un "${poemType}". Le poème doit être émouvant, créatif et capturer l'essence de l'image. Ne génère que le texte du poème, sans introduction ni conclusion.`;
        break;
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
    
    const textPart = { text: textPrompt };

    const geminiResponse = await ai.models.generateContent({
      model: model,
      contents: { parts: [imagePart, textPart] },
    });

    return new Response(JSON.stringify({ text: geminiResponse.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in Netlify function:", error);
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return new Response(JSON.stringify({ error: `Erreur de l'API Gemini: ${error.message}` }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
    
    return new Response(JSON.stringify({ error: `Une erreur interne est survenue dans la fonction serveur.` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};