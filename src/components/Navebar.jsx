import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    } catch {
      setUser(null);
    }
  }, [location.key]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>AutoHub</div>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/cars" style={styles.link}>Cars</Link>
        <Link to="/booking" style={styles.link}>Booking</Link>
        <Link to="/wishlist" style={styles.link}>Wishlist</Link>
        <Link to="/about" style={styles.link}>About</Link>
        {user && (user.role === 'seller' || user.role === 'admin') ? (
          <Link to="/sell-car" style={styles.link}>Sell Car</Link>
        ) : null}
        {user?.role === 'admin' ? (
          <Link to="/admin" style={styles.link}>Admin</Link>
        ) : null}
      </div>

      <div style={styles.account}>
        {user ? (
          <>
            <span style={styles.status}>
              {user.name} <small style={styles.role}>({user.role})</small>
            </span>
            <button type="button" onClick={handleLogout} style={styles.logout}>
              Logout
            </button>
          </>
        ) : (
          <span style={styles.accountHint}>Not signed in</span>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: '#111827',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  brand: {
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '0.96rem',
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  status: {
    color: '#f9fafb',
    fontSize: '0.86rem',
  },
  role: {
    color: '#cbd5e1',
    textTransform: 'capitalize',
  },
  accountHint: {
    color: '#cbd5e1',
    fontSize: '0.82rem',
  },
  logout: {
    border: '1px solid #94a3b8',
    background: 'transparent',
    color: '#f9fafb',
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
};

export default Navebar;
