from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, set_seed
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

nltk.download("vader_lexicon")

app = Flask(__name__)
CORS(app)

generator = pipeline("text-generation", model="distilgpt2")
set_seed(42)
analyzer = SentimentIntensityAnalyzer()

@app.route("/", methods=["GET"])
def home():
    return "✅ Mental Health Chatbot Backend is Running!"
def get_dynamic_suggestions(mood):
    if mood == "positive":
        return {
            "quote": "You're shining today!",
            "gif": "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"  # happy gif
        }
    elif mood == "negative":
        return {
            "quote": "Tough times don't last. You do.",
            "gif": "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif"  # sad gif
        }
    else:
        return {
            "quote": "A calm mind brings inner strength.",
            "gif": "https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif"  # neutral gif
        }

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")
    print("User input:", user_input)

    mood_score = analyzer.polarity_scores(user_input)["compound"]
    print("Mood score:", mood_score)

    mood = "positive" if mood_score > 0.2 else "negative" if mood_score < -0.2 else "neutral"
    print("Detected mood:", mood)

    reply = generator(user_input, max_length=50, num_return_sequences=1)[0]['generated_text']
    print("Generated reply:", reply)

    suggestions = get_dynamic_suggestions(mood)


    return jsonify({"reply": reply, "mood": mood, "suggestions": suggestions})

if __name__ == "__main__":
    print("✅ Mental Health Chatbot Backend is now running on http://localhost:5000")
    app.run(debug=True)
