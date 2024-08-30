import React, { useState, useEffect } from "react";
import "../Style/ChatInterface.css";
import Loader from "./Loader"; // Ensure this path is correct
import StarRating from "./StarRating"; // Ensure this path is correct
import { FaCommentDots } from "react-icons/fa"; // If using FontAwesome
const ChatMessages = (props) => {
  const { item, index, onRatingChange } = props;
  const [rating, setRating] = useState(item.rating || 0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    setRating(item.rating);
  }, [item.rating]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    onRatingChange(index, newRating);
  };

  const handleFeedbackClick = () => {
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  return (
    <div key={index}>
      <div className="message user-message">
        <div className="avatar">🧑</div>
        <div className="text">{item.question}</div>
      </div>
      <div className="message ai-message">
        <div className="avatar">🔮</div>
        <div className="text">
          {item.loading ? <Loader /> : item.response}
          <div className="rating-section">
            <StarRating rating={rating} onRatingChange={handleRatingChange} />
          </div>
          {/* Feedback Icon */}
          <div className="feedback-icon" onClick={handleFeedbackClick}>
            <FaCommentDots />
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="feedback-modal-content">
            <textarea
              placeholder="Enter your feedback..."
              value={item.feedback || ""}
              onChange={(e) => props.onFeedbackChange(index, e.target.value)}
            />
            <button onClick={props.onSaveFeedback}>Save Feedback</button>
            <button onClick={closeFeedbackModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
