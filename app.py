from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import json
from dotenv import load_dotenv
from groq import Groq
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["1 per second"],
    storage_uri="memory://"
)

# Groq API configuration
GROQ_API_KEY = "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"
groq_client = Groq(api_key=GROQ_API_KEY)

# Create history directory if it doesn't exist
HISTORY_DIR = "chat_history"
if not os.path.exists(HISTORY_DIR):
    os.makedirs(HISTORY_DIR)

# In-memory storage for chat history
# In a production app, you would use a database
chat_history = {}

# Load existing chat history from files
def load_chat_histories():
    global chat_history
    if os.path.exists(HISTORY_DIR):
        for filename in os.listdir(HISTORY_DIR):
            if filename.endswith('.json'):
                user_id = filename[:-5]  # Remove .json extension
                file_path = os.path.join(HISTORY_DIR, filename)
                try:
                    with open(file_path, 'r') as f:
                        chat_history[user_id] = json.load(f)
                except Exception as e:
                    print(f"Error loading chat history for {user_id}: {str(e)}")

# Save chat history to file
def save_chat_history(user_id):
    if user_id in chat_history:
        file_path = os.path.join(HISTORY_DIR, f"{user_id}.json")
        try:
            with open(file_path, 'w') as f:
                json.dump(chat_history[user_id], f, indent=2)
        except Exception as e:
            print(f"Error saving chat history for {user_id}: {str(e)}")

# Load existing chat histories on startup
load_chat_histories()

@app.route('/api/chat', methods=['POST'])
@limiter.limit("1 per second")  # Apply rate limit to this endpoint
def chat():
    data = request.json
    user_id = data.get('user_id', 'default_user')
    message = data.get('message')
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    # Get or initialize chat history for this user
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    # Add user message to history with timestamp
    user_message = {
        "role": "user", 
        "content": message,
        "timestamp": datetime.datetime.now().isoformat()
    }
    chat_history[user_id].append(user_message)
    
    try:
        # Prepare conversation history for Groq API (without timestamps)
        conversation = [{"role": msg["role"], "content": msg["content"]} for msg in chat_history[user_id]]

      
        conversation.insert(0, {"role": "system", "content": "you are a helpful assistant.dont give too much long answers.your name is AV ai. develop by king rawana"}) 
        # print(conversation)
        
        # Call Groq API using the client library
        chat_completion = groq_client.chat.completions.create(
            messages=conversation,
            model="llama-3.1-8b-instant",  # You can also use "llama-3.3-70b-versatile" or other models
            temperature=0.8,
            max_completion_tokens=200
        )

        # print(conversation)
        
        # Extract assistant's response
        assistant_message_content = chat_completion.choices[0].message.content
        
        # Add assistant response to history with timestamp
        assistant_message = {
            "role": "assistant", 
            "content": assistant_message_content,
            "timestamp": datetime.datetime.now().isoformat()
        }
        chat_history[user_id].append(assistant_message)
        
        # Save chat history to file
        save_chat_history(user_id)
        
        # Return response without timestamps for frontend
        frontend_history = [{"role": msg["role"], "content": msg["content"]} for msg in chat_history[user_id]]
        
        return jsonify({
            "response": assistant_message_content,
            "history": frontend_history
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": 'str(e)'}), 500

@app.route('/api/history/<user_id>', methods=['GET'])
@limiter.limit("1 per second")  # Apply rate limit to this endpoint
def get_history(user_id):
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    # Return history without timestamps for frontend
    frontend_history = [{"role": msg["role"], "content": msg["content"]} for msg in chat_history[user_id]]
    
    return jsonify({"history": frontend_history})

@app.route('/api/clear/<user_id>', methods=['POST'])
@limiter.limit("1 per second")  # Apply rate limit to this endpoint
def clear_history(user_id):
    if user_id in chat_history:
        chat_history[user_id] = []
        # Save empty history to file
        save_chat_history(user_id)
    
    return jsonify({"status": "success", "message": "Chat history cleared"})

@app.route('/api/export/<user_id>', methods=['GET'])
@limiter.limit("1 per second")  # Apply rate limit to this endpoint
def export_history(user_id):
    if user_id not in chat_history:
        return jsonify({"error": "No history found for this user"}), 404
    
    # Return full history with timestamps
    return jsonify({"history": chat_history[user_id]})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)