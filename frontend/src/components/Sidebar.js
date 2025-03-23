import React, { useState } from "react";
import {
  FaTrash,
  FaInfoCircle,
  FaTimes,
  FaBars,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";

const Sidebar = ({ darkMode, clearHistory, userId }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClearHistory = () => {
    setShowConfirm(true);
  };

  const confirmClear = () => {
    clearHistory();
    setShowConfirm(false);
  };

  const cancelClear = () => {
    setShowConfirm(false);
  };

  const exportHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/export/${userId}`
      );
      if (response.data && response.data.history) {
        // Create a blob with the data
        const historyData = JSON.stringify(response.data.history, null, 2);
        const blob = new Blob([historyData], { type: "application/json" });

        // Create a download link and trigger the download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `chat_history_${userId}.json`;
        document.body.appendChild(link);
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting chat history:", error);
      alert("Failed to export chat history. Please try again.");
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className={`md:hidden fixed top-16 left-2 z-20 p-2 rounded-md ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} 
                   transition-transform duration-300 ease-in-out
                   md:translate-x-0 w-64 flex-shrink-0 
                   ${darkMode ? "bg-gray-800" : "bg-white"} 
                   border-r ${darkMode ? "border-gray-700" : "border-gray-200"} 
                   flex flex-col z-10 fixed md:static h-full`}
      >
        <div className="p-4 flex-1">
          <h2 className="text-lg font-semibold mb-4">Chat Options</h2>

          {/* <div className="text-xs mb-4 px-2 py-1 rounded bg-gray-700 text-gray-300">
            Session ID: {userId.substring(0, 8)}...
          </div> */}

          {/* <div className="d-none">
            <button
              onClick={handleClearHistory}
              className={`flex items-center w-full p-3 rounded-lg mb-2 
                      ${
                        darkMode
                          ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                          : "hover:bg-gray-100 text-red-600 hover:text-red-700"
                      }`}
            >
              <FaTrash className="mr-2" />
              <span>Clear Chat History</span>
            </button>

            <button
              onClick={exportHistory}
              className={`flex items-center w-full p-3 rounded-lg mb-2 
                      ${
                        darkMode
                          ? "hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                          : "hover:bg-gray-100 text-blue-600 hover:text-blue-700"
                      }`}
            >
              <FaDownload className="mr-2" />
              <span>Export Chat History</span>
            </button>
          </div> */}

          {/* <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex items-start mb-2">
              <FaInfoCircle className={`mt-1 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className="font-medium">About AI Chat Bot</h3>
            </div>
            <p className="text-sm opacity-80">
              This chat bot provides intelligent responses to your questions and maintains your conversation history.
            </p>
            <p className="text-sm opacity-80 mt-2">
              Note: Your chat history is tied to this browser session.
            </p>
          </div> */}
        </div>

        {/* Footer */}
        {/* <div className={`p-4 text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          © {new Date().getFullYear()} AI Chat Bot
        </div> */}
      </aside>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg shadow-lg max-w-sm w-full ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">Clear Chat History?</h3>
            <p className="mb-4">
              This will permanently delete all your conversation history. This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelClear}
                className={`px-4 py-2 rounded ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
