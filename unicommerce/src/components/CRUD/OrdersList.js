import React from 'react';
import './OrdersList.css'; // Import the CSS file

function OrdersList({ items, onEdit, onDelete }) {
  return (
    <ul className="order-list">
      {items.map((item) => (
        <li key={item._id} className="order-item">
          <div className="order-details">
            <div className="order-header">
              <h3 className="order-id">Order ID: {item.id}</h3>
              <p className="order-date">Date: {item.date ? new Date(item.date).toISOString().slice(0, 10) : 'N/A'}</p>
            </div>
            <p className="order-status">Status: {item.status}</p>
            <p className="order-total">Total: RM {item.total}</p>
            <p className="order-supplier">Supplier: {item.supplierDetails.name}</p>
            <p className="order-customer">Customer: {item.customerUsername}</p>
            <div className="product-details">
              <p className="product-name">{item.productDetails.product_name}</p>
              <p className="product-category">Category: {item.productDetails.category}</p>
              <p className="product-subcategory">Subcategory: {item.productDetails.subcategory}</p>
              <p className="product-price">Price: RM {item.productDetails.price}</p>
            </div>
          </div>
          <div className="order-actions">
            <button className="edit-button" onClick={() => onEdit(item)}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(item._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OrdersList;
