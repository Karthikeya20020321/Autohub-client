import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SellCar = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
    location: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seats: '5',
    available: true,
    images: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Please login before listing a car.');
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      const payload = {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
        seats: Number(formData.seats),
        images: formData.images
          ? formData.images
              .split(',')
              .map((img) => img.trim())
              .filter(Boolean)
          : [],
      };

      const res = await fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to list car');
      }

      setSuccess('Car listed successfully!');
      setFormData({
        title: '',
        brand: '',
        model: '',
        year: '',
        price: '',
        description: '',
        location: '',
        fuelType: 'Petrol',
        transmission: 'Automatic',
        seats: '5',
        available: true,
        images: '',
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.eyebrow}>Seller workspace</p>
        <h1 style={styles.title}>Sell Your Car</h1>
        <p style={styles.subtitle}>Add a vehicle listing to AutoHub.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                style={styles.input}
                placeholder="2022 Toyota Camry"
                required
              />
            </div>

            <div style={styles.fieldHalf}>
              <label style={styles.label}>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                style={styles.input}
                placeholder="Toyota"
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                style={styles.input}
                placeholder="Camry"
                required
              />
            </div>

            <div style={styles.fieldHalf}>
              <label style={styles.label}>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                style={styles.input}
                min="1886"
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
                min="0"
                required
              />
            </div>

            <div style={styles.fieldHalf}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={styles.input}
                placeholder="Hyderabad"
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div style={styles.fieldHalf}>
              <label style={styles.label}>Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldHalf}>
              <label style={styles.label}>Seats</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                style={styles.input}
                min="1"
              />
            </div>

            <div style={styles.fieldHalf}>
              <label style={styles.label}>Available</label>
              <div style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Yes, available for sale</span>
              </div>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Image URLs</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://...jpg, https://...jpg"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Describe the vehicle condition, features, and history"
              rows="4"
            />
          </div>

          {error ? <p style={styles.error}>{error}</p> : null}
          {success ? <p style={styles.success}>{success}</p> : null}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Listing Car...' : 'List Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f1eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '72px clamp(20px, 6vw, 96px) 90px',
    fontFamily: 'Georgia, serif',
    color: '#1c2525',
  },
  card: {
    width: '100%',
    maxWidth: '820px',
    padding: '38px 34px',
    background: '#e9e4db',
    border: '1px solid #d2cbc1',
    boxSizing: 'border-box',
  },
  eyebrow: {
    margin: '0 0 14px',
    color: '#a65f2d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 8px',
    fontSize: 'clamp(2.6rem, 5vw, 4.8rem)',
    fontWeight: '400',
    lineHeight: '0.98',
    color: '#1c2525',
  },
  subtitle: {
    margin: '0 0 30px',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fieldHalf: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '700',
    color: '#1c2525',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 0,
    border: '1px solid #bdb6ac',
    background: '#fffdf8',
    color: '#1c2525',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '12px 14px',
    borderRadius: 0,
    border: '1px solid #bdb6ac',
    background: '#fffdf8',
    color: '#1c2525',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '110px',
  },
  checkboxWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    border: '1px solid #bdb6ac',
    background: '#fffdf8',
    borderRadius: 0,
    minHeight: '48px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
  },
  checkboxText: {
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.95rem',
  },
  error: {
    margin: 0,
    color: '#9b4434',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '600',
  },
  success: {
    margin: 0,
    color: '#405440',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '600',
  },
  button: {
    marginTop: '8px',
    padding: '14px 18px',
    border: 'none',
    borderRadius: 0,
    background: '#e6a35c',
    color: '#1c2525',
    fontWeight: '700',
    fontSize: '1rem',
    fontFamily: 'Arial, sans-serif',
    cursor: 'pointer',
  },
};

export default SellCar;
