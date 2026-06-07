import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import RatingPill from '../../components/RatingPill';
import Alert from '../../components/Alert';
import API from '../../services/api';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  useEffect(() => {
    API.get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard.'));
  }, []);

  const handleSort = (col) => {
    if (sortBy === col) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(col); setOrder('ASC'); }
  };

  const sortClass = (col) => sortBy === col ? 'sorted' : '';
  const arrow = (col) => sortBy === col ? (
    <span className="sort-arrow">{order === 'ASC' ? '▲' : '▼'}</span>
  ) : null;

  const sortedRaters = data ? [...data.raters].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'updated_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortBy === 'score') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  }) : [];

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader
          title="My Store Dashboard"
          subtitle="Track your store performance and customer feedback"
        />
        {error && <Alert type="error">{error}</Alert>}
        {data && (
          <>
            <div className="stats">
              <StatCard icon="🏪" value={data.store.name} label="Store Name" variant="indigo" />
              <StatCard
                icon="⭐"
                value={parseFloat(data.store.avg_rating).toFixed(1)}
                label="Average Rating"
                variant="amber"
              />
              <StatCard icon="💬" value={data.raters.length} label="Total Ratings" variant="emerald" />
            </div>
            <div className="table-wrap">
              <div className="table-header">
                <h2>Users Who Rated Your Store</h2>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th className={sortClass('name')} onClick={() => handleSort('name')}>Name{arrow('name')}</th>
                      <th className={sortClass('email')} onClick={() => handleSort('email')}>Email{arrow('email')}</th>
                      <th className={sortClass('score')} onClick={() => handleSort('score')}>Rating{arrow('score')}</th>
                      <th className={sortClass('updated_at')} onClick={() => handleSort('updated_at')}>Date{arrow('updated_at')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRaters.map((r) => (
                      <tr key={r.id}>
                        <td><strong>{r.name}</strong></td>
                        <td>{r.email}</td>
                        <td><RatingPill value={r.score} /></td>
                        <td>{new Date(r.updated_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {sortedRaters.length === 0 && (
                      <tr className="empty-row"><td colSpan="4">No ratings yet. Check back soon!</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OwnerDashboard;
