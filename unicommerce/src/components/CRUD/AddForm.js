import React, { useState } from 'react';

function AddForm({ onAdd }) {
  const [supplier_id, setSupplierId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      supplier_id,
      name,
      contact_info: { email, phone },
      address
    });
    setSupplierId('');
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Supplier ID"
        value={supplier_id}
        onChange={(e) => setSupplierId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <button type="submit">Add Supplier</button>
    </form>
  );
}

export default AddForm;
