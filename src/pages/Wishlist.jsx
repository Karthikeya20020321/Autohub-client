import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { sampleCars } from './Cars';

const Wishlist = () => {
  const token = localStorage.getItem('token');
  const localIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const [cars, setCars] = useState(sampleCars.filter((car) => localIds.includes(car._id)));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.cars?.length > 0) {
          setCars(data.cars);
        } else {
          const savedIds = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setCars(sampleCars.filter((car) => savedIds.includes(car._id)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const removeCar = async (carId) => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (String(carId).startsWith('demo-')) {
      const nextWishlist = localWishlist.filter((id) => id !== carId);
      localStorage.setItem('wishlist', JSON.stringify(nextWishlist));
      setCars((currentCars) => currentCars.filter((car) => car._id !== carId));
      return;
    }

    const response = await fetch(`http://localhost:5000/api/wishlist/${carId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (data.success) setCars(data.cars || []);
  };

  if (!token) return <Navigate to="/login" replace />;

  return (
    <main style={styles.page}>
      <p style={styles.eyebrow}>Saved for later</p>
      <h1 style={styles.title}>My Wishlist</h1>
      {loading ? <p style={styles.message}>Loading your wishlist...</p> : null}
      {!loading && cars.length === 0 ? <p style={styles.message}>No saved cars yet.</p> : null}
      <div style={styles.grid}>
        {cars.map((car) => (
          <article key={car._id} style={styles.card}>
            {car.images?.[0] ? <img src={car.images[0]} alt={car.title} style={styles.image} /> : null}
            <div style={styles.cardBody}>
              <h2 style={styles.carTitle}>{car.title}</h2>
              <p style={styles.meta}>₹{car.price}/day · {car.location || 'Location not provided'}</p>
              <div style={styles.actions}>
                <Link to={`/cars/${car._id}`} style={styles.view}>View car</Link>
                <button type="button" onClick={() => removeCar(car._id)} style={styles.remove}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

const styles = {
  page: { minHeight: '100vh', padding: '72px clamp(20px, 6vw, 96px)', background: '#f4f1eb', color: '#1c2525', fontFamily: 'Georgia, serif' },
  eyebrow: { margin: 0, color: '#a65f2d', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700', fontSize: '0.72rem' },
  title: { margin: '8px 0 34px', fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: '400', lineHeight: '0.95' },
  message: { color: '#69716d', fontFamily: 'Arial, sans-serif' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' },
  card: { background: '#e9e4db', border: '1px solid #d2cbc1' },
  image: { width: '100%', height: '190px', objectFit: 'cover', display: 'block' },
  cardBody: { padding: '20px' },
  carTitle: { margin: 0, fontSize: '1.5rem', fontWeight: '400' },
  meta: { color: '#69716d', fontFamily: 'Arial, sans-serif' },
  actions: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '18px' },
  view: { background: '#e6a35c', color: '#1c2525', padding: '10px 13px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: '700', fontSize: '0.8rem' },
  remove: { background: 'transparent', border: '1px solid #a65f2d', color: '#713d31', padding: '9px 12px', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontSize: '0.8rem' },
};

export default Wishlist;