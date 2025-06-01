import React from 'react';

const BudgetSuggestions = ({ suggestions }) => {
  return (
    <div>
      <h2>AI-Powered Budget Suggestions</h2>
      {suggestions.length > 0 ? (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item">
              <p>{suggestion}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No suggestions available. Add some expenses to get personalized advice.</p>
      )}
    </div>
  );
};

export default BudgetSuggestions;