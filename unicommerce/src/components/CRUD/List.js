import React from 'react';

function List({ items, onEdit, onDelete }) {
  return (
    <div>
      <h2>List</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {JSON.stringify(item)}
            <button onClick={() => onEdit(item.id)}>Edit</button>
            <button onClick={() => onDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
