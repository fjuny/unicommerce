import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import AddForm from './CRUD/AddForm';
import EditForm from './CRUD/EditForm';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/fyp/unicommerceapp/GetOrders');
    const data = await response.json();
    setOrders(data);
  };

  const addOrder = async (desc) => {
    await fetch('/fyp/unicommerceapp/AddOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newOrder: desc })
    });
    fetchOrders();
  };

  const editOrder = async (id, desc) => {
    await fetch(`/fyp/unicommerceapp/EditOrder/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ desc })
    });
    fetchOrders();
    setEditingOrder(null);
  };

  const deleteOrder = async (id) => {
    await fetch(`/fyp/unicommerceapp/DeleteOrder?id=${id}`, {
      method: 'DELETE'
    });
    fetchOrders();
  };

  return (
    <div>
      <h1>Orders</h1>
      {editingOrder ? (
        <EditForm item={editingOrder} onEdit={editOrder} />
      ) : (
        <AddForm onAdd={addOrder} />
      )}
      <List items={orders} onEdit={setEditingOrder} onDelete={deleteOrder} />
    </div>
  );
}

export default Orders;
