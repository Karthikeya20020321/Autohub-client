import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const bookings = [
  {
    id: 1,
    car: 'BMW 5 Series',
    pickup: 'Hyderabad',
    dates: '12 Aug - 15 Aug',
    total: '₹13,500',
  },
  {
    id: 2,
    car: 'Audi Q5',
    pickup: 'Chennai',
    dates: '20 Aug - 24 Aug',
    total: '₹15,600',
  },
  {
    id: 3,
    car: 'Tesla Model 3',
    pickup: 'Pune',
    dates: '30 Aug - 02 Sep',
    total: '₹15,900',
  },
  {
    id: 4,
    car: 'Mercedes C-Class',
    pickup: 'Bengaluru',
    dates: '04 Sep - 08 Sep',
    total: '₹16,200',
  },
  {
    id: 5,
    car: 'Range Rover Evoque',
    pickup: 'Delhi',
    dates: '10 Sep - 14 Sep',
    total: '₹19,400',
  },
  {
    id: 6,
    car: 'Hyundai Creta',
    pickup: 'Kochi',
    dates: '18 Sep - 22 Sep',
    total: '₹11,800',
  },
];

const Booking = () => {
  const [customerBookings, setCustomerBookings] = useState(bookings);
  const [loading, setLoading] = useState(true);

  const cancelBooking = async (booking) => {
    if (!window.confirm('Cancel this booking?')) return;

    if (booking.id?.toString().startsWith('local-')) {
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const remainingBookings = localBookings.filter((item) => item.id !== booking.id);
      localStorage.setItem('bookings', JSON.stringify(remainingBookings));
      setCustomerBookings((current) => current.filter((item) => item.id !== booking.id));
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${booking._id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to cancel booking');
      }

      setCustomerBookings((current) =>
        current.map((item) => (item._id === booking._id ? data.booking : item))
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    if (localBookings.length > 0) {
      setCustomerBookings(localBookings);
    }

    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/bookings/my-bookings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setCustomerBookings(data.bookings.length > 0 ? data.bookings : localBookings);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="booking-page" style={styles.page}>
      <div style={styles.header}>
        <p style={styles.eyebrow}>Your reservations</p>
        <h1 style={styles.title}>Booking</h1>
      </div>

      <div className="booking-grid" style={styles.grid}>
        {!loading && customerBookings.length === 0 ? (
          <p style={styles.empty}>You have no bookings yet. Explore cars to make your first booking.</p>
        ) : customerBookings.map((booking) => (
          <div className="booking-card" key={booking._id || booking.id} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.badge}>{booking.status || 'Confirmed'}</span>
              <span style={styles.price}>{booking.total || booking.totalPrice || 'See details'}</span>
            </div>

            <h3 style={styles.carName}>{booking.car?.title || booking.car}</h3>
            <p style={styles.meta}>Pickup: {booking.pickup || booking.pickupLocation || booking.car?.location || 'Not provided'}</p>
            <p style={styles.meta}>
              Dates: {booking.dates || `${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}`}
            </p>
            {booking.status !== 'cancelled' && booking.status !== 'Cancelled' ? (
              <button type="button" onClick={() => cancelBooking(booking)} style={styles.cancelButton}>
                Cancel Booking
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <div className="booking-cta" style={styles.ctaBox}>
        <h3 style={styles.ctaTitle}>Need another ride?</h3>
        <Link to="/cars" style={styles.linkBtn}>Explore Cars</Link>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: '100%',
    boxSizing: 'border-box',
    margin: 0,
    padding: '72px clamp(20px, 6vw, 96px) 90px',
    background: '#f4f1eb',
    color: '#1c2525',
    fontFamily: 'Georgia, serif',
  },
  header: {
    marginBottom: '36px',
  },
  eyebrow: {
    margin: 0,
    color: '#a65f2d',
    fontFamily: 'Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700',
    fontSize: '0.72rem',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
    fontWeight: '400',
    lineHeight: '0.95',
    color: '#1c2525',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '18px',
  },
  card: {
    background: '#e9e4db',
    border: '1px solid #d2cbc1',
    borderRadius: 0,
    padding: '24px',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  badge: {
    background: '#c9d4c5',
    color: '#405440',
    borderRadius: 0,
    padding: '6px 10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  price: {
    fontWeight: '700',
    color: '#1c2525',
    fontFamily: 'Arial, sans-serif',
  },
  carName: {
    margin: '0 0 10px',
    fontSize: '1.65rem',
    fontWeight: '400',
    color: '#1c2525',
  },
  meta: {
    margin: '6px 0',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
  },
  empty: {
    gridColumn: '1 / -1',
    padding: '32px',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: '14px',
    border: '1px solid #a65f2d',
    background: 'transparent',
    color: '#713d31',
    padding: '9px 12px',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  ctaBox: {
    marginTop: '42px',
    background: '#1c2525',
    padding: '30px',
    textAlign: 'center',
  },
  ctaTitle: {
    margin: '0 0 16px',
    fontSize: '1.65rem',
    fontWeight: '400',
    color: '#f5f1e9',
  },
  linkBtn: {
    display: 'inline-block',
    background: '#e6a35c',
    color: '#1c2525',
    textDecoration: 'none',
    padding: '12px 18px',
    borderRadius: 0,
    fontFamily: 'Arial, sans-serif',
    fontWeight: '700',
  },
};

export default Booking;
