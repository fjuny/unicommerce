import React from 'react';

function List({ items, onEdit, onDelete }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item._id}>
          <span>{item.name}</span>
          <span>{item.email}</span> {/* Check if 'email' is defined */}
          <span>{item.phone}</span>
          <span>{item.address}</span>
          <button onClick={() => onEdit(item)}>Edit</button>
          <button className="delete" onClick={() => onDelete(item._id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default List;
