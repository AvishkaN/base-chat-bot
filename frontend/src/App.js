import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(uuidv4()); // Generate a new ID for each session
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  
  // Initialize app settings
  useEffect(() => {
    // Check for dark mode preference in localStorage, but default to true if not set
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference !== null) {
      setDarkMode(darkModePreference === 'true');
    } else {
      // If no preference is stored, use dark mode by default
      localStorage.setItem('darkMode', 'true');
    }
    
    // Load chat history for this session
    fetchChatHistory();
  }, []);
  
  // Update body class when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      document.body.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb';
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`https://fba3-112-134-155-151.ngrok-free.app/api/history/${userId}`);
      if (response.data && response.data.history) {
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to state
    const userMessage = { role: 'user', content: message };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://fba3-112-134-155-151.ngrok-free.app/api/chat', {
        user_id: userId,
        message: message
      });
      
      if (response.data && response.data.response) {
        // Update messages with the full history from the server
        setMessages(response.data.history);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again later.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const clearHistory = async () => {
    try {
      await axios.post(`https://fba3-112-134-155-151.ngrok-free.app/api/clear/${userId}`);
      setMessages([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          darkMode={darkMode} 
          clearHistory={clearHistory} 
          userId={userId}
        />
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface 
            messages={messages} 
            sendMessage={sendMessage} 
            loading={loading}
            darkMode={darkMode}
          />
        </main>
      </div>
    </div>
  );
}

export default App; 