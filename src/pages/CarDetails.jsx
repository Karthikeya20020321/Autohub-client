import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sampleCars } from './Cars';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(getDateOffset(1));
  const [endDate, setEndDate] = useState(getDateOffset(2));

  const isDemoCar = String(id).startsWith('demo-');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/cars/${id}`);
        const data = await res.json();

        if (data.success) {
          setCar(data.car);
          return;
        }

        const fallbackCar = sampleCars.find((car) => String(car._id) === String(id));
        if (fallbackCar) {
          setCar(fallbackCar);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);

        const fallbackCar = sampleCars.find((car) => String(car._id) === String(id));
        if (fallbackCar) {
          setCar(fallbackCar);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (!loading && !car) {
      const fallbackCar = sampleCars.find((item) => String(item._id) === String(id));
      if (fallbackCar) {
        setCar(fallbackCar);
      }
    }
  }, [id, loading, car]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

    setIsWishlisted(localWishlist.includes(id));

    if (!token || isDemoCar) return;

    fetch(`http://localhost:5000/api/wishlist/check/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setIsWishlisted(data.isWishlisted);
      })
      .catch(() => {});
  }, [id, isDemoCar]);

  const handleBookNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (car.available === false) {
      setMessage('This car is already booked. Please choose another car.');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setMessage('Please choose an end date after the start date.');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      if (isDemoCar) {
        const demoBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const alreadyBooked = demoBookings.some((booking) => {
          const sameCar = booking.carId === id || booking.car === car.title;
          return sameCar && booking.status !== 'Cancelled' && datesOverlap(
            startDate,
            endDate,
            booking.startDate,
            booking.endDate
          );
        });

        if (alreadyBooked) {
          setMessage('This car is already booked for the selected dates.');
          return;
        }

        demoBookings.unshift({
          id: `local-${Date.now()}`,
          carId: id,
          car: car.title,
          pickup: car.location,
          startDate,
          endDate,
          total: `₹${car.price * dateDifference(startDate, endDate)}`,
          status: 'Confirmed',
        });
        localStorage.setItem('bookings', JSON.stringify(demoBookings));
        setMessage('Booking confirmed successfully.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ car: id, startDate, endDate }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to create booking.');
      setMessage('Booking confirmed successfully.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      if (isDemoCar) {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        const nextWishlist = isWishlisted
          ? wishlist.filter((carId) => carId !== id)
          : [...wishlist, id];
        localStorage.setItem('wishlist', JSON.stringify(nextWishlist));
        setIsWishlisted(!isWishlisted);
        setMessage(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.');
        return;
      }

      const response = await fetch(
        isWishlisted ? `http://localhost:5000/api/wishlist/${id}` : 'http://localhost:5000/api/wishlist/add',
        {
          method: isWishlisted ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: isWishlisted ? undefined : JSON.stringify({ carId: id }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to update wishlist.');
      setIsWishlisted(!isWishlisted);
      setMessage(isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading car details...</div>;
  }

  if (!car) {
    return <div style={styles.empty}>Car not found.</div>;
  }

  return (
    <div className="details-page" style={styles.page}>
      <div className="details-gallery" style={styles.gallery}>
        {car.images && car.images.length > 0 ? (
          car.images.map((image, index) => (
            <img key={index} src={image} alt={car.title} style={styles.image} />
          ))
        ) : (
          <div style={styles.placeholder}>Car Image</div>
        )}
      </div>

      <div className="details-container" style={styles.container}>
        <div className="details-info" style={styles.infoBox}>
          <p style={styles.label}>Featured car</p>
          <h1 style={styles.title}>{car.title}</h1>
          <p style={styles.meta}>
            {car.brand} • {car.model} • {car.year}
          </p>

          <div style={styles.tagsRow}>
            <span style={styles.tag}>{car.transmission || 'Automatic'}</span>
            <span style={styles.tag}>{car.fuelType || 'Petrol'}</span>
            <span style={styles.tag}>{car.seats || 5} seats</span>
          </div>

          <p style={styles.description}>{car.description || 'No description available.'}</p>

          <div style={styles.detailsGrid}>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Price</span>
              <strong style={styles.detailValue}>₹{car.price || car.pricePerDay || 0}/day</strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Location</span>
              <strong style={styles.detailValue}>{car.location || 'Not provided'}</strong>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status</span>
              <strong style={styles.detailValue}>{car.available === false ? 'Booked' : 'Available'}</strong>
            </div>
          </div>
        </div>

        <aside className="details-booking" style={styles.bookingBox}>
          <p style={styles.priceLabel}>From</p>
          <h2 style={styles.price}>₹{car.price || car.pricePerDay || 0}/day</h2>
          <label style={styles.dateLabel} htmlFor="start-date">Start date</label>
          <input id="start-date" type="date" value={startDate} min={getDateOffset(0)} onChange={(event) => setStartDate(event.target.value)} style={styles.dateInput} />
          <label style={styles.dateLabel} htmlFor="end-date">End date</label>
          <input id="end-date" type="date" value={endDate} min={startDate} onChange={(event) => setEndDate(event.target.value)} style={styles.dateInput} />
          <button style={styles.primaryButton} onClick={handleBookNow} disabled={actionLoading || car.available === false}>
            {car.available === false ? 'Already Booked' : actionLoading ? 'Please wait...' : 'Book Now'}
          </button>
          <button style={styles.secondaryButton} onClick={handleWishlist} disabled={actionLoading}>
            {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
          {message && <p style={styles.message}>{message}</p>}
        </aside>
      </div>
    </div>
  );
};

function getDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function dateDifference(startDate, endDate) {
  const difference = new Date(endDate) - new Date(startDate);
  return Math.max(1, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}

function datesOverlap(startDate, endDate, existingStartDate, existingEndDate) {
  return new Date(startDate) < new Date(existingEndDate) && new Date(endDate) > new Date(existingStartDate);
}

const styles = {
  page: {
    width: '100%',
    boxSizing: 'border-box',
    margin: 0,
    padding: '64px clamp(20px, 6vw, 96px) 90px',
    background: '#f4f1eb',
    color: '#1c2525',
    fontFamily: 'Georgia, serif',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '28px',
  },
  image: {
    width: '100%',
    height: '360px',
    objectFit: 'cover',
    borderRadius: 0,
  },
  placeholder: {
    width: '100%',
    height: '360px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#d8d2c8',
    color: '#69716d',
    fontWeight: '600',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '18px',
    alignItems: 'start',
  },
  infoBox: {
    background: '#e9e4db',
    border: '1px solid #d2cbc1',
    borderRadius: 0,
    padding: '34px',
  },
  label: {
    margin: 0,
    color: '#a65f2d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.82rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  title: {
    margin: '8px 0',
    fontSize: 'clamp(2.6rem, 5vw, 5rem)',
    fontWeight: '400',
    lineHeight: '0.98',
    color: '#1c2525',
  },
  meta: {
    margin: 0,
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '26px',
  },
  tag: {
    background: '#c9d4c5',
    color: '#405440',
    padding: '8px 12px',
    borderRadius: 0,
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  description: {
    marginTop: '18px',
    lineHeight: '1.7',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  detailItem: {
    background: '#f4f1eb',
    border: '1px solid #d2cbc1',
    borderRadius: 0,
    padding: '14px',
  },
  detailLabel: {
    display: 'block',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.8rem',
    marginBottom: '8px',
  },
  detailValue: {
    color: '#1c2525',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
  },
  bookingBox: {
    background: '#1c2525',
    border: 'none',
    borderRadius: 0,
    padding: '30px',
    position: 'sticky',
    top: '20px',
  },
  priceLabel: {
    margin: 0,
    color: '#aeb9b2',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  price: {
    margin: '8px 0 20px',
    fontSize: '2rem',
    color: '#f5f1e9',
  },
  dateLabel: {
    display: 'block',
    color: '#c3cbc7',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '6px',
  },
  dateInput: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #68736d',
    borderRadius: 0,
    padding: '10px',
    marginBottom: '12px',
    fontSize: '0.9rem',
  },
  primaryButton: {
    width: '100%',
    background: '#e6a35c',
    color: '#1c2525',
    border: 'none',
    padding: '12px 14px',
    borderRadius: 0,
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    marginBottom: '12px',
  },
  secondaryButton: {
    width: '100%',
    background: 'transparent',
    color: '#f5f1e9',
    border: '1px solid #68736d',
    padding: '12px 14px',
    borderRadius: 0,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  message: {
    margin: '14px 0 0',
    color: '#e6a35c',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.88rem',
    lineHeight: '1.4',
  },
  loading: {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#374151',
    fontSize: '1.1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#ef4444',
    fontSize: '1.1rem',
  },
};

export default CarDetails;
