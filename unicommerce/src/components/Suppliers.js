import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import AddForm from './CRUD/AddForm';
import EditForm from './CRUD/EditForm';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const response = await fetch('/fyp/unicommerceapp/GetSupplier');
    const data = await response.json();
    setSuppliers(data);
  };

  const addSupplier = async (desc) => {
    await fetch('/fyp/unicommerceapp/AddSupplier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newSupplier: desc })
    });
    fetchSuppliers();
  };

  const editSupplier = async (id, desc) => {
    await fetch(`/fyp/unicommerceapp/EditSupplier/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc })
    });
    fetchSuppliers();
    setEditingSupplier(null);
  };

  const deleteSupplier = async (id) => {
    await fetch(`/fyp/unicommerceapp/DeleteSupplier?id=${id}`, {
      method: 'DELETE'
    });
    fetchSuppliers();
  };

  return (
    <div>
      <h1>Suppliers</h1>
      {editingSupplier ? (
        <EditForm item={editingSupplier} onEdit={editSupplier} />
      ) : (
        <AddForm onAdd={addSupplier} />
      )}
      <List items={suppliers} onEdit={setEditingSupplier} onDelete={deleteSupplier} />
    </div>
  );
}

export default Suppliers;
