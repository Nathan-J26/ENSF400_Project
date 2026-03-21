from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from google import genai
from services.conversation_service import create_conversation
from services.message_service import add_message

app = Flask(__name__)
CORS(app)


# Do not put your API keys on github
# You have to set an environment variable
# For windows, in a terminal do setx GEMINI_API_KEY_400 "your api key here"
# Afterwards, restart all open terminals and vscode
API_KEY = os.getenv("GEMINI_API_KEY_400")
GEMINI_MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API_KEY)



@app.route("/summarize", methods=["POST"])
def summarize():
    data = request.json
    user_input = data.get("text")

    if not user_input:
        return jsonify({"error": "Input can't be empty"}), 400

    include_examples = data.get("include_examples")

    prompt = f"""
    Simplify the following documentation...
    {user_input}
    """

    if include_examples:
        prompt += "\nInclude some code examples in the summary"

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL, contents=[prompt]
        )

        summary_text = response.text

        # Example: store conversation (temporary user_id=1)
        convo = create_conversation(user_id=1, title=user_input[:50])
        add_message(convo.id, "user", user_input)
        add_message(convo.id, "assistant", summary_text)

        return jsonify({"summary": summary_text})

    except Exception as e:
        print("Error in /summarize:", e)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
