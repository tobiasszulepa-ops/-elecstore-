
import { GoogleGenAI, Type } from "@google/genai";
import { QuoteRequest, QuoteResult } from "../types";

export const getSmartQuote = async (request: QuoteRequest): Promise<QuoteResult> => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.API_KEY || "" });
  
  const prompt = `Actúa como un técnico experto de "ElecStore" en Argentina.
    Genera una cotización ESTIMADA en PESOS ARGENTINOS (ARS) para un cambio de pantalla.
    Utiliza precios de referencia reales del mercado argentino actual (considerando repuestos originales y alternativos de alta calidad).
    
    Datos del equipo:
    Marca: ${request.brand}
    Modelo: ${request.model}
    Detalles del daño: ${request.customDetails || "Cambio de pantalla estándar"}

    IMPORTANTE: 
    1. El precio DEBE ser en Pesos Argentinos (ARS). Ejemplo: "$85.000 - $110.000 ARS".
    2. En las recomendaciones, DEBES incluir una advertencia sobre microfisuras en la placa base debido al impacto.
    3. La respuesta debe ser profesional y estructurada.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          estimatedPriceRange: { type: Type.STRING, description: "Rango de precio en ARS (ej: $95.000 - $120.000 ARS)" },
          estimatedTime: { type: Type.STRING, description: "Tiempo estimado (ej: 3 a 5 horas hábiles)" },
          explanation: { type: Type.STRING, description: "Explicación técnica del repuesto y trabajo" },
          partsAvailability: { type: Type.STRING, description: "Disponibilidad (Alta/Media/Baja)" },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Consejos y advertencias técnicas" 
          }
        },
        required: ["estimatedPriceRange", "estimatedTime", "explanation", "partsAvailability", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as QuoteResult;
};
