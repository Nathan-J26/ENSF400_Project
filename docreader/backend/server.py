from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from google import genai


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
    user_input = data.get("text", "")

    prompt = "Give me a paragraph by shakespeare" #placeholder for test
    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL, contents=[prompt]
        )
        return jsonify({"summary": response.text})
    except Exception as e:
        return jsonify({"error":str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
