import React from 'react';

const About = () => {
  return (
    <div className="about-page" style={styles.page}>
      <div className="about-hero" style={styles.hero}>
        <p style={styles.eyebrow}>About AutoHub</p>
        <h1 style={styles.title}>Comfort, convenience, and confidence on every trip.</h1>
        <p style={styles.text}>
          AutoHub makes renting a car simple and stress-free. From daily commutes to special weekend drives,
          we help customers find the right vehicle for every journey.
        </p>
      </div>

      <div className="about-grid" style={styles.grid}>
        <div className="about-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Our Mission</h3>
          <p style={styles.cardText}>To make premium car rentals easy, transparent, and reliable for everyone.</p>
        </div>
        <div className="about-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Why Choose Us</h3>
          <p style={styles.cardText}>Curated vehicles, clear pricing, quick booking, and responsive support at every step.</p>
        </div>
        <div className="about-card" style={styles.card}>
          <h3 style={styles.cardTitle}>Trusted Service</h3>
          <p style={styles.cardText}>Well-maintained cars, verified listings, and service designed around your comfort.</p>
        </div>
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
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '40px',
    background: '#1c2525',
    padding: '70px clamp(24px, 6vw, 78px)',
    marginBottom: '50px',
  },
  eyebrow: {
    margin: 0,
    color: '#e6a35c',
    fontFamily: 'Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '700',
    fontSize: '0.72rem',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2.6rem, 5vw, 5rem)',
    fontWeight: '400',
    color: '#f5f1e9',
    lineHeight: '0.98',
  },
  text: {
    margin: 0,
    alignSelf: 'end',
    margin: 0,
    fontSize: '1rem',
    color: '#c3cbc7',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.75',
    maxWidth: '760px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  card: {
    background: '#e9e4db',
    border: '1px solid #d2cbc1',
    padding: '26px',
  },
  cardTitle: {
    margin: '0 0 14px',
    fontSize: '1.65rem',
    fontWeight: '400',
    color: '#1c2525',
  },
  cardText: {
    margin: 0,
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.7',
  },
};

export default About;
