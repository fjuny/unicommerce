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
  const [priorityCriteria, setPriorityCriteria] = useState(['date', 'total', 'customerLoyalty']);
  const [dbUpdateMessage, setDbUpdateMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchTerm, searchField, searchDate, priorityCriteria]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetOrders');
      const orders = await response.json();
      console.log('Fetched Orders:', orders);
      let filteredOrders = orders;
  
      if (activeTab !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status.toLowerCase() === activeTab);
        console.log('After filtering by tab:', filteredOrders);
      }
  
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => {
          const fieldValue = getNestedField(order, searchField);
          return fieldValue?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
        console.log('After filtering by search term:', filteredOrders);
      }
  
      if (searchDate) {
        filteredOrders = filteredOrders.filter(order =>
          new Date(order.date).toISOString().slice(0, 10) === searchDate.toISOString().slice(0, 10)
        );
        console.log('After filtering by search date:', filteredOrders);
      }
  
      const orderedOrders = sortOrders(filteredOrders, priorityCriteria);
      console.log('Ordered Orders:', orderedOrders);
  
      setDisplayOrders(orderedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };
  
  const getNestedField = (obj, path) => {
    return path.split('.').reduce((o, key) => (o ? o[key] : null), obj);
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
    const existingIndex = updatedCriteria.indexOf(option.value);

    if (existingIndex !== -1 && existingIndex !== index) {
      [updatedCriteria[index], updatedCriteria[existingIndex]] = [updatedCriteria[existingIndex], updatedCriteria[index]];
    } else {
      updatedCriteria[index] = option.value;
    }

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
      <div className="nav-tabs-order">
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
        <OrdersList items={displayOrders} onEdit={() => {}} />
      </div>
    </div>
  );
};

function calculateOrderScore(order, priorityCriteria) {
  const { total, customerLoyalty, date } = order;
  
  // Ensure that total, customerLoyalty, and date are valid numbers
  const validTotal = typeof total === 'number' && !isNaN(total) ? total : 0;
  const validCustomerLoyalty = typeof customerLoyalty === 'number' && !isNaN(customerLoyalty) ? customerLoyalty : 0;
  const validDate = new Date(date).getTime();

  if (isNaN(validDate)) {
    return NaN;
  }

  const weights = {
    total: priorityCriteria[0] === 'total' ? 0.2 : priorityCriteria[1] === 'total' ? 0.35 : 0.45,
    customerLoyalty: priorityCriteria[0] === 'customerLoyalty' ? 0.2 : priorityCriteria[1] === 'customerLoyalty' ? 0.35 : 0.45,
    date: priorityCriteria[0] === 'date' ? 0.45 : priorityCriteria[1] === 'date' ? 0.35 : 0.2
  };

  return (
    validTotal * weights.total +
    validCustomerLoyalty * weights.customerLoyalty +
    (new Date().getTime() - validDate) * weights.date
  );
}

function sortOrders(orders, priorityCriteria) {
  const sortedOrders = [];
  const remainingOrders = [...orders];

  remainingOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log('After initial date sorting:', remainingOrders);

  while (remainingOrders.length > 0) {
    const nextOrder = getNextOrder(remainingOrders, priorityCriteria);
    if (nextOrder) {
      sortedOrders.push(nextOrder);
      remainingOrders.splice(remainingOrders.indexOf(nextOrder), 1);
    } else {
      break;
    }
  }
  console.log('Sorted Orders:', sortedOrders);
  return sortedOrders;
}

function getNextOrder(orders, priorityCriteria) {
  const orderScores = orders.map(order => calculateOrderScore(order, priorityCriteria));
  console.log('Order Scores:', orderScores);

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

export default Orders;
