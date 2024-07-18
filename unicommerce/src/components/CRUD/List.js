import React from 'react';
import './List.css'; 

function List({ items, onEdit, onDelete }) {
  const renderContactInfo = (item) => {
    if (item.contact_info) {
      return (
        <>
          <p><span className="item-key">Email:</span> <span className="item-value">{item.contact_info.email}</span></p>
          <p><span className="item-key">Phone:</span> <span className="item-value">{item.contact_info.phone}</span></p>
        </>
      );
    } else {
      return (
        <>
          <p><span className="item-key">Email:</span> <span className="item-value">{item.email}</span></p>
          <p><span className="item-key">Phone:</span> <span className="item-value">{item.phone}</span></p>
        </>
      );
    }
  };

  const isProduct = items.length > 0 && items[0].product_name !== undefined;

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item._id || item.id} className="item">
          {isProduct && item.image && (
            <div
              className="product-image"
              style={{ backgroundImage: `url(data:image/jpeg;base64,${item.image})` }}
            ></div>
          )}
          <div className="item-details">
            <h3 className="item-name">{item.name || item.product_name}</h3>
            {isProduct ? (
              <>
                <p><span className="item-key">Description:</span> <span className="item-value">{item.product_name}</span></p>
                <p><span className="item-key">Price:</span> <span className="item-value">RM {item.price}</span></p>
                <p><span className="item-key">Stock:</span> <span className="item-value">{item.stock}</span></p>
                <p><span className="item-key">SKU:</span> <span className="item-value">{item.sku_id}</span></p>
                <p><span className="item-key">Category:</span> <span className="item-value">{item.category}</span></p>
                <p><span className="item-key">Subcategory:</span> <span className="item-value">{item.subcategory}</span></p>
                <p><span className="item-key">Shipping Options:</span> <span className="item-value">{item.shipping_options.join(', ')}</span></p>
              </>
            ) : (
              <>
                {renderContactInfo(item)}
                <p><span className="item-key">Address:</span> <span className="item-value">{item.address}</span></p>
              </>
            )}
          </div>
          <div className="item-actions">
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
