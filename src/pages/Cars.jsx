import React, { useEffect, useState } from 'react';
import CarCards from '../components/CarCards';

export const sampleCars = Array.from({ length: 50 }, (_, index) => {
  const carBrands = [
    'BMW', 'Mercedes', 'Audi', 'Tesla', 'Land Rover', 'Volvo', 'Honda', 'Hyundai',
    'Jaguar', 'Porsche', 'Kia', 'Toyota', 'MG', 'Skoda', 'Nissan'
  ];

  const modelsByBrand = {
    BMW: ['5 Series', '3 Series', 'X5', 'X3', 'i8'],
    Mercedes: ['C-Class', 'E-Class', 'GLE', 'GLC', 'S-Class'],
    Audi: ['Q5', 'A4', 'A6', 'Q7', 'RS5'],
    Tesla: ['Model 3', 'Model Y', 'Model S'],
    'Land Rover': ['Evoque', 'Velar', 'Sport'],
    Volvo: ['XC60', 'XC90', 'V60', 'S60'],
    Honda: ['Civic', 'City', 'Accord', 'CR-V'],
    Hyundai: ['Creta', 'Verna', 'Elantra', 'Venue'],
    Jaguar: ['XE', 'XF', 'F-Pace'],
    Porsche: ['911', 'Cayenne', 'Panthar'],
    Kia: ['Seltos', 'Sportage', 'Carnival'],
    Toyota: ['Fortuner', 'Innova', 'Corolla', 'Camry'],
    MG: ['Hector', 'ZS EV', 'Gloster'],
    Skoda: ['Superb', 'Kodiaq', 'Octavia'],
    Nissan: ['Magnite', 'X-Trail', 'Altima'],
  };

  const cities = [
    'Hyderabad', 'Bengaluru', 'Chennai', 'Delhi', 'Mumbai', 'Pune', 'Jaipur',
    'Kochi', 'Ahmedabad', 'Lucknow', 'Nagpur', 'Visakhapatnam'
  ];

  const brand = carBrands[index % carBrands.length];
  const modelList = modelsByBrand[brand] || ['Model'];
  const model = modelList[index % modelList.length];
  const year = 2019 + ((index * 3) % 6);
  const price = 2200 + ((index * 340) % 5000);
  const location = cities[index % cities.length];
  const available = index % 5 !== 0;
  const images = [
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80'
  ];

  return {
    _id: `demo-${index + 1}`,
    title: `${brand} ${model}`,
    brand,
    model,
    year,
    price,
    location,
    available,
    images: [images[index % images.length]],
  };
});

const Cars = () => {
  const [cars, setCars] = useState(sampleCars);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/cars');
        const data = await res.json();

        if (data.success && Array.isArray(data.cars) && data.cars.length > 0) {
          setCars(data.cars);
        } else {
          setCars(sampleCars);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars(sampleCars);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="cars-page" style={styles.page}>
      <div className="cars-header" style={styles.header}>
        <div>
          <p style={styles.eyebrow}>The AutoHub collection</p>
          <h1 style={styles.title}>Available Cars</h1>
          <p style={styles.subtitle}>Find the right car for the road ahead, from everyday comfort to weekend escape.</p>
        </div>
        <div className="cars-count" style={styles.count}><strong>{cars.length}</strong><span>cars to explore</span></div>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading cars...</p>
      ) : (
        <CarCards cars={cars} />
      )}
    </div>
  );
};

const styles = {
  page: {
    width: '100%',
    margin: 0,
    padding: '72px clamp(20px, 6vw, 96px) 90px',
    fontFamily: 'Georgia, serif',
    background: '#f4f1eb',
    color: '#1c2525',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    marginBottom: '36px',
    gap: '24px',
  },
  eyebrow: {
    margin: '0 0 16px',
    color: '#a65f2d',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontSize: '0.72rem',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
    fontWeight: '400',
    lineHeight: '0.95',
    color: '#1c2525',
  },
  subtitle: {
    maxWidth: '530px',
    margin: '22px 0 0',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.95rem',
    lineHeight: '1.65',
  },
  count: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    borderTop: '1px solid #c8c1b7',
    paddingTop: '10px',
    minWidth: '120px',
    fontFamily: 'Arial, sans-serif',
  },
  countNumber: {
    color: '#1c2525',
    fontFamily: 'Georgia, serif',
    fontSize: '2rem',
    fontWeight: '400',
  },
  countLabel: {
    color: '#69716d',
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  loading: {
    textAlign: 'center',
    color: '#374151',
    fontSize: '1.1rem',
    padding: '40px 0',
  },
};

export default Cars;
