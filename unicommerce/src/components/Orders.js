import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Orders.css';

// Order data
const orders = [
  {
    id: 1,
    totalPrice: 100,
    customerLoyalty: 4, // 1-5 scale, 5 being the most loyal
    orderTime: new Date('2023-05-01'), // Recent orders have higher priority
    status: 'completed'
  },
  {
    id: 2,
    totalPrice: 150,
    customerLoyalty: 3,
    orderTime: new Date('2023-04-15'),
    status: 'to-ship'
  },
  {
    id: 3,
    totalPrice: 80,
    customerLoyalty: 5,
    orderTime: new Date('2023-05-05'),
    status: 'unpaid'
  },
  {
    id: 4,
    totalPrice: 120,
    customerLoyalty: 2,
    orderTime: new Date('2023-04-20'),
    status: 'shipping'
  }
];

function Orders() {
  const [displayOrders, setDisplayOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('productId');
  const [searchDate, setSearchDate] = useState(null);
  const [priorityCriteria, setPriorityCriteria] = useState(['', '', '']);

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchTerm, searchField, searchDate, priorityCriteria]);

  const fetchOrders = () => {
    let filteredOrders = orders;

    // Filter orders based on active tab
    if (activeTab !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === activeTab);
    }

    // Filter orders based on search term and field
    if (searchTerm) {
      if (searchField === 'date') {
        filteredOrders = filteredOrders.filter(order =>
          order.orderTime.toISOString().slice(0, 10) === searchTerm
        );
      } else {
        filteredOrders = filteredOrders.filter(order =>
          order[searchField].toString().includes(searchTerm)
        );
      }
    }

    // Filter orders based on search date
    if (searchDate) {
      filteredOrders = filteredOrders.filter(order =>
        order.orderTime.toISOString().slice(0, 10) === searchDate.toISOString().slice(0, 10)
      );
    }

    // Sort orders based on weighted criteria
    const orderedOrders = sortOrders(filteredOrders, priorityCriteria);

    setDisplayOrders(orderedOrders);
  };

  const deleteOrder = async (id) => {
    // Delete order logic
  };

  const searchOptions = [
    { value: 'productId', label: 'Product ID' },
    { value: 'productName', label: 'Product Name' },
    { value: 'date', label: 'Date' }
  ];

  const criteriaOptions = [
    { value: 'totalPrice', label: 'Total Price' },
    { value: 'customerLoyalty', label: 'Customer Loyalty' },
    { value: 'orderTime', label: 'Order Time' }
  ];

  const handleCriteriaChange = (index, option) => {
    const updatedCriteria = [...priorityCriteria];
    updatedCriteria[index] = option.value;
    setPriorityCriteria(updatedCriteria);
  };

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="nav-tabs">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button
          className={activeTab === 'unpaid' ? 'active' : ''}
          onClick={() => setActiveTab('unpaid')}
        >
          Unpaid
        </button>
        <button
          className={activeTab === 'to-ship' ? 'active' : ''}
          onClick={() => setActiveTab('to-ship')}
        >
          To Ship
        </button>
        <button
          className={activeTab === 'shipping' ? 'active' : ''}
          onClick={() => setActiveTab('shipping')}
        >
          Shipping
        </button>
        <button
          className={activeTab === 'completed' ? 'active' : ''}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={activeTab === 'cancellation' ? 'active' : ''}
          onClick={() => setActiveTab('cancellation')}
        >
          Cancellation
        </button>
        <button
          className={activeTab === 'return-refund' ? 'active' : ''}
          onClick={() => setActiveTab('return-refund')}
        >
          Return/Refund
        </button>
        <button
          className={activeTab === 'failed-delivery' ? 'active' : ''}
          onClick={() => setActiveTab('failed-delivery')}
        >
          Failed Delivery
        </button>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          className="search-date-picker"
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
            />
          </label>
          <label>
            Priority 2:
            <Select
              options={criteriaOptions.filter(option => option.value !== priorityCriteria[0])}
              value={criteriaOptions.find(option => option.value === priorityCriteria[1])}
              onChange={(option) => handleCriteriaChange(1, option)}
            />
          </label>
          <label>
            Priority 3:
            <Select
              options={criteriaOptions.filter(option => option.value !== priorityCriteria[0] && option.value !== priorityCriteria[1])}
              value={criteriaOptions.find(option => option.value === priorityCriteria[2])}
              onChange={(option) => handleCriteriaChange(2, option)}
            />
          </label>
        </div>
      </div>
      <div className="carousel-container">
        <List items={displayOrders} onDelete={deleteOrder} />
      </div>
    </div>
  );
}

// Weighted random algorithm for order ranking
function calculateOrderScore(order, priorityCriteria) {
  const { totalPrice, customerLoyalty, orderTime } = order;
  const weights = {
    totalPrice: priorityCriteria[0] === 'totalPrice' ? 0.45 : priorityCriteria[1] === 'totalPrice' ? 0.35 : 0.2,
    customerLoyalty: priorityCriteria[0] === 'customerLoyalty' ? 0.45 : priorityCriteria[1] === 'customerLoyalty' ? 0.35 : 0.2,
    orderTime: priorityCriteria[0] === 'orderTime' ? 0.45 : priorityCriteria[1] === 'orderTime' ? 0.35 : 0.2
  };

  return (
    totalPrice * weights.totalPrice +
    customerLoyalty * weights.customerLoyalty +
    (new Date().getTime() - orderTime.getTime()) * weights.orderTime // Newer orders have higher scores
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