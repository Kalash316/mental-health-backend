// src/components/MoodTrend.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const moodToScore = {
  positive: 1,
  neutral: 0,
  negative: -1,
};

const MoodTrend = ({ data }) => {
  const formattedData = data.map((item, index) => ({
    name: `Msg ${index + 1}`,
    mood: moodToScore[item.mood],
  }));

  return (
    <div className="mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-2">📊 Mood Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            domain={[-1, 1]}
            ticks={[-1, 0, 1]}
            tickFormatter={(tick) =>
              tick === 1 ? "😊" : tick === 0 ? "😐" : "😔"
            }
          />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#4F46E5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodTrend;
