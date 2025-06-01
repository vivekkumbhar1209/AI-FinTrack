import React, { useState, useEffect } from 'react';
import './styles.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import BudgetSuggestions from './components/BudgetSuggestions';
import Charts from './components/Charts';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchExpenses();
    analyzeData();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const analyzeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze');
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing data:', error);
    }
  };

  const addExpense = async (expense) => {
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      if (response.ok) {
        fetchExpenses();
        analyzeData();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className="App">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container">
        {activeTab === 'dashboard' && (
          <Dashboard expenses={expenses} analysis={analysis} />
        )}
        {activeTab === 'add' && <ExpenseForm addExpense={addExpense} />}
        {activeTab === 'suggestions' && (
          <BudgetSuggestions suggestions={analysis?.suggestions || []} />
        )}
        {activeTab === 'charts' && (
          <Charts byCategory={analysis?.by_category || {}} />
        )}
      </div>
    </div>
  );
}

export default App;