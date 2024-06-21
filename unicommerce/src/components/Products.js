import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import AddForm from './CRUD/AddForm';
import EditForm from './CRUD/EditForm';

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/fyp/unicommerceapp/GetProducts');
    const data = await response.json();
    setProducts(data);
  };

  const addProduct = async (desc) => {
    await fetch('/fyp/unicommerceapp/AddProduct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newProduct: desc })
    });
    fetchProducts();
  };

  const editProduct = async (id, desc) => {
    await fetch(`/fyp/unicommerceapp/EditProduct/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc })
    });
    fetchProducts();
    setEditingProduct(null);
  };

  const deleteProduct = async (id) => {
    await fetch(`/fyp/unicommerceapp/DeleteProduct?id=${id}`, {
      method: 'DELETE'
    });
    fetchProducts();
  };

  return (
    <div>
      <h1>Products</h1>
      {editingProduct ? (
        <EditForm item={editingProduct} onEdit={editProduct} />
      ) : (
        <AddForm onAdd={addProduct} />
      )}
      <List items={products} onEdit={setEditingProduct} onDelete={deleteProduct} />
    </div>
  );
}

export default Products;
