import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './forms.css';

function AddForm({ onAdd }) {
  const [supplier_id, setSupplierId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      supplier_id,
      name,
      contact_info: { email, phone, country_code: countryCode },
      address
    });
    setSupplierId('');
    setName('');
    setEmail('');
    setPhone('');
    setCountryCode('+60');
    setAddress('');
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setCountryCode(value.slice(0, 3));
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
      <PhoneInput
        international
        defaultCountry="MY"
        placeholder="Phone"
        value={phone}
        onChange={handlePhoneChange}
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