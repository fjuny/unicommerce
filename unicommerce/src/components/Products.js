import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import AddForm from './CRUD/AddForm';
import EditForm from './CRUD/EditForm';

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetProducts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    }
  };

  const addProduct = async (formData) => {
    try {
      await fetch('http://localhost:5038/fyp/unicommerceapp/AddProduct', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    }
  };

  const editProduct = async (id, formData) => {
    try {
      await fetch(`http://localhost:5038/fyp/unicommerceapp/EditProduct/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error editing product:', error);
      setError(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5038/fyp/unicommerceapp/DeleteProduct/${id}`, { 
        method: 'DELETE'
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {editingProduct ? (
        <EditForm item={editingProduct} onEdit={editProduct} />
      ) : (
        <AddForm onAdd={addProduct} formType="product" />
      )}
      <List items={products} onEdit={setEditingProduct} onDelete={deleteProduct} />
    </div>
  );
}

export default Products;
