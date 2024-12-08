import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShoppingList from './components/ShoppingList/ShoppingList/ShoppingList'; 
import ItemList from './components/Item/ItemList/ItemList'; 
import Navbar from './components/Navbar/Navbar'; 
import './App.css';
import AppHeader from './components/AppHeader/AppHeader';
import ShoppingListItem from './components/ShoppingListItem/ShoppingListItem/ShoppingListItem';
import Statistics from './components/Statistics/Statistics';
import NearBySupermarkets from './components/NearbySupermarkets/NearbySupermarkets';


const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <AppHeader />
        <Navbar />       
        <Routes>
          <Route path="/shoppingLists" element={<ShoppingList />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/shoppingLists/:shoppingListid" element={<ShoppingListItem />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/nearby-supermarket" element={<NearBySupermarkets />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
