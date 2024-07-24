import React from 'react';
import './OrdersList.css';

function OrdersList({ items, onEdit }) {
  console.log('OrdersList items:', items);

  const formatProductName = (name) => {
    return name.length > 30 ? name.substring(0, 30) + '...' : name;
  };

  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  return (
    <table className="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Status</th>
          <th>Total</th>
          <th>Supplier</th>
          <th>Customer</th>
          <th>Product Name</th>
          <th>Category</th>
          <th>Subcategory</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="order-item">
            <td>{item.id}</td>
            <td>{item.date ? new Date(item.date).toISOString().slice(0, 10) : 'N/A'}</td>
            <td>{item.status}</td>
            <td>RM {formatPrice(item.total)}</td>
            <td>{item.supplierDetails?.name}</td>
            <td>{item.customerUsername}</td>
            <td>{formatProductName(item.productDetails?.product_name)}</td>
            <td>{item.productDetails?.category}</td>
            <td>{item.productDetails?.subcategory}</td>
            <td>RM {formatPrice(item.productDetails?.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default OrdersList;
