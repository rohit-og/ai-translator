"use client";
import { Dropdown } from "./components/Dropdown";
import { useState } from "react";
import { translateAction } from "./actions/translate";
import { VoiceRecorder } from "./components/VoiceRecorder";
const languages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
];

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("fr");

  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  const handleSourceLanguageChange = (language: string) => {
    setSourceLanguage(language);
  };

  const handleTargetLanguageChange = (language: string) => {
    setTargetLanguage(language);
  };

  const handleSourceTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = e.target.value;
    setSourceText(newText);
  };

  const handleVoiceInput = async (value: string) => {
    setSourceText(value);
    const formData = new FormData();
    formData.append("sourceText", value);
    formData.append("targetLanguage", targetLanguage);
    formData.append("sourceLanguage", sourceLanguage);
    const translation = await translateAction(formData);
    setTargetText(translation.result);
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <main className=" max-w-7xl w-full p-4">
        <form
          action={async (formData) => {
            const result = await translateAction(formData);
            console.log(result);
            setTargetText(result.result);
          }}
        >
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full gap-2 flex flex-col">
              <Dropdown
                name="sourceLanguage"
                value={sourceLanguage}
                onChange={handleSourceLanguageChange}
                options={languages}
              />
              <textarea
                name="sourceText"
                id=""
                className="w-full h-40 border border-slate-800 rounded-md p-2"
                placeholder="Enter the text to translate"
                value={sourceText}
                onChange={handleSourceTextChange}
              />
            </div>
            <div className="w-full gap-2 flex flex-col">
              <Dropdown
                name="targetLanguage"
                value={targetLanguage}
                onChange={handleTargetLanguageChange}
                options={languages}
              />
              <textarea
                name=""
                id=""
                className="w-full h-40 border border-slate-800 rounded-md p-2"
                placeholder="Translated text"
                value={targetText}
                readOnly
              />
            </div>
          </div>
          <div className="flex gap-4 items-center mt-4">
            <button
              type="submit"
              className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900"
            >
              Translate
            </button>
            {sourceLanguage === "en" && (
              <VoiceRecorder handleVoiceInput={handleVoiceInput} />
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
