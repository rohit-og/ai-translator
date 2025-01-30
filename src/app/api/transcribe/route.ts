import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const formData = await req.formData();
  const audioFile = formData.get("audio") as string;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/wav",
          data: audioFile,
        },
      },
      { text: "Please transcribe the audio." },
    ]);

    console.log(result.response.text());
    return Response.json({ result: result.response.text() });
  } catch (error) {
    console.error("error transcribeing the text", error);
    return Response.json({ error });
  }
}
