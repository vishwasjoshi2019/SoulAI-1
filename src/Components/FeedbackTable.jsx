import React, { useState } from "react";
import "../Style/FeedbackTable.css";

const FeedbackTable = ({ conversations, loadConversation }) => {
  const [filterRating, setFilterRating] = useState(0);

  const filteredConversations = conversations.filter(
    (convo) => filterRating === 0 || convo.feedback.rating === filterRating
  );

  return (
    <div className="feedback-table">
      <label>
        Filter by Rating:
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
        >
          <option value={0}>All</option>
          <option value={5}>5 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={2}>2 Stars</option>
          <option value={1}>1 Star</option>
        </select>
      </label>
      <table>
        <thead>
          <tr>
            <th>Conversation ID</th>
            <th>Rating</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredConversations.map((convo) => (
            <tr key={convo.id} onClick={() => loadConversation(convo.id)}>
              <td>{convo.id}</td>
              <td>{convo.feedback.rating}</td>
              <td>{convo.feedback.comment}</td>
              <td>{new Date(convo.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
