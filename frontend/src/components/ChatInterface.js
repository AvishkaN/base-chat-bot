import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ChatInterface = ({ messages, sendMessage, loading, darkMode }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <FaRobot className={`text-5xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className="text-xl font-semibold mb-2">Welcome to AI Chat Bot</h2>
            {/* <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Start a conversation by typing a message below. Your chat history will be saved automatically.
            </p> */}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === 'user' 
                      ? darkMode 
                        ? 'bg-primary-dark text-white' 
                        : 'bg-primary text-white'
                      : darkMode 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {message.role === 'user' ? (
                      <>
                        <span className="font-medium">You</span>
                        <FaUser className="ml-2 text-sm opacity-70" />
                      </>
                    ) : (
                      <>
                        <span className="font-medium">AI</span>
                        <FaRobot className="ml-2 text-sm opacity-70" />
                      </>
                    )}
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                  <div className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className={`border-t p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`flex-1 p-3 rounded-l-lg focus:outline-none ${
              darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-300'
            } border`}
            ref={inputRef}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={`p-3 rounded-r-lg ${
              loading || !input.trim()
                ? darkMode 
                  ? 'bg-gray-700 text-gray-500' 
                  : 'bg-gray-300 text-gray-500'
                : darkMode 
                  ? 'bg-primary-dark text-white hover:bg-primary' 
                  : 'bg-primary text-white hover:bg-primary-dark'
            } transition-colors`}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 