import React, { useState, useEffect } from "react";
import axios from "axios";
import VoiceInput from "./VoiceInput";
import SpeechOutput from "./SpeechOutput";
import Suggestions from "./Suggestions";
import MoodTrend from "./MoodTrend";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WeeklyMoodChart from "./WeeklyMoodChart";
import FaceMoodDetector from "./FaceMoodDetector";
import { getSuggestionsForMood } from "./utils/moodSuggestions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChatWindow = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem("moodHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detectedMood, setDetectedMood] = useState("neutral");
  const [moodSuggestions, setMoodSuggestions] = useState(null);

  const filteredMood = moodHistory.filter((item) => {
    const date = new Date(item.time);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));
  }, [moodHistory]);

  const handleExportChat = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const data = {
      exportedAt: new Date().toLocaleString(),
      messages,
      moodHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat_history_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportChat = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.messages && data.moodHistory) {
          setMessages(data.messages);
          setMoodHistory(data.moodHistory);
        } else {
          alert("Invalid file format.");
        }
      } catch (err) {
        alert("Error reading file.");
      }
    };
    reader.readAsText(file);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all chat history?")) {
      localStorage.removeItem("messages");
      localStorage.removeItem("moodHistory");
      setMessages([]);
      setMoodHistory([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await axios.post(`http://localhost:5000/chat`, {
        message: input,
      });

      const { reply, mood, suggestions } = res.data;

      setMoodHistory((prev) => [
        ...prev,
        { mood, time: new Date().toISOString() },
      ]);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply, mood, suggestions },
      ]);

      setInput("");
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-10 bg-white rounded shadow">
      <ToastContainer />

      {/* 💬 Chat Messages */}
      <div className="h-96 overflow-y-auto space-y-4 border rounded p-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`text-${msg.sender === "user" ? "right" : "left"}`}
          >
            <p className="inline-block p-2 bg-blue-100 rounded">{msg.text}</p>
            {msg.sender === "bot" && (
              <>
                <SpeechOutput text={msg.text} />
                <Suggestions data={msg.suggestions} mood={msg.mood} />
              </>
            )}
          </div>
        ))}
      </div>

      {/* 📥 Input + Voice */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
        <VoiceInput onTranscript={setInput} />
      </div>

      {/* 📅 Mood Filter Range */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <label className="text-gray-700 font-medium">From:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="p-1 border rounded"
          placeholderText="Start time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />

        <label className="text-gray-700 font-medium">To:</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="p-1 border rounded"
          placeholderText="End time"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={1}
          timeCaption="Time"
          dateFormat="h:mm aa"
        />

        <button
          onClick={() => {
            setStartDate(null);
            setEndDate(null);
          }}
          className="px-2 py-1 bg-gray-300 text-black rounded text-xs"
        >
          Clear
        </button>
      </div>

      {/* 🎭 Facial Mood Detection */}
      <FaceMoodDetector
        onDetect={(mood) => {
          setDetectedMood(mood);
          const suggestions = getSuggestionsForMood(mood);
          setMoodSuggestions(suggestions);
          toast.success(`🎵 Playing song for mood: ${mood}`);
        }}
      />

      <p className="mt-4 text-center">
        🎭 Current Mood from Face: <strong>{detectedMood}</strong>
      </p>

      {/* 🧠 Mood-Based Suggestions */}
      {moodSuggestions && (
        <div className="mt-4 p-4 border rounded bg-yellow-50 shadow-md">
          <h2 className="text-lg font-bold mb-2">
            🎯 Suggestions for: {detectedMood}
          </h2>
          <p><strong>🎬 Movie:</strong> {moodSuggestions.movie}</p>
          <p><strong>🤸 Exercise:</strong> {moodSuggestions.exercise}</p>
          <p><strong>😄 Joke:</strong> {moodSuggestions.joke}</p>

          <div className="mt-3">
            <h3 className="font-semibold">🎵 Song:</h3>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                width="100%"
                height="200"
                src={moodSuggestions.song}
                title="Mood Song"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded shadow"
              ></iframe>
            </div>
            <button
              onClick={() =>
                window.open(
                  moodSuggestions.song.replace("/embed/", "/watch?v="),
                  "_blank"
                )
              }
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ▶️ Play Song in New Tab
            </button>
          </div>
        </div>
      )}

      {/* 📈 Mood Graphs */}
      <MoodTrend data={filteredMood} />
      <WeeklyMoodChart moodHistory={moodHistory} />

      {/* 📁 Export/Import Buttons */}
      <div className="mt-4 space-y-2">
        <button
          onClick={handleExportChat}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          📁 Export Chat History
        </button>

        <input
          type="file"
          accept=".json"
          onChange={handleImportChat}
          className="block"
        />

        <button
          onClick={handleClearHistory}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          🗑️ Clear History
        </button>

        <button
          onClick={() => localStorage.removeItem("moodHistory")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          🧹 Clear Old Mood Data
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
