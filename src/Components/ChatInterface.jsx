import React, { useEffect, useRef, useState } from "react";
import "../Style/ChatInterface.css";
import ChatMessages from "./ChatMessages";
import Groq from "groq-sdk";

const ChatInterface = () => {
  // State to store chat messages
  const [jMessageData, setjMessageData] = useState([]);
  // State to store the current input value
  const [inputValue, setInputValue] = useState("");
  // Reference to scroll to the bottom of the chat
  const messagesEndRef = useRef(null);
  const [savedChats, setSavedChats] = useState([]);
  // Initialize the Groq SDK with API key
  const [bottomScroll, setBottomScroll] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to handle the click of the "Ask" button
  const handleAskClick = async (e) => {
    e.preventDefault();
    setBottomScroll(!bottomScroll);
    // Ensure the input is not empty before proceeding
    if (inputValue.trim() !== "") {
      // Create a new message object with loading set to true
      const newMessage = {
        id: jMessageData.length + 1,
        question: inputValue,
        response: null, // Response will be populated after API call
        loading: true, // Show loader initially
        rating: 0, // Default rating
      };

      // Add the new message to the state
      setjMessageData((prevMessages) => [...prevMessages, newMessage]);
      // Clear the input field
      setInputValue("");

      try {
        // Make the API call to get the response
        const chatCompletion = await getGroqChatCompletion(groq, inputValue);

        // Extract the response content from the API response
        const response =
          chatCompletion.choices[0]?.message?.content || "No response";

        // Update the state to replace the loading message with the actual response
        setjMessageData((prevMessages) =>
          prevMessages.map((msg, idx) =>
            idx === prevMessages.length - 1
              ? { ...msg, response: response, loading: false }
              : msg
          )
        );
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error("Error fetching the AI response:", error);
        setjMessageData((prevMessages) =>
          prevMessages.map((msg, idx) =>
            idx === prevMessages.length - 1
              ? { ...msg, response: "Error fetching response", loading: false }
              : msg
          )
        );
      } finally {
        setBottomScroll(!bottomScroll);
      }
    }
  };

  // Function to handle rating changes for each message
  const handleRatingChange = (index, newRating) => {
    // Update the rating of the specific message
    console.log(`Rating changed for message ${index}: ${newRating}`);
    setjMessageData((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === index ? { ...msg, rating: newRating } : msg
      )
    );
  };

  const handleSaveClick = () => {
    const savedChats = JSON.parse(localStorage.getItem("savedChats")) || [];
    const newChat = {
      id: savedChats.length + 1,
      messages: jMessageData,
      timestamp: new Date(),
    };
    savedChats.push(newChat);
    localStorage.setItem("savedChats", JSON.stringify(savedChats));
    alert("Chat saved successfully!");
    setjMessageData([]);
    handlePastConversationClick();
  };

  // Function to call the Groq API for a chat completion
  const getGroqChatCompletion = async (groq, message) => {
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "you are a helpful assistant.",
        },
        {
          role: "user",
          content: message || "",
        },
      ],
      model: "llama3-8b-8192", // Specify the model to use
    });
  };

  const handlePastConversationClick = () => {
    if (savedChats.length > 0) {
      setSavedChats([]);
    } else {
      const jSavedChats = JSON.parse(localStorage.getItem("savedChats")) || [];
      setSavedChats(jSavedChats);
    }
  };

  const loadChat = (chatId) => {
    const savedChats = JSON.parse(localStorage.getItem("savedChats")) || [];
    const selectedChat = savedChats.find((chat) => chat.id === chatId);
    if (selectedChat) {
      setjMessageData(selectedChat.messages);
    }
  };

  const handleFeedbackChange = (index, feedback) => {
    setjMessageData((prevMessages) =>
      prevMessages.map((msg, idx) =>
        idx === index ? { ...msg, feedback } : msg
      )
    );
  };
  
  const handleSaveFeedback = () => {
    const savedChats = JSON.parse(localStorage.getItem("savedChats")) || [];
    const newChat = {
      id: savedChats.length + 1,
      messages: jMessageData,
      timestamp: new Date(),
    };
    savedChats.push(newChat);
    localStorage.setItem("savedChats", JSON.stringify(savedChats));
    alert("Feedback saved successfully!");
  };

  const handleNewChatButton = () => {
    setjMessageData([]);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Function to scroll the chat to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to the bottom whenever the messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [bottomScroll]);

  return (
    <div className={`chat-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="sidebar">
        <button className="toggle-mode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        <button className="new-chat-btn" onClick={handleNewChatButton}>New Chat</button>
        <button
          className="past-conversation-btn"
          onClick={handlePastConversationClick}
        >
          Past Conversation
        </button>
      </div>
      <div className="chat-window">
        <div className="header">Soul AI</div>
        <div className="chat-messages">
          {jMessageData.map((itm, ind) => (
            <ChatMessages
            key={ind}
            item={itm}
            index={ind}
            onRatingChange={handleRatingChange}
            onFeedbackChange={handleFeedbackChange}
            onSaveFeedback={handleSaveFeedback}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            name="sQuestion"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className="ask-btn" onClick={handleAskClick}>
            Ask
          </button>
          <button className="save-btn" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      </div>
      {
        //-----------------
        savedChats.length > 0 ? (
          <div className="saved-chats">
            {savedChats.length > 0 ? (
              savedChats.map((chat) => (
                <div key={chat.id} className="saved-chat-item">
                  <span>{`Chat ${chat.id} - ${new Date(
                    chat.timestamp
                  ).toLocaleString()}`}</span>
                  <button onClick={() => loadChat(chat.id)}>Load Chat</button>
                </div>
              ))
            ) : (
              <p>No saved conversations.</p>
            )}
          </div>
        ) : null
      }
    </div>
  );
};

export default ChatInterface;
