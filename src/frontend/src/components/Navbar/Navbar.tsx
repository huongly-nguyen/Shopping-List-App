// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/items">Items</Link></li>
        <li><Link to="/shoppingLists">Shopping Lists</Link></li>
        <li><Link to="/statistics">Statistics</Link></li>
        <li><Link to="/nearby-supermarket">Nearby Supermarkets</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
