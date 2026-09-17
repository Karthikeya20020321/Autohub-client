import React from 'react';
import { Link } from 'react-router-dom';

const CarCards = ({ cars = [] }) => {
  return (
    <div className="cars-grid" style={styles.grid}>
      {cars.length === 0 ? (
        <p style={styles.empty}>No cars available right now.</p>
      ) : (
        cars.map((car) => (
          <article className="car-listing" key={car._id || car.id} style={styles.card}>
            <div style={styles.imageBox}>
              {car.images && car.images.length > 0 ? (
                <img src={car.images[0]} alt={car.title} style={styles.image} />
              ) : (
                <div style={styles.placeholder}>Car Image</div>
              )}
            </div>
            <div style={styles.content}>
              <div style={styles.topRow}>
                <h3 style={styles.title}>{car.title}</h3>
                <span style={{ ...styles.badge, ...(car.available === false ? styles.booked : styles.available) }}>
                  {car.available === false ? 'Booked' : 'Available'}
                </span>
              </div>
              <p style={styles.meta}>{car.brand} · {car.model} · {car.year}</p>
              <p style={styles.location}>{car.location || 'Location not specified'}</p>
              <div style={styles.bottomRow}>
                <p style={styles.price}>₹{car.price || car.pricePerDay || 0}<small>/day</small></p>
                <Link to={`/cars/${car._id}`} style={styles.button}>View details ↗</Link>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px', padding: 0 },
  empty: { gridColumn: '1 / -1', color: '#69716d', textAlign: 'center', padding: '50px 0', fontFamily: 'Arial, sans-serif' },
  card: { display: 'flex', alignItems: 'stretch', background: '#e9e4db', border: '1px solid #d2cbc1', overflow: 'hidden', minHeight: '250px' },
  imageBox: { width: '38%', minWidth: '180px', background: '#d8d2c8' },
  image: { width: '100%', height: '100%', display: 'block', objectFit: 'cover' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d8d2c8', color: '#69716d', fontFamily: 'Arial, sans-serif', fontWeight: '700' },
  content: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '22px' },
  topRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' },
  title: { margin: 0, color: '#1c2525', fontFamily: 'Georgia, serif', fontSize: '1.45rem', fontWeight: '400', lineHeight: '1.1' },
  badge: { flexShrink: 0, padding: '6px 9px', fontFamily: 'Arial, sans-serif', fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase' },
  available: { background: '#c9d4c5', color: '#405440' },
  booked: { background: '#d4b3a7', color: '#713d31' },
  meta: { margin: '16px 0 7px', color: '#69716d', fontFamily: 'Arial, sans-serif', fontSize: '0.82rem' },
  location: { margin: '0 0 22px', color: '#69716d', fontFamily: 'Arial, sans-serif', fontSize: '0.78rem' },
  bottomRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid #d2cbc1', paddingTop: '15px' },
  price: { margin: 0, color: '#1c2525', fontFamily: 'Arial, sans-serif', fontSize: '1rem', fontWeight: '700' },
  button: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#e6a35c', color: '#1c2525', padding: '10px 13px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: '700' },
};

export default CarCards;
