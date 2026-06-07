import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import StarRating from '../../components/StarRating';
import RatingPill from '../../components/RatingPill';
import API from '../../services/api';

const UserStoresList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [toast, setToast] = useState(null);

  const fetchStores = () => {
    API.get('/stores', { params: { ...filters, sortBy, order } })
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

  const showToast = (msg, isSuccess = true) => {
    setToast({ msg, isSuccess });
    setTimeout(() => setToast(null), 2500);
    if (isSuccess) fetchStores();
  };

  const handleRate = async (store, score) => {
    try {
      if (store.rating_id) {
        await API.patch(`/ratings/${store.rating_id}`, { score });
      } else {
        await API.post('/ratings', { store_id: store.id, score });
      }
      showToast('Rating saved successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save rating.', false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader
          title="Browse Stores"
          subtitle="Discover stores and share your rating"
        />
        <div className="table-wrap">
          <div className="filters">
            <input placeholder="🔍  Search by name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
            <input placeholder="🔍  Search by address"
              onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className={sortClass('name')} onClick={() => handleSort('name')}>Store{arrow('name')}</th>
                  <th className={sortClass('address')} onClick={() => handleSort('address')}>Address{arrow('address')}</th>
                  <th className={sortClass('avg_rating')} onClick={() => handleSort('avg_rating')}>Overall{arrow('avg_rating')}</th>
                  <th>Your Rating</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td><strong>{store.name}</strong></td>
                    <td>{store.address || '—'}</td>
                    <td><RatingPill value={store.avg_rating} /></td>
                    <td>
                      {store.user_rating
                        ? <RatingPill value={store.user_rating} />
                        : <span className="rating-none">Not rated yet</span>}
                    </td>
                    <td>
                      <StarRating
                        value={store.user_rating || 0}
                        onRate={(score) => handleRate(store, score)}
                      />
                    </td>
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
      {toast && (
        <div className={`toast ${toast.isSuccess ? 'toast--success' : ''}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
};

export default UserStoresList;
