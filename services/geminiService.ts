
import { GoogleGenAI } from "@google/genai";
import { Restaurant, GroundingSource } from "../types";

export const findLocalFood = async (
  lat: number,
  lng: number,
  query: string
): Promise<{ explanation: string; restaurants: Restaurant[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `I am at latitude ${lat}, longitude ${lng}. Find me nearby authentic local food restaurants. 
  Specific request: "${query || 'authentic local food'}". 
  Please describe the best options and tell me why they are special.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    const text = response.text || "No specific details found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Process grounding chunks into structured data
    const restaurants: Restaurant[] = chunks.map((chunk: any, index: number) => {
      if (chunk.maps) {
        return {
          name: chunk.maps.title || "Nearby Gem",
          cuisine: "Local Authentic",
          description: `Found via Google Maps search. Reliable local choice.`,
          address: chunk.maps.uri || "",
          mapUrl: chunk.maps.uri,
          image: `https://picsum.photos/seed/${index + 400}/400/300`
        };
      }
      return null;
    }).filter((r): r is Restaurant => r !== null);

    return {
      explanation: text,
      restaurants
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch local food recommendations. Please check your connection.");
  }
};
