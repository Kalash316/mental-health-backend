import React, { useEffect } from "react";

const SpeechOutput = ({ text }) => {
  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }, [text]);

  return null;
};

export default SpeechOutput;
