import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Suppliers from './components/Suppliers';
import Products from './components/Products';
import Orders from './components/Orders';
import Promotions from './components/Promotions';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
            <Route path="/" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
