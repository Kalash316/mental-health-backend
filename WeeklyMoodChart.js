import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

const WeeklyMoodChart = ({ moodHistory }) => {
  if (!moodHistory) return null;

  // Generate last 7 days
  const days = [...Array(7)].map((_, i) =>
    format(subDays(new Date(), 6 - i), "yyyy-MM-dd")
  );

  // Map mood to score
  const moodToScore = { positive: 1, neutral: 0, negative: -1 };

  const weeklyData = days.map((day) => {
    const moods = moodHistory.filter((m) => m.time?.startsWith(day));
    const total = moods.reduce((sum, m) => sum + (moodToScore[m.mood] ?? 0), 0);
    const avg = moods.length ? total / moods.length : 0;
    return { day, mood: avg.toFixed(2) };
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">📈 Weekly Mood Report</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weeklyData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="day" />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Line type="monotone" dataKey="mood" stroke="#7e22ce" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyMoodChart;
