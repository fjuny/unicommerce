import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetSupplier');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuppliers(data.slice(0, 5)); 
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-section">
        <h2>Top 5 Suppliers</h2>
        <ul>
          {suppliers.map((supplier) => (
            <li key={supplier._id}>{supplier.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
