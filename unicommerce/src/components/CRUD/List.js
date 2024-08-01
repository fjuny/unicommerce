import React from 'react';
import './List.css'; 

function List({ items, onEdit, onDelete }) {
  const renderContactInfo = (item) => {
    if (item.contact_info) {
      return (
        <>
          <p><span className="item-key">Email:</span> <span className="item-value">{item.contact_info.email || 'N/A'}</span></p>
          <p><span className="item-key">Phone:</span> <span className="item-value">{item.contact_info.phone || 'N/A'}</span></p>
        </>
      );
    } else {
      return (
        <>
          <p><span className="item-key">Email:</span> <span className="item-value">{item.email || 'N/A'}</span></p>
          <p><span className="item-key">Phone:</span> <span className="item-value">{item.phone || 'N/A'}</span></p>
        </>
      );
    }
  };

  const isProduct = items.length > 0 && items[0].product_name !== undefined;

  const renderShippingOptions = (shippingOptions) => {
    if (Array.isArray(shippingOptions) && shippingOptions.length > 0) {
      return shippingOptions.join(', ');
    }
    return 'No shipping options available';
  };

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
            <h3 className="item-name">{item.name || item.product_name || 'Unnamed Product'}</h3>
            {isProduct ? (
              <>
                <p><span className="item-key">Description:</span> <span className="item-value">{item.description || 'No description available'}</span></p>
                <p><span className="item-key">Price:</span> <span className="item-value">RM {item.price || '0.00'}</span></p>
                <p><span className="item-key">Stock:</span> <span className="item-value">{item.stock || '0'}</span></p>
                <p><span className="item-key">SKU:</span> <span className="item-value">{item.sku_id || 'N/A'}</span></p>
                <p><span className="item-key">Category:</span> <span className="item-value">{item.category || 'Uncategorized'}</span></p>
                <p><span className="item-key">Subcategory:</span> <span className="item-value">{item.subcategory || 'None'}</span></p>
                <p><span className="item-key">Shipping Options:</span> <span className="item-value">{renderShippingOptions(item.shipping_options)}</span></p>
              </>
            ) : (
              <>
                {renderContactInfo(item)}
                <p><span className="item-key">Address:</span> <span className="item-value">{item.address || 'No address provided'}</span></p>
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
