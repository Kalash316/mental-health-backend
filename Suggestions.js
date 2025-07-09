import React from "react";

const Suggestions = ({ data, mood }) => {
  if (!data) return null;

  return (
    <div className="mt-4 p-3 bg-purple-100 rounded shadow-sm">
      <h3 className="font-semibold text-purple-800 capitalize">
        Mood: {mood}
      </h3>

      {/* 🔸 Show motivational quote */}
      {data.quote && (
        <p className="mt-2 text-gray-700 italic">
          💬 <span className="font-medium">Quote:</span> "{data.quote}"
        </p>
      )}

      {/* 🔸 Show GIF */}
      {data.gif && (
        <div className="mt-3">
          <img
            src={data.gif}
            alt="Mood GIF"
            className="w-48 h-auto rounded-lg border border-purple-300"
          />
        </div>
      )}

      {/* 🔸 Show other suggestions if available */}
      <ul className="mt-3 list-disc list-inside text-sm text-gray-800">
        {Object.entries(data).map(([key, value]) => {
          if (key === "quote" || key === "gif") return null; // already shown

          return (
            <li key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
              {value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Suggestions;

