import React from 'react';
import './List.css'; // Import the CSS file

function List({ items, onEdit, onDelete }) {
  const renderContactInfo = (item) => {
    if (item.contact_info) {
      return (
        <>
          <p>Email: {item.contact_info.email}</p>
          <p>Phone: {item.contact_info.phone}</p>
        </>
      );
    } else {
      return (
        <>
          <p>Email: {item.email}</p>
          <p>Phone: {item.phone}</p>
        </>
      );
    }
  };

  return (
    <ul className="supplier-list">
      {items.map((item) => (
        <li key={item._id || item.id} className="supplier-item">
          <div className="supplier-details">
            <h3 className="supplier-name">{item.name}</h3>
            {renderContactInfo(item)}
            <p className="supplier-address">Address: {item.address}</p>
          </div>
          <div className="supplier-actions">
            <div className="action-buttons">
              <button className="edit-button" onClick={() => onEdit(item)}>Edit</button>
              <button className="delete-button" onClick={() => onDelete(item._id || item.id)}>Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default List;
