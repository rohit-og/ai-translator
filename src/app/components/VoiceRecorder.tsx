"use client";

import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";

interface VoiceRecorderProps {
  handleVoiceInput: (value: string) => void;
}

export const VoiceRecorder = ({ handleVoiceInput }: VoiceRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunkRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunkRef.current, {
          type: "audio/wav",
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setAudioBase64(base64Audio.split(",")[1]);
          const formData = new FormData();
          formData.append("audio", base64Audio.split(",")[1]);
          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          console.log("audio uploaded succesfully", result);
          handleVoiceInput(result.result);
        };
        chunkRef.current = [];
      };

      recorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };
  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  return (
    <div>
      <button
        type="button"
        className={`rounded-full text-sm  p-3  border-gray-400 ${
          !recording
            ? "bg-slate-100 text-gray-800 hover:bg-red-100"
            : " bg-red-500 text-gray-100 hover:bg-red-700"
        }`}
        onClick={toggleRecording}
      >
        {recording ? <Square size={18} /> : <Mic size={18} />}
      </button>
      <input
        type="hidden"
        name="audio"
        value={audioBase64 || ""}
        aria-label="Recorded Audio"
      />
    </div>
  );
};
