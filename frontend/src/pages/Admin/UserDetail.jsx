import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import RoleBadge from '../../components/RoleBadge';
import RatingPill from '../../components/RatingPill';
import Alert from '../../components/Alert';
import API from '../../services/api';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('Failed to load user details.'));
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader title="User Details" subtitle="Full profile information" />
        <div className="detail-card">
          <Link to="/admin/users" className="back-link">← Back to Users</Link>
          {error && <Alert type="error">{error}</Alert>}
          {user && (
            <div className="detail-grid">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span><strong>{user.name}</strong></span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span>{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Address</span>
                <span>{user.address || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <RoleBadge role={user.role} />
              </div>
              {user.role === 'STORE_OWNER' && (
                <div className="detail-row">
                  <span className="detail-label">Store Rating</span>
                  <RatingPill value={user.store_avg_rating || 0} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetail;
