import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [showBot, setShowBot] = useState(false);
  const [chatButtonText, setChatButtonText] = useState("Chat"); 
  useEffect(() => {
    const role = localStorage.getItem("role"); 
    if (role === "Admin") {
      setChatButtonText("Chat with Customer");
    } else if (role === "Customer") {
      setChatButtonText("Chat with Agent");
    } else {
      setChatButtonText("Chat");
    }
  }, []);

  const goToFeedbackPage = () => {
    navigate("/feedback");
  };

  const toggleBot = () => {
    setShowBot((prevState) => !prevState);
  };

  const closeBot = () => {
    setShowBot(false);
  };

  const goToPubSubChatPage = () => {
    navigate("/pubsub-chat"); 
  };

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content flex justify-between items-center relative">
      {/* Left Section */}
      <div>
        <p>
          QuickDataProcessor
          <br />
          Processing Data
        </p>
      </div>

      {/* Right Section: Conditionally render buttons */}
      <div className="flex space-x-4">
        {location.pathname !== "/feedback" && (
          <button
            onClick={goToFeedbackPage}
            className="bg-teal-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none"
          >
            Give Feedback
          </button>
        )}

        {/* Chatbot Toggle Button */}
        <button
          onClick={toggleBot}
          className="bg-teal-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none"
        >
          Ask Me Anything
        </button>

        {/* Navigate to PubSubChatPage */}
        <button
          onClick={goToPubSubChatPage}
          className="bg-teal-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-teal-600 focus:outline-none"
        >
          {chatButtonText}
        </button>
      </div>

      {/* Chatbot iframe with conditional rendering */}
      {showBot && (
        <div className="absolute bottom-16 right-4 p-4 bg-white shadow-lg rounded-lg">
          {/* Close Button */}
          <button
            onClick={closeBot}
            className="absolute top-1 right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 hover:text-gray-700"
          >
            ✖
          </button>
          <iframe
            id="dialogflow-iframe"
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/9d53a214-e4d0-462e-8403-9277d059e667"
            style={{ border: "none" }}
          />
        </div>
      )}
    </footer>
  );
}

export default Footer;
