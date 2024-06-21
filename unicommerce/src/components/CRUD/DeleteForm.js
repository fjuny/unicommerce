import React from 'react';

function DeleteForm({ itemId, onDelete }) {
  const handleDelete = () => {
    onDelete(itemId);
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}

export default DeleteForm;
