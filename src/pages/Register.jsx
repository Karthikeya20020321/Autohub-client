import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/cars');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={styles.page}>
      <div className="auth-card" style={styles.card}>
        <p style={styles.eyebrow}>Join AutoHub</p>
        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>Start your AutoHub journey today.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="John Doe"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordField}>
              <input
                key={showPassword ? 'visible-password' : 'hidden-password'}
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.input, paddingRight: '64px', color: '#1c2525' }}
                placeholder="Minimum 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                style={styles.passwordToggle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <p style={styles.passwordHint} aria-live="polite">
              {formData.password ? `${formData.password.length} characters entered` : 'Enter your password'}
            </p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <div className="roleOptions" style={styles.roleOptions}>
              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                />
                <span style={styles.roleOptionText}><strong>Customer</strong><small>Rent a car for your next trip</small></span>
              </label>
              <label style={styles.roleOption}>
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === 'seller'}
                  onChange={handleChange}
                />
                <span style={styles.roleOptionText}><strong>Seller</strong><small>List your car on AutoHub</small></span>
              </label>
            </div>
          </div>

          {error ? <p style={styles.error}>{error}</p> : null}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1c2525',
    padding: '40px 20px',
    fontFamily: 'Georgia, serif',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    background: '#f4f1eb',
    padding: '42px 36px',
    border: '1px solid #d2cbc1',
  },
  eyebrow: {
    margin: '0 0 18px',
    color: '#a65f2d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '0 0 8px',
    fontSize: 'clamp(2.4rem, 6vw, 4rem)',
    fontWeight: '400',
    lineHeight: '0.98',
    color: '#1c2525',
  },
  subtitle: {
    margin: '0 0 24px',
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.98rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  passwordField: {
    position: 'relative',
  },
  label: {
    color: '#1c2525',
    fontFamily: 'Arial, sans-serif',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '13px 14px',
    borderRadius: 0,
    border: '1px solid #bdb6ac',
    background: '#fffdf8',
    color: '#1c2525',
    colorScheme: 'light',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  passwordToggle: {
    position: 'absolute',
    top: '50%',
    right: '12px',
    transform: 'translateY(-50%)',
    border: 'none',
    background: 'transparent',
    color: '#a65f2d',
    cursor: 'pointer',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '4px',
  },
  passwordHint: {
    margin: 0,
    color: '#69716d',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.72rem',
  },
  roleOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '10px',
  },
  roleOption: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '9px',
    padding: '13px 11px',
    border: '1px solid #bdb6ac',
    background: '#fffdf8',
    color: '#1c2525',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  roleOptionText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  error: {
    margin: 0,
    color: '#9b4434',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.9rem',
  },
  button: {
    marginTop: '8px',
    border: 'none',
    background: '#e6a35c',
    color: '#1c2525',
    padding: '13px 16px',
    borderRadius: 0,
    fontSize: '1rem',
    fontWeight: '700',
    fontFamily: 'Arial, sans-serif',
    cursor: 'pointer',
  },
};

export default Register;
