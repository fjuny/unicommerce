import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import PhoneInput from 'react-phone-number-input';
import currencyCodes from 'currency-codes';
import 'react-phone-number-input/style.css';
import './forms.css';

const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Beauty', 'Sports', 'Others'];
const subcategories = {
  Electronics: ['Mobile Phones', 'Laptops', 'Cameras'],
  Clothing: ['Men', 'Women', 'Kids'],
  Home: ['Furniture', 'Kitchen', 'Decor'],
  Books: ['Fiction', 'Non-fiction', 'Comics'],
  Beauty: ['Skincare', 'Makeup', 'Fragrance'],
  Sports: ['Outdoor', 'Indoor', 'Fitness'],
  Others: ['Other']
};
const shippingOptions = ['JNT', 'DHL', 'Poslaju', 'ShopeeExpress', 'LazExpress'];

function AddForm({ onAdd, formType }) {
  const [supplier_id, setSupplierId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+60');
  const [address, setAddress] = useState('');

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [selectedShippingOptions, setSelectedShippingOptions] = useState([]);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  useEffect(() => {
    const fetchCurrencies = () => {
      const currencyData = currencyCodes.data.map(currency => ({
        value: currency.code,
        label: `${currency.code} - ${currency.currency}`
      }));
      setCurrencyOptions(currencyData);
      setCurrency(currencyData.find(option => option.value === 'MYR')); // Default to MYR
    };
    fetchCurrencies();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === 'supplier') {
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
    } else if (formType === 'product') {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('description', description);
      formData.append('price', `${currency.value} ${price}`);
      formData.append('image', image);
      formData.append('quantity', quantity);
      formData.append('sku', sku);
      formData.append('shippingOptions', selectedShippingOptions.join(', '));
      formData.append('category', category);
      formData.append('subcategory', subcategory);

      onAdd(formData);
      setProductName('');
      setDescription('');
      setPrice('');
      setCurrency(currencyOptions.find(option => option.value === 'MYR'));
      setImage(null);
      setImagePreview(null);
      setQuantity('');
      setSku('');
      setSelectedShippingOptions([]);
      setCategory('');
      setSubcategory('');
    }
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    setCountryCode(value.slice(0, 3));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleShippingOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedShippingOptions([...selectedShippingOptions, value]);
    } else {
      setSelectedShippingOptions(selectedShippingOptions.filter(option => option !== value));
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const formatOptionLabel = ({ value, label }) => (
    <div>
      <span>{label}</span>
    </div>
  );

  const customSingleValue = ({ data }) => (
    <div>
      <span>{data.value}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {formType === 'supplier' && (
        <>
          <input
            type="text"
            placeholder="Supplier ID"
            value={supplier_id}
            onChange={(e) => setSupplierId(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
          <PhoneInput
            international
            defaultCountry="MY"
            placeholder="Phone"
            value={phone}
            onChange={handlePhoneChange}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
            required
          />
        </>
      )}
      {formType === 'product' && (
        <>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            required
          />
          <div className="price-quantity-container">
            <div className="price-input">
              <Select
                value={currency}
                onChange={setCurrency}
                options={currencyOptions}
                formatOptionLabel={formatOptionLabel}
                components={{ SingleValue: customSingleValue }}
                className="css-b62m3t-container"
              />
              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={handlePriceChange}
                className="form-input"
                required
              />
            </div>
            <input
              type="number"
              placeholder="QTY"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input form-input"
              required
            />
          </div>
          <label className="image-upload-button">
            Upload Image
            <input
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              required
            />
          </label>
          {imagePreview && <img src={imagePreview} alt="Image Preview" className="image-preview" />}
          <input
            type="text"
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="form-input"
            id="sku"
            required
          />
          <div className="shipping-options">
            {shippingOptions.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedShippingOptions.includes(option)}
                  onChange={handleShippingOptionChange}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="select-container">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {category && (
            <div className="select-container">
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories[category].map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
          )}
        </>
      )}
      <button type="submit" className="form-button">Add {formType === 'supplier' ? 'Supplier' : 'Product'}</button>
    </form>
  );
}

export default AddForm;
