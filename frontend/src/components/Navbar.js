import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav>
      <ul>
        <li className={activeTab === 'dashboard' ? 'active' : ''}>
          <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        </li>
        <li className={activeTab === 'add' ? 'active' : ''}>
          <button onClick={() => setActiveTab('add')}>Add Expense</button>
        </li>
        <li className={activeTab === 'suggestions' ? 'active' : ''}>
          <button onClick={() => setActiveTab('suggestions')}>Suggestions</button>
        </li>
        <li className={activeTab === 'charts' ? 'active' : ''}>
          <button onClick={() => setActiveTab('charts')}>Charts</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;