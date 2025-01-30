"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function translate(
  sourceText: string,
  sourceLanguage: string,
  targetLanguage: string
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = sourceLanguage
    ? `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${sourceText}`
    : `Detect the language of the following text: ${sourceText} and translate it to ${targetLanguage}`;
  const additionalPrompt =
    "Just return the translated text. Do not include any other text.";
  try {
    const result = await model.generateContent(prompt + additionalPrompt);
    console.log(result.response.text());
    return result.response.text();
  } catch (e) {
    console.log(e);
  }
  return "Error";
}

export async function translateAction(formData: FormData) {
  const sourceText = formData.get("sourceText") as string;
  const sourceLanguage = formData.get("sourceLanguage") as string;
  const targetLanguage = formData.get("targetLanguage") as string;
  const result = await translate(sourceText, sourceLanguage, targetLanguage);
  return { result };
}
