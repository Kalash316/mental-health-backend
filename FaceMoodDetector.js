import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceMoodDetector = ({ onDetect }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [lastMood, setLastMood] = useState("neutral");

  // ✅ Load face-api.js models from public/models folder
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("✅ Face API models loaded.");
      } catch (err) {
        console.error("❌ Error loading models", err);
      }
    };

    loadModels();
  }, []);

  // ✅ Start webcam stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("❌ Camera access denied:", err);
      }
    };

    startCamera();
  }, []);

  // ✅ Perform mood detection from camera every 1s
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      if (
        webcamRef.current &&
        webcamRef.current.readyState === 4
      ) {
        const video = webcamRef.current;
        const detections = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (detections?.expressions) {
          const expressions = detections.expressions;
          const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const [detectedMood, confidence] = sorted[0];

          if (confidence > 0.4 && detectedMood !== lastMood) {
            setLastMood(detectedMood);
            console.log("😃 Mood Detected:", detectedMood, "Confidence:", confidence.toFixed(2));
            onDetect(detectedMood); // Notify parent
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [modelsLoaded, lastMood, onDetect]);

  return (
    <div className="mt-4 flex flex-col items-center">
      <video
        ref={webcamRef}
        autoPlay
        muted
        playsInline
        className="w-64 h-48 border rounded shadow"
      />
      <p className="text-sm mt-2 text-gray-500">Look at the camera to detect your mood</p>
    </div>
  );
};

export default FaceMoodDetector;
