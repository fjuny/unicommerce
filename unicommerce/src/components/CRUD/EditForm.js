import React, { useState, useEffect } from 'react';

function EditForm({ item, onEdit }) {
  const [updatedItem, setUpdatedItem] = useState(item.desc || '');

  useEffect(() => {
    setUpdatedItem(item.desc || '');
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(item.id, updatedItem);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={updatedItem}
        onChange={(e) => setUpdatedItem(e.target.value)}
        placeholder="Update item"
      />
      <button type="submit">Update</button>
    </form>
  );
}

export default EditForm;
