
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../types";

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        inColor: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the photo is in color, false if it is black and white." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        inFocus: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the photo is sharp and in focus." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        neutralExpression: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the person has a neutral expression with both eyes open and facing the camera." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        plainBackground: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the background is plain white or off-white with no patterns or objects." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        noShadows: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if there are no shadows on the person's face or on the background." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        noEyeglasses: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the person is not wearing eyeglasses." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
        headPosition: {
            type: Type.OBJECT,
            properties: {
                passed: { type: Type.BOOLEAN, description: "True if the person's head is centered and takes up 50-69% of the image height." },
                reason: { type: Type.STRING, description: "Reason for the decision." },
            },
        },
    },
    required: ["inColor", "inFocus", "neutralExpression", "plainBackground", "noShadows", "noEyeglasses", "headPosition"]
};

export async function analyzePhoto(base64Image: string): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  const textPart = {
    text: "Analyze this photo for the US Diversity Visa (DV) lottery requirements. Evaluate each of the 7 criteria and provide a boolean 'passed' status and a brief 'reason'. Be strict in your assessment."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze photo with Gemini API.");
  }
}
