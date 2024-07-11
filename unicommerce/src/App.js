import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import Orders from './components/Orders';
import Promotions from './components/Promotions';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/" element={<h1>Welcome to UniCommerce</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
