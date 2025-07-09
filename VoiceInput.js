import React, { useEffect, useRef, useState } from "react";

const VoiceInput = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false); // Reset listening when finished
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const startListening = () => {
    if (!listening && recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={startListening}
      className="bg-green-600 text-white px-4 rounded"
    >
      🎤 Speak
    </button>
  );
};

export default VoiceInput;
