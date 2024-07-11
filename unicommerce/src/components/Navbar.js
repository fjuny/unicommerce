import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/suppliers">Suppliers</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/promotions">Promotions</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
