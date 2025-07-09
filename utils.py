def get_suggestions(mood):
    if mood == "happy":
        return {
            "quote": "Keep smiling, it’s a beautiful day!",
            "song": "Happy – Pharrell Williams",
            "movie": "The Pursuit of Happyness"
        }
    elif mood == "sad":
        return {
            "quote": "It's okay to feel sad. Better days are coming.",
            "song": "Fix You – Coldplay",
            "movie": "Inside Out"
        }
    else:  # neutral
        return {
            "quote": "You are doing just fine. Keep going.",
            "song": "Weightless – Marconi Union",
            "movie": "Soul"
        }
