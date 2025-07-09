export const getSuggestionsForMood = (mood) => {
  const suggestions = {
    happy: {
      song: "https://www.youtube.com/embed/ZbZSe6N_BXs", // Happy by Pharrell
      movie: "The Pursuit of Happyness",
      exercise: "Dance Workout",
      joke: "Why don’t scientists trust atoms? Because they make up everything!",
    },
    sad: {
      song: "https://www.youtube.com/embed/ho9rZjlsyYY", // Fix You by Coldplay
      movie: "Inside Out",
      exercise: "Yoga & Deep Breathing",
      joke: "Why did the sad tomato blush? Because it saw the salad dressing.",
    },
    neutral: {
      song: "https://www.youtube.com/embed/e-ORhEE9VVg", // Blank Space
      movie: "Forrest Gump",
      exercise: "Light Walk",
      joke: "I told my computer I needed a break, and now it won’t stop sending me KitKats.",
    },
    angry: {
      song: "https://www.youtube.com/embed/X8zLJlU_-60", // Lose Yourself
      movie: "The Dark Knight",
      exercise: "Punching Bag / HIIT",
      joke: "Why did the angry Jedi cross the road? To get to the Dark Side.",
    },
    surprised: {
      song: "https://www.youtube.com/embed/CevxZvSJLk8", // Roar - Katy Perry
      movie: "Inception",
      exercise: "Jumping Jacks",
      joke: "What did the magician say when he made his friend disappear? ‘Abracadabra – gone!’",
    },
    disgusted: {
      song: "https://www.youtube.com/embed/8SbUC-UaAxE", // November Rain
      movie: "Contagion",
      exercise: "Deep Cleaning",
      joke: "Why don’t oysters donate to charity? Because they’re shellfish.",
    },
    fearful: {
      song: "https://www.youtube.com/embed/L3wKzyIN1yk", // Demons - Imagine Dragons
      movie: "A Quiet Place",
      exercise: "Stretching and calming breath",
      joke: "Why don’t ghosts like rain? It dampens their spirits.",
    },
  };

  return suggestions[mood] || suggestions["neutral"];
};
