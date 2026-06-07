import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';
import API from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load stats.'));
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Overview of platform activity and quick actions"
        />
        {error && <Alert type="error">{error}</Alert>}
        {stats && (
          <div className="stats">
            <StatCard icon="👥" value={stats.total_users} label="Total Users" variant="indigo" />
            <StatCard icon="🏪" value={stats.total_stores} label="Total Stores" variant="violet" />
            <StatCard icon="⭐" value={stats.total_ratings} label="Total Ratings" variant="amber" />
          </div>
        )}
        <div className="quick-actions">
          <Link to="/admin/users" className="action-card">
            <span className="action-card-icon">👥</span>
            <span className="action-card-title">Manage Users</span>
            <span className="action-card-desc">View, filter and add users</span>
          </Link>
          <Link to="/admin/stores" className="action-card">
            <span className="action-card-icon">🏪</span>
            <span className="action-card-title">Manage Stores</span>
            <span className="action-card-desc">Browse and filter all stores</span>
          </Link>
          <Link to="/admin/create-user" className="action-card">
            <span className="action-card-icon">➕</span>
            <span className="action-card-title">Add New User</span>
            <span className="action-card-desc">Create admin, user or owner</span>
          </Link>
          <Link to="/admin/create-store" className="action-card">
            <span className="action-card-icon">🏬</span>
            <span className="action-card-title">Add New Store</span>
            <span className="action-card-desc">Register a store with owner</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
