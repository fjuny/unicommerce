import React, { useState } from 'react';

function AddForm({ onAdd }) {
  const [newItem, setNewItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newItem);
    setNewItem('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Enter new item"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddForm;
