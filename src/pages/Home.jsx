import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const featuredCars = [
  {
    id: 'demo-1',
    name: 'BMW 5 Series',
    type: 'Executive sedan',
    price: '₹3,200',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'demo-2',
    name: 'Audi Q5',
    type: 'Premium SUV',
    price: '₹2,900',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'demo-3',
    name: 'Tesla Model 3',
    type: 'Electric performance',
    price: '₹4,200',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'demo-4',
    name: 'Mercedes C-Class',
    type: 'Refined sedan',
    price: '₹3,600',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'demo-5',
    name: 'Range Rover Evoque',
    type: 'Luxury SUV',
    price: '₹4,800',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'demo-6',
    name: 'Porsche 911',
    type: 'Performance coupe',
    price: '₹5,200',
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1000&q=85',
  },
];

const Home = () => {
  const [visibleFeaturedCars] = useState(() => [...featuredCars].sort(() => Math.random() - 0.5).slice(0, 3));

  return (
    <main className="home-page" style={styles.page}>
      <section className="home-hero" style={styles.hero}>
        <div className="home-auth" style={styles.auth}>
          <Link to="/login" style={styles.loginLink}>Login</Link>
          <Link to="/register" style={styles.signupLink}>Sign up</Link>
        </div>
        <div style={styles.heroCopy}>
          <p style={styles.kicker}>The smarter way to move</p>
          <h1 style={styles.heading}>Your next drive starts here.</h1>
          <p style={styles.subText}>
            Browse a handpicked collection of cars that make every journey feel considered.
          </p>
          <div style={styles.actions}>
            <Link to="/cars" style={styles.primaryBtn}>Explore the collection <span>↗</span></Link>
            <Link to="/about" style={styles.textLink}>How AutoHub works</Link>
          </div>
          <div style={styles.heroStats}>
            <div><strong>50+</strong><span>cars available</span></div>
            <div><strong>12</strong><span>cities covered</span></div>
            <div><strong>24/7</strong><span>support</span></div>
          </div>
        </div>
        <div className="home-hero-visual" style={styles.heroVisual}>
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1400&q=85"
            alt="Luxury car ready for a journey"
            style={styles.heroImage}
          />
          <div style={styles.heroLabel}>
            <span style={styles.liveDot} />
            <div><small>Featured this week</small><strong>Mercedes C-Class</strong></div>
            <span style={styles.labelArrow}>↗</span>
          </div>
        </div>
      </section>

      <section className="home-benefits" style={styles.benefits}>
        <p style={styles.sectionKicker}>Why AutoHub</p>
        <div className="home-benefit-grid" style={styles.benefitGrid}>
          <div><span style={styles.number}>01</span><h2 style={styles.benefitTitle}>Choice without the noise</h2><p style={styles.benefitText}>Find premium, family, and electric cars in one clear collection.</p></div>
          <div><span style={styles.number}>02</span><h2 style={styles.benefitTitle}>Simple from start to finish</h2><p style={styles.benefitText}>Transparent daily pricing and quick booking, with no surprises.</p></div>
          <div><span style={styles.number}>03</span><h2 style={styles.benefitTitle}>Ready when you are</h2><p style={styles.benefitText}>Reliable support keeps every trip moving in the right direction.</p></div>
        </div>
      </section>

      <section className="home-featured" style={styles.featuredSection}>
        <div className="home-featured-header" style={styles.featuredHeader}>
          <div><p style={styles.sectionKicker}>Curated for you</p><h2 style={styles.sectionTitle}>Cars worth going out for.</h2></div>
          <Link to="/cars" style={styles.viewAllLink}>View all cars <span>↗</span></Link>
        </div>
        <div className="home-featured-grid" style={styles.featuredGrid}>
          {visibleFeaturedCars.map((car) => (
            <article key={car.name} style={styles.carCard}>
              <img src={car.image} alt={car.name} style={styles.carImage} />
              <div style={styles.carInfo}>
                <p style={styles.carType}>{car.type}</p>
                <h3 style={styles.carTitle}>{car.name}</h3>
                <div style={styles.carFooter}>
                  <span style={styles.carPrice}>{car.price}<small style={styles.carPriceSmall}>/day</small></span>
                  <Link to={`/cars/${car.id}`} style={styles.cardLink}>View car ↗</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

const styles = {
  page: { width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#f4f1eb', color: '#1c2525', fontFamily: 'Georgia, serif', paddingBottom: '80px' },
  hero: { position: 'relative', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', minHeight: '620px', background: '#1c2525', color: '#f5f1e9' },
  auth: { position: 'absolute', top: '24px', right: '28px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '18px', fontFamily: 'Arial, sans-serif' },
  loginLink: { color: '#f5f1e9', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700' },
  signupLink: { color: '#1c2525', background: '#e6a35c', padding: '10px 14px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700' },
  heroCopy: { padding: '88px clamp(28px, 7vw, 110px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  kicker: { margin: '0 0 22px', color: '#e6a35c', fontFamily: 'Arial, sans-serif', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' },
  heading: { margin: 0, maxWidth: '560px', color: '#f5f1e9', fontSize: 'clamp(3.4rem, 6vw, 6.4rem)', fontWeight: '400', lineHeight: '0.98', letterSpacing: 0 },
  subText: { maxWidth: '420px', margin: '30px 0 0', color: '#c3cbc7', fontFamily: 'Arial, sans-serif', fontSize: '1rem', lineHeight: '1.7' },
  actions: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginTop: '34px' },
  primaryBtn: { display: 'inline-flex', gap: '18px', alignItems: 'center', background: '#e6a35c', color: '#1c2525', padding: '15px 19px', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: '0.82rem', fontWeight: '700' },
  textLink: { color: '#f5f1e9', textDecoration: 'none', borderBottom: '1px solid #74807a', paddingBottom: '4px', fontFamily: 'Arial, sans-serif', fontSize: '0.82rem' },
  heroStats: { display: 'flex', flexWrap: 'wrap', gap: '34px', marginTop: '74px', paddingTop: '20px', borderTop: '1px solid #465150', fontFamily: 'Arial, sans-serif' },
  heroVisual: { position: 'relative', minHeight: '620px', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', minHeight: '620px', display: 'block', objectFit: 'cover', objectPosition: 'center' },
  heroLabel: { position: 'absolute', right: '28px', bottom: '28px', left: '28px', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px', background: 'rgba(28,37,37,0.9)', color: '#f5f1e9', fontFamily: 'Arial, sans-serif' },
  liveDot: { width: '8px', height: '8px', flex: '0 0 auto', borderRadius: '50%', background: '#e6a35c' },
  labelArrow: { marginLeft: 'auto', color: '#e6a35c', fontSize: '1.2rem' },
  benefits: { padding: '86px clamp(28px, 7vw, 110px) 78px', background: '#f4f1eb' },
  sectionKicker: { margin: '0 0 18px', color: '#a65f2d', fontFamily: 'Arial, sans-serif', fontSize: '0.72rem', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' },
  benefitGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '42px', borderTop: '1px solid #c8c1b7', paddingTop: '22px' },
  number: { color: '#a65f2d', fontFamily: 'Arial, sans-serif', fontSize: '0.75rem', fontWeight: '700' },
  benefitTitle: { margin: '22px 0 12px', color: '#1c2525', fontSize: '1.65rem', fontWeight: '400', lineHeight: '1.1' },
  benefitText: { maxWidth: '280px', margin: 0, color: '#69716d', fontFamily: 'Arial, sans-serif', fontSize: '0.88rem', lineHeight: '1.65' },
  featuredSection: { padding: '70px clamp(28px, 7vw, 110px)', background: '#e9e4db' },
  featuredHeader: { display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '20px', marginBottom: '30px' },
  sectionTitle: { margin: 0, color: '#1c2525', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '400', lineHeight: '1' },
  viewAllLink: { color: '#1c2525', textDecoration: 'none', borderBottom: '1px solid #1c2525', paddingBottom: '5px', fontFamily: 'Arial, sans-serif', fontSize: '0.8rem', fontWeight: '700' },
  featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' },
  carCard: { background: '#f4f1eb' },
  carImage: { width: '100%', height: '260px', display: 'block', objectFit: 'cover' },
  carInfo: { padding: '18px' },
  carType: { margin: 0, color: '#a65f2d', fontFamily: 'Arial, sans-serif', fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' },
  carTitle: { margin: '9px 0 24px', color: '#1c2525', fontSize: '1.55rem', fontWeight: '400' },
  carFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', borderTop: '1px solid #d2cbc1', paddingTop: '14px' },
  carPrice: { color: '#1c2525', fontFamily: 'Arial, sans-serif', fontSize: '0.95rem', fontWeight: '700' },
  carPriceSmall: { color: '#69716d', fontWeight: '400' },
  cardLink: { color: '#a65f2d', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: '0.78rem', fontWeight: '700' },
};

export default Home;
