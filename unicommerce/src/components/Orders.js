import React, { useState, useEffect } from 'react';
import OrdersList from './CRUD/OrdersList';
import { FaSearch } from 'react-icons/fa';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Orders.css';

const Orders = () => {
  const [displayOrders, setDisplayOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('id');
  const [searchDate, setSearchDate] = useState(null);
  const [priorityCriteria, setPriorityCriteria] = useState(['', '', '']);
  const [dbUpdateMessage, setDbUpdateMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchTerm, searchField, searchDate, priorityCriteria]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetOrders');
      const orders = await response.json();
      console.log('Fetched Orders:', orders); // Debugging log

      let filteredOrders = orders;

      if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status.toLowerCase() === activeTab);
      }

      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (searchDate) {
        filteredOrders = filteredOrders.filter(order =>
          new Date(order.date).toISOString().slice(0, 10) === searchDate.toISOString().slice(0, 10)
        );
      }

      const orderedOrders = sortOrders(filteredOrders, priorityCriteria);
      console.log('Ordered Orders:', orderedOrders); // Debugging log

      setDisplayOrders(orderedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const deleteOrder = async (id) => {
    // Delete order logic
  };

  const searchOptions = [
    { value: 'id', label: 'Order ID' },
    { value: 'productDetails.product_name', label: 'Product Name' },
    { value: 'date', label: 'Date' }
  ];

  const criteriaOptions = [
    { value: 'total', label: 'Total Purchase' },
    { value: 'customerLoyalty', label: 'Customer Loyalty' },
    { value: 'date', label: 'Order Time' }
  ];

  const handleCriteriaChange = (index, option) => {
    const updatedCriteria = [...priorityCriteria];
    updatedCriteria[index] = option.value;
    setPriorityCriteria(updatedCriteria);

    if (updatedCriteria.every(criteria => criteria !== '')) {
      setDbUpdateMessage('Database updated successfully with new criteria.');
    } else {
      setDbUpdateMessage('');
    }
  };

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="nav-tabs">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All Orders</button>
        <button className={activeTab === 'unpaid' ? 'active' : ''} onClick={() => setActiveTab('unpaid')}>Unpaid</button>
        <button className={activeTab === 'to-ship' ? 'active' : ''} onClick={() => setActiveTab('to-ship')}>To Ship</button>
        <button className={activeTab === 'shipping' ? 'active' : ''} onClick={() => setActiveTab('shipping')}>Shipping</button>
        <button className={activeTab === 'completed' ? 'active' : ''} onClick={() => setActiveTab('completed')}>Completed</button>
        <button className={activeTab === 'cancellation' ? 'active' : ''} onClick={() => setActiveTab('cancellation')}>Cancellation</button>
        <button className={activeTab === 'return-refund' ? 'active' : ''} onClick={() => setActiveTab('return-refund')}>Return/Refund</button>
        <button className={activeTab === 'failed-delivery' ? 'active' : ''} onClick={() => setActiveTab('failed-delivery')}>Failed Delivery</button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
        <Select
          options={searchOptions}
          defaultValue={searchOptions[0]}
          onChange={(option) => setSearchField(option.value)}
          className="search-field-select"
        />
        <DatePicker
          selected={searchDate}
          onChange={(date) => setSearchDate(date)}
          placeholderText="Search by date"
          className="search-date-picker form-input"
        />
        <button className="search-btn" onClick={fetchOrders}>
          <FaSearch />
        </button>
      </div>
      <div className="criteria-settings">
        <div className="criteria-row">
          <label>
            Priority 1:
            <Select
              options={criteriaOptions}
              value={criteriaOptions.find(option => option.value === priorityCriteria[0])}
              onChange={(option) => handleCriteriaChange(0, option)}
              className="react-select-container"
            />
          </label>
          <label>
            Priority 2:
            <Select
              options={criteriaOptions.filter(option => option.value !== priorityCriteria[0])}
              value={criteriaOptions.find(option => option.value === priorityCriteria[1])}
              onChange={(option) => handleCriteriaChange(1, option)}
              className="react-select-container"
            />
          </label>
          <label>
            Priority 3:
            <Select
              options={criteriaOptions.filter(option => option.value !== priorityCriteria[0] && option.value !== priorityCriteria[1])}
              value={criteriaOptions.find(option => option.value === priorityCriteria[2])}
              onChange={(option) => handleCriteriaChange(2, option)}
              className="react-select-container"
            />
          </label>
        </div>
      </div>
      {dbUpdateMessage && <p>{dbUpdateMessage}</p>}
      <div className="order-list-container">
        <OrdersList items={displayOrders} onEdit={() => {}} onDelete={deleteOrder} />
      </div>
    </div>
  );
};

function calculateOrderScore(order, priorityCriteria) {
  const { total, customerLoyalty, date } = order;
  const weights = {
    total: priorityCriteria[0] === 'total' ? 0.45 : priorityCriteria[1] === 'total' ? 0.35 : 0.2,
    customerLoyalty: priorityCriteria[0] === 'customerLoyalty' ? 0.45 : priorityCriteria[1] === 'customerLoyalty' ? 0.35 : 0.2,
    date: priorityCriteria[0] === 'date' ? 0.45 : priorityCriteria[1] === 'date' ? 0.35 : 0.2
  };

  return (
    total * weights.total +
    customerLoyalty * weights.customerLoyalty +
    (new Date().getTime() - new Date(date).getTime()) * weights.date
  );
}

function getNextOrder(orders, priorityCriteria) {
  const orderScores = orders.map(order => calculateOrderScore(order, priorityCriteria));
  const totalScore = orderScores.reduce((sum, score) => sum + score, 0);
  const randomScore = Math.random() * totalScore;

  let cumulativeScore = 0;
  for (let i = 0; i < orders.length; i++) {
    cumulativeScore += orderScores[i];
    if (cumulativeScore >= randomScore) {
      return orders[i];
    }
  }

  return null;
}

function sortOrders(orders, priorityCriteria) {
  const sortedOrders = [];
  const remainingOrders = [...orders];

  // Sort by most recent date first
  remainingOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

  while (remainingOrders.length > 0) {
    const nextOrder = getNextOrder(remainingOrders, priorityCriteria);
    if (nextOrder) {
      sortedOrders.push(nextOrder);
      remainingOrders.splice(remainingOrders.indexOf(nextOrder), 1);
    } else {
      break;
    }
  }
  return sortedOrders;
}

export default Orders;
