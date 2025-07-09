// MoodBasedSuggestions.js
import React, { useEffect, useState } from "react";

const moodData = {
  happy: {
    message: "You're smiling! Let's boost your vibe 🎶",
    youtubeUrl: "https://www.youtube.com/embed/ZbZSe6N_BXs?autoplay=1", // Happy by Pharrell
    suggestion: "Go dance! 💃🕺",
  },
  sad: {
    message: "Feeling low? Here's something soothing 🧘",
    youtubeUrl: "https://www.youtube.com/embed/hoNb6HuNmU0?autoplay=1", // Fix You - Coldplay
    suggestion: "Try meditation or deep breathing 🧘‍♂️",
  },
  angry: {
    message: "Angry? Let’s cool down 😤",
    youtubeUrl: "https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1", // Relaxing music
    suggestion: "Take a deep breath. Walk it off. 🚶",
  },
  surprised: {
    message: "Whoa! You look surprised 🤯",
    youtubeUrl: "https://www.youtube.com/embed/KxGRhd_iWuE?autoplay=1", // Funny
    suggestion: "Watch a fun sketch or laugh out loud 😂",
  },
  neutral: {
    message: "Chillin’ mood 😐",
    youtubeUrl: "https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1", // Lo-fi
    suggestion: "Lo-fi beats for a neutral flow 🎧",
  },
};

const MoodBasedSuggestions = ({ mood }) => {
  const [data, setData] = useState(moodData["neutral"]);

  useEffect(() => {
    if (mood && moodData[mood]) {
      setData(moodData[mood]);
    }
  }, [mood]);

  return (
    <div className="my-6 p-4 border rounded bg-purple-50 shadow">
      <h3 className="text-lg font-semibold mb-2">{data.message}</h3>
      <p className="mb-2">{data.suggestion}</p>
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-64 rounded"
          src={data.youtubeUrl}
          title="Mood video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MoodBasedSuggestions;
