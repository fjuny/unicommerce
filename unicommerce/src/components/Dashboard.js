import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { FaDownload } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topOrders, setTopOrders] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [shortageAlerts, setShortageAlerts] = useState([]);
  const [chartError, setChartError] = useState(null);
  const [showAllShortages, setShowAllShortages] = useState(false);

  useEffect(() => {
    fetchSuppliers();
    fetchOrders();
    fetchInfluencers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      const updatedInventory = [...inventory];
      
      orders.forEach(order => {
        if (order.status === 'completed') {
          const productName = order.productDetails?.product_name;
          
          updatedInventory.forEach(item => {
            if (item.product_name === productName) {
              item.stock -= 1; // Assuming 1 unit per order for simplicity
            }
          });
        }
      });

      setInventory(updatedInventory);
      checkForShortages(updatedInventory);
    }
  }, [orders, products]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetSuppliers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuppliers(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetOrders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(data);
      setTopOrders(data.slice(0, 5)); // Assuming top 5 orders by date
      calculateTopCategories(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchInfluencers = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetInfluencers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInfluencers(data);
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetProducts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setInventory(data.map(product => ({
        product_name: product.product_name,
        stock: product.stock || 0, // Assuming `stock` is part of the product data
        minimum_stock_level: 5 // Set a threshold for alerting
      })));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const calculateTopCategories = (orders) => {
    const categoryCounts = orders.reduce((acc, order) => {
      const category = order.productDetails?.category || 'Unknown';
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setTopCategories(sortedCategories);
  };

  const checkForShortages = (updatedInventory) => {
    const alerts = updatedInventory
      .filter(item => item.stock <= item.minimum_stock_level)
      .map(item => ({ product_name: item.product_name, stock: item.stock }));

    setShortageAlerts(alerts);
  };

  const downloadJson = (data, filename) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const downloadXml = (data, filename) => {
    const xmlData = data.map(item => `
      <item>
        ${Object.entries(item).map(([key, value]) => `<${key}>${value}</${key}>`).join('\n')}
      </item>`).join('');
    const dataStr = `<items>${xmlData}</items>`;
    const blob = new Blob([dataStr], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const downloadCsv = (data, filename) => {
    const csvRows = [
      Object.keys(data[0] || {}).map(key => key.charAt(0).toUpperCase() + key.slice(1)), // Header row
      ...data.map(item => Object.values(item))
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleDownloadOrders = (format) => {
    switch (format) {
      case 'json':
        downloadJson(orders, 'orders.json');
        break;
      case 'xml':
        downloadXml(orders, 'orders.xml');
        break;
      case 'csv':
        downloadCsv(orders, 'orders.csv');
        break;
      default:
        break;
    }
  };

  const handleDownloadSuppliers = (format) => {
    switch (format) {
      case 'json':
        downloadJson(suppliers, 'suppliers.json');
        break;
      case 'xml':
        downloadXml(suppliers, 'suppliers.xml');
        break;
      case 'csv':
        downloadCsv(suppliers, 'suppliers.csv');
        break;
      default:
        break;
    }
  };

  const handleDownloadInfluencers = (format) => {
    switch (format) {
      case 'json':
        downloadJson(influencers, 'influencers.json');
        break;
      case 'xml':
        downloadXml(influencers, 'influencers.xml');
        break;
      case 'csv':
        downloadCsv(influencers, 'influencers.csv');
        break;
      default:
        break;
    }
  };

  const handleDownloadProducts = (format) => {
    switch (format) {
      case 'json':
        downloadJson(products, 'products.json');
        break;
      case 'xml':
        downloadXml(products, 'products.xml');
        break;
      case 'csv':
        downloadCsv(products, 'products.csv');
        break;
      default:
        break;
    }
  };

  const salesData = {
    labels: topOrders.map(order => order.id),
    datasets: [
      {
        label: 'Total Sales (RM)',
        data: topOrders.map(order => order.total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const salesOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const categoryData = {
    labels: topCategories.map(category => category.name),
    datasets: [
      {
        label: 'Number of Items Sold',
        data: topCategories.map(category => category.count),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Top 5 Suppliers</h2>
          <ul>
            {suppliers.map((supplier) => (
              <li key={supplier._id}>{supplier.name}</li>
            ))}
          </ul>
          <div className="download-buttons">
            <button onClick={() => handleDownloadSuppliers('json')} className="download-btn">
              <FaDownload /> Download Suppliers JSON
            </button>
            <button onClick={() => handleDownloadSuppliers('xml')} className="download-btn">
              <FaDownload /> Download Suppliers XML
            </button>
            <button onClick={() => handleDownloadSuppliers('csv')} className="download-btn">
              <FaDownload /> Download Suppliers CSV
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Top 5 Orders</h2>
          <ul>
            {topOrders.map((order) => (
              <li key={order._id}>
                <span>{order.id}</span>
                <span>{new Date(order.date).toISOString().slice(0, 10)}</span>
                <span>RM {order.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="download-buttons">
            <button onClick={() => handleDownloadOrders('json')} className="download-btn">
              <FaDownload /> Download Orders JSON
            </button>
            <button onClick={() => handleDownloadOrders('xml')} className="download-btn">
              <FaDownload /> Download Orders XML
            </button>
            <button onClick={() => handleDownloadOrders('csv')} className="download-btn">
              <FaDownload /> Download Orders CSV
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Top 5 Categories Sold</h2>
          <Bar data={categoryData} options={categoryOptions} />
        </div>
        <div className="dashboard-section">
          <h2>Sales Chart</h2>
          {chartError ? (
            <p>Error loading chart: {chartError.message}</p>
          ) : (
            <Bar data={salesData} options={salesOptions} />
          )}
        </div>
        <div className="dashboard-section">
          <h2>Inventory Shortages</h2>
          {shortageAlerts.length > 0 ? (
            <div className="alert-section">
              {shortageAlerts.slice(0, showAllShortages ? shortageAlerts.length : 5).map((alert, index) => (
                <div key={index} className="alert">
                  <span>⚠️ {alert.product_name} is running low. Stock remaining: {alert.stock}</span>
                </div>
              ))}
              {shortageAlerts.length > 5 && (
                <button onClick={() => setShowAllShortages(!showAllShortages)} className="toggle-btn">
                  {showAllShortages ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          ) : (
            <p>No shortages detected.</p>
          )}
        </div>
        <div className="dashboard-section">
          <h2>Download Influencers</h2>
          <div className="download-buttons">
            <button onClick={() => handleDownloadInfluencers('json')} className="download-btn">
              <FaDownload /> Download Influencers JSON
            </button>
            <button onClick={() => handleDownloadInfluencers('xml')} className="download-btn">
              <FaDownload /> Download Influencers XML
            </button>
            <button onClick={() => handleDownloadInfluencers('csv')} className="download-btn">
              <FaDownload /> Download Influencers CSV
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Download Products</h2>
          <div className="download-buttons">
            <button onClick={() => handleDownloadProducts('json')} className="download-btn">
              <FaDownload /> Download Products JSON
            </button>
            <button onClick={() => handleDownloadProducts('xml')} className="download-btn">
              <FaDownload /> Download Products XML
            </button>
            <button onClick={() => handleDownloadProducts('csv')} className="download-btn">
              <FaDownload /> Download Products CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
