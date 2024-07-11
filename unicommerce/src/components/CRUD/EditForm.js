import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './forms.css';

function EditForm({ item, onEdit }) {
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.contact_info.email);
  const [phone, setPhone] = useState(item.contact_info.phone);
  const [countryCode, setCountryCode] = useState(item.contact_info.country_code || '+60');
  const [address, setAddress] = useState(item.address);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(item._id, {
      name,
      contact_info: {
        email,
        phone,
        country_code: countryCode
      },
      address
    });
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setCountryCode(value.slice(0, 3));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="form-input"
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
        inputClassName="form-input"
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <button type="submit" className="form-button">Update Supplier</button>
    </form>
  );
}

export default EditForm;