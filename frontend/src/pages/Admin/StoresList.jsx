import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import RatingPill from '../../components/RatingPill';
import API from '../../services/api';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchStores = () => {
    API.get('/admin/stores', { params: { ...filters, sortBy, order } })
      .then((res) => setStores(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchStores(); }, [filters, sortBy, order]);

  const handleSort = (col) => {
    if (sortBy === col) setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(col); setOrder('ASC'); }
  };

  const sortClass = (col) => sortBy === col ? 'sorted' : '';
  const arrow = (col) => sortBy === col ? (
    <span className="sort-arrow">{order === 'ASC' ? '▲' : '▼'}</span>
  ) : null;

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader
          title="Stores"
          subtitle="All registered stores on the platform"
          actions={
            <Link to="/admin/create-store" className="btn-primary">+ Add Store</Link>
          }
        />
        <div className="table-wrap">
          <div className="filters">
            <input placeholder="🔍  Filter by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
            <input placeholder="🔍  Filter by email"
              onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
            <input placeholder="🔍  Filter by address"
              onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className={sortClass('name')} onClick={() => handleSort('name')}>Name{arrow('name')}</th>
                  <th className={sortClass('email')} onClick={() => handleSort('email')}>Email{arrow('email')}</th>
                  <th className={sortClass('address')} onClick={() => handleSort('address')}>Address{arrow('address')}</th>
                  <th className={sortClass('avg_rating')} onClick={() => handleSort('avg_rating')}>Rating{arrow('avg_rating')}</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.email || '—'}</td>
                    <td>{s.address || '—'}</td>
                    <td><RatingPill value={s.avg_rating} /></td>
                    <td>{s.owner_name}</td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr className="empty-row"><td colSpan="5">No stores found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoresList;
