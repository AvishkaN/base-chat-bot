
A beautiful, fully functional chat bot application with chat history, powered by Groq AI.

## Features

- Real-time chat with Groq AI
- Persistent chat history
- Beautiful and responsive UI
- User-friendly interface
- Uses official Groq Python client library

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Python, Flask
- **AI**: Groq API with official Python client

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up your environment variables:
   - Rename `.env.example` to `.env`
   - Add your Groq API key to the `.env` file (get it from https://console.groq.com/keys)

5. Start the backend server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## Usage

1. Type your message in the input field
2. Press Enter or click the Send button
3. View the AI's response
4. Your chat history will be saved automatically

## Available Groq Models

You can change the model in app.py to use any of these Groq models:

- `llama3-8b-8192` - Fast and efficient
- `llama3-70b-8192` - More powerful
- `llama-3.3-70b-versatile` - Latest Llama 3.3 model
- `mixtral-8x7b-32768` - Good for longer contexts

## License

MIT 