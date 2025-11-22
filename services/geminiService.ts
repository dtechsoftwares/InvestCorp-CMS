import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini Client
// Note: process.env.API_KEY is assumed to be present as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Generates a blog post draft based on a topic.
 */
export const generateFinancialDraft = async (topic: string, tone: string = 'Professional'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a comprehensive financial blog post about: "${topic}". 
      The tone should be ${tone}. 
      Target audience: Investors and high-net-worth individuals in Ghana and West Africa.
      Structure:
      - Engaging Headline
      - Executive Summary
      - Key Market Analysis
      - Strategic Outlook
      - Conclusion
      
      Format the output in Markdown.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast generation
      }
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key setup.";
  }
};

/**
 * Polishes existing text to be more professional.
 */
export const polishContent = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Rewrite the following text to be more concise, professional, and impactful suitable for a top-tier investment firm. Maintain Markdown formatting:\n\n${content}`,
    });
    return response.text || content;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return content;
  }
};

/**
 * Generates SEO tags (Title, Description, Keywords).
 */
export const generateSEOTags = async (content: string): Promise<{ title: string, description: string, keywords: string[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following financial article and generate SEO metadata.
            Article: ${content.substring(0, 2000)}...
            
            Return ONLY a JSON object with keys: "title", "description", "keywords" (array of strings).`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const text = response.text;
        if(!text) throw new Error("No text returned");
        return JSON.parse(text);
    } catch (error) {
        console.error("SEO Gen Error", error);
        return { title: "", description: "", keywords: [] };
    }
};

/**
 * Generates a cover image for the article.
 */
export const generateCoverImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Generate a high-quality, professional, abstract corporate finance image representing: "${prompt}". 
            Style: Minimalist, corporate, blue and gold color palette, high resolution, cinematic lighting. 
            No text in the image.`,
          },
        ],
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error", error);
    return null;
  }
};
