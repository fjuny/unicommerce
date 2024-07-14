import React from 'react';
import './OrdersList.css'; // Import the CSS file

function OrdersList({ items, onEdit, onDelete }) {
  return (
    <ul className="order-list">
      {items.map((item) => (
        <li key={item.id} className="order-item">
          <div className="order-details">
            <div className="order-header">
              <h3 className="order-id">Order ID: {item.id}</h3>
              <p className="order-date">Date: {item.date ? item.date.toISOString().slice(0, 10) : 'N/A'}</p>
            </div>
            <p className="order-status">Status: {item.status}</p>
            <p className="order-total">Total: RM {item.total}</p>
            <p className="order-supplier">Supplier: {item.supplierName}</p>
            <p className="order-customer">Customer: {item.customerUsername}</p>
            <div className="product-details">
              <img src={`data:image/jpeg;base64,${item.product.image}`} alt={item.product.name} className="product-image" />
              <p className="product-name">{item.product.name}</p>
              <p className="product-quantity">Quantity: {item.product.quantity}</p>
            </div>
          </div>
          <div className="order-actions">
            <button className="edit-button" onClick={() => onEdit(item)}>Edit</button>
            <button className="delete-button" onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OrdersList;
