import React from 'react';

const Dashboard = ({ expenses, analysis }) => {
  const recentExpenses = expenses.slice(-5).reverse();

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Spent</h3>
          <p>${analysis?.total_spent?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card">
          <h3>Average Daily</h3>
          <p>${analysis?.avg_daily?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="card">
          <h3>Next Month Prediction</h3>
          <p>${analysis?.predicted_next_month?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <h3>Recent Expenses</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {recentExpenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.date}</td>
              <td>{expense.category}</td>
              <td>${parseFloat(expense.amount).toFixed(2)}</td>
              <td>{expense.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;