from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from google import genai
from services.conversation_service import create_conversation, get_user_conversations
from services.message_service import add_message, get_messages

app = Flask(__name__)
CORS(app)

load_dotenv() 

# Do not put your API keys on github
# You have to set an environment variable
# For windows, in a terminal do setx GEMINI_API_KEY_400 "your api key here"
# Afterwards, restart all open terminals and vscode
API_KEY = os.getenv("GEMINI_API_KEY_400")
GEMINI_MODEL = "gemini-2.5-flash"

client = genai.Client(api_key=API_KEY)



from database import supabase

@app.route("/conversations", methods=["GET"])
def get_conversations():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized: Missing or invalid token"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            return jsonify({"error": "Unauthorized: Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": f"Auth error: {str(e)}"}), 401

    conversations = get_user_conversations(user.id)
    return jsonify({"conversations": conversations})

@app.route("/conversations/<conversation_id>/messages", methods=["GET"])
def get_conversation_messages(conversation_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized: Missing or invalid token"}), 401
    
    token = auth_header.split(" ")[1]
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            return jsonify({"error": "Unauthorized: Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": f"Auth error: {str(e)}"}), 401

    messages = get_messages(conversation_id)
    return jsonify({"messages": messages})

@app.route("/summarize", methods=["POST"])
def summarize():
    # 1. Extract the user token from the Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized: Missing or invalid token"}), 401
    
    token = auth_header.split(" ")[1]
    
    # 2. Verify token with Supabase
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            return jsonify({"error": "Unauthorized: Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": f"Auth error: {str(e)}"}), 401

    data = request.json
    user_input = data.get("text")

    if not user_input:
        return jsonify({"error": "Input can't be empty"}), 400

    include_examples = data.get("include_examples")

    prompt = f"""
    Simplify the provided documentation. Put a focus on readability, utilizing simpler terms that can be easily understood by those with basic programming knowledge. 
    Your output should only contain said documentation, ignoring the code itself. 
    Do not use markdown formatting, such as using ### and ''', Use simple and clean formatting. Using plain text paragraphs and bullet points only.
    You can take the code as input for your response, but do not include it in the output UNLESS the next sentence explicitly asks for you to 'Include some code examples in the summary'.
    {user_input}
    """

    if include_examples:
        prompt += "\nInclude some code examples in the summary"

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL, contents=[prompt]
        )

        summary_text = response.text

        conversation_id = data.get("conversation_id") # will be None on first message
        current_convo_id = conversation_id

        # Store conversation in Supabase (tied to the authenticated user UUID)

        if not current_convo_id: # If no conversation has been initiated (First session)
            # create the conversation and set the current_convo_id
            convo = create_conversation(user_id=user.id, title=user_input[:50]) 
            if convo:
                current_convo_id = convo['id']

        if current_convo_id: # Once a sessions is active, add the messages
            add_message(current_convo_id, "user", user_input)
            add_message(current_convo_id, "llm", summary_text)

        return jsonify({"summary": summary_text, "conversation_id": current_convo_id})

    except Exception as e:
        print("Error in /summarize:", e)
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5000)
