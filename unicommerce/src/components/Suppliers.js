import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import AddForm from './CRUD/AddForm';
import EditForm from './CRUD/EditForm';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers...');
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetSuppliers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched suppliers:', data);
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      setMessage('Failed to fetch suppliers.');
    }
  };
  

  const addSupplier = async (supplier) => {
    try {
      await fetch('http://localhost:5038/fyp/unicommerceapp/AddSupplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSupplier: supplier })
      });
      fetchSuppliers();
      setMessage('Supplier added successfully.');
    } catch (error) {
      console.error('Failed to add supplier:', error);
      setMessage('Failed to add supplier.');
    }
  };

  const deleteSupplier = async (id) => {
    try {
      console.log('Deleting supplier with ID:', id);
      const response = await fetch(`http://localhost:5038/fyp/unicommerceapp/DeleteSupplier/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete supplier');
      }
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier._id !== id));
      setMessage('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setMessage(`Failed to delete supplier: ${error.message}`);
    }
  };
  
  const editSupplier = async (id, supplier) => {
    try {
      const response = await fetch(`http://localhost:5038/fyp/unicommerceapp/EditSupplier/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      fetchSuppliers();
      setEditingSupplier(null);
      setMessage('Supplier edited successfully.');
    } catch (error) {
      console.error('Failed to edit supplier:', error);
      setMessage('Failed to edit supplier.');
    }
  };

  return (
    <div>
      <h1>Suppliers</h1>
      {message && <p>{message}</p>}
      {editingSupplier ? (
        <EditForm item={editingSupplier} onEdit={editSupplier} />
      ) : (
        <AddForm onAdd={addSupplier} formType="supplier" />
      )}
      <List items={suppliers} onEdit={setEditingSupplier} onDelete={deleteSupplier} />
    </div>
  );
}

export default Suppliers;
