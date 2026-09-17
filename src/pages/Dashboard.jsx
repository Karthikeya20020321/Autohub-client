import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalUsers: 0,
    totalBookings: 0,
  });
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async (token) => {
    const response = await fetch('http://localhost:5000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Unable to load users');
    }

    setUsers(data.users || []);
    return data;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('token');

        if (!token || !user || user.role !== 'admin') {
          setLoading(false);
          return;
        }

        const [carsRes, usersData, bookingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/cars'),
          fetchUsers(token),
          fetch('http://localhost:5000/api/bookings/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const carsData = await carsRes.json();
        const bookingsData = await bookingsRes.json();

        setStats({
          totalCars: carsData.success ? carsData.count || 0 : 0,
          totalUsers: usersData.success ? usersData.count || 0 : 0,
          totalBookings: bookingsData.success ? bookingsData.count || 0 : 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBlockToggle = async (user) => {
    const token = localStorage.getItem('token');
    setActionId(user._id);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user._id}/block`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to update user status');
      }

      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser._id === user._id ? data.user : currentUser
        )
      );
    } catch (error) {
      setError(error.message || 'Unable to update user status');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}'s account?`)) {
      return;
    }

    const token = localStorage.getItem('token');
    setActionId(user._id);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to delete user');
      }

      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser._id !== user._id));
      setStats((currentStats) => ({
        ...currentStats,
        totalUsers: Math.max(0, currentStats.totalUsers - 1),
      }));
    } catch (error) {
      setError(error.message || 'Unable to delete user');
    } finally {
      setActionId(null);
    }
  };

  const visibleUsers = users.filter(
    (user) => roleFilter === 'all' || user.role === roleFilter
  );

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <p style={styles.kicker}>AutoHub administration</p>
        <h1 style={styles.title}>Keep every journey moving.</h1>
        <p style={styles.heroText}>Manage customers, sellers, and the people behind every booking.</p>
      </header>

      {error ? <p style={styles.error}>{error}</p> : null}

      <section style={styles.content}>
        <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.label}>Total Cars</p>
          <h2 style={styles.value}>{stats.totalCars}</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.label}>Total Users</p>
          <h2 style={styles.value}>{stats.totalUsers}</h2>
        </div>

        <div style={styles.card}>
          <p style={styles.label}>Total Bookings</p>
          <h2 style={styles.value}>{stats.totalBookings}</h2>
        </div>
        </div>

        <section style={styles.usersSection}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.label}>Account management</p>
            <h2 style={styles.sectionTitle}>Customers and sellers</h2>
          </div>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            style={styles.filter}
            aria-label="Filter users by role"
          >
            <option value="all">All accounts</option>
            <option value="customer">Customers</option>
            <option value="seller">Sellers</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeading}>Name</th>
                <th style={styles.tableHeading}>Email</th>
                <th style={styles.tableHeading}>Phone</th>
                <th style={styles.tableHeading}>Role</th>
                <th style={styles.tableHeading}>Status</th>
                <th style={styles.tableHeading}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.length > 0 ? visibleUsers.map((user) => (
                <tr key={user._id}>
                  <td style={styles.tableCell}>{user.name}</td>
                  <td style={styles.tableCell}>{user.email}</td>
                  <td style={styles.tableCell}>{user.phone || 'Not provided'}</td>
                  <td style={styles.tableCell}><span style={styles.role}>{user.role}</span></td>
                  <td style={styles.tableCell}>{user.isBlocked ? 'Blocked' : 'Active'}</td>
                  <td style={styles.actionsCell}>
                    <button
                      type="button"
                      onClick={() => handleBlockToggle(user)}
                      disabled={actionId === user._id}
                      style={styles.secondaryButton}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      disabled={actionId === user._id}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={styles.emptyCell}>No accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </section>
      </section>
    </div>
  );
};

const styles = {
  page: {
    width: '100%',
    minHeight: '100vh',
    background: '#f4f1eb',
    color: '#1c2525',
    fontFamily: 'Georgia, serif',
    paddingBottom: '80px',
  },
  hero: {
    background: '#1c2525',
    color: '#f5f1e9',
    padding: '72px clamp(28px, 7vw, 110px) 64px',
  },
  kicker: {
    margin: '0 0 20px',
    color: '#e6a35c',
    fontFamily: 'Arial, sans-serif',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  title: {
    maxWidth: '650px',
    margin: 0,
    color: '#f5f1e9',
    fontSize: 'clamp(2.8rem, 6vw, 5.6rem)',
    fontWeight: '400',
    lineHeight: '0.98',
  },
  heroText: {
    maxWidth: '440px',
    margin: '24px 0 0',
    color: '#c3cbc7',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.7',
  },
  error: {
    maxWidth: '1100px',
    margin: '24px auto 0',
    background: '#f8d8d2',
    color: '#8c3f32',
    padding: '12px 16px',
    fontFamily: 'Arial, sans-serif',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '70px clamp(28px, 5vw, 70px) 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
  },
  card: {
    background: '#e9e4db',
    padding: '22px',
    borderTop: '3px solid #a65f2d',
  },
  label: {
    margin: 0,
    color: '#a65f2d',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  value: {
    margin: '12px 0 0',
    fontSize: '2rem',
    color: '#1c2525',
  },
  loading: {
    textAlign: 'center',
    padding: '50px 20px',
    color: '#69716d',
    fontSize: '1.1rem',
  },
  usersSection: {
    marginTop: '52px',
    background: '#e9e4db',
    padding: '28px',
    overflow: 'hidden',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
    gap: '20px',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '6px 0 0',
    color: '#1c2525',
  },
  filter: {
    padding: '10px 12px',
    border: '1px solid #bdb6ac',
    background: '#f4f1eb',
    color: '#1c2525',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '760px',
    color: '#1c2525',
    fontSize: '0.9rem',
  },
  tableHeading: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #c8c1b7',
    color: '#69716d',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  tableCell: {
    padding: '15px 12px',
    borderBottom: '1px solid #d2cbc1',
    whiteSpace: 'nowrap',
  },
  actionsCell: {
    padding: '15px 12px',
    borderBottom: '1px solid #d2cbc1',
    whiteSpace: 'nowrap',
  },
  role: {
    textTransform: 'capitalize',
    color: '#a65f2d',
    fontWeight: '600',
  },
  secondaryButton: {
    border: '1px solid #a65f2d',
    background: '#f4f1eb',
    color: '#1c2525',
    padding: '7px 10px',
    cursor: 'pointer',
    marginRight: '8px',
  },
  deleteButton: {
    border: '1px solid #9b4434',
    background: '#f8d8d2',
    color: '#8c3f32',
    padding: '7px 10px',
    cursor: 'pointer',
  },
  emptyCell: {
    padding: '28px 12px',
    textAlign: 'center',
    color: '#69716d',
  },
};

export default Dashboard;
