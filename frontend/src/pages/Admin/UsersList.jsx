import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import RoleBadge from '../../components/RoleBadge';
import API from '../../services/api';

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');

  const fetchUsers = () => {
    const params = { ...filters, sortBy, order };
    if (!filters.role) params.roles = 'ADMIN,NORMAL_USER';
    API.get('/admin/users', { params })
      .then((res) => setUsers(res.data))
      .catch(console.error);
  };

  useEffect(() => { fetchUsers(); }, [filters, sortBy, order]);

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
          title="Users"
          subtitle="Manage admin and normal user accounts"
          actions={
            <Link to="/admin/create-user" className="btn-primary">+ Add User</Link>
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
            <select onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="NORMAL_USER">Normal User</option>
            </select>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th className={sortClass('name')} onClick={() => handleSort('name')}>Name{arrow('name')}</th>
                  <th className={sortClass('email')} onClick={() => handleSort('email')}>Email{arrow('email')}</th>
                  <th className={sortClass('address')} onClick={() => handleSort('address')}>Address{arrow('address')}</th>
                  <th className={sortClass('role')} onClick={() => handleSort('role')}>Role{arrow('role')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="clickable-row" onClick={() => navigate(`/admin/users/${u.id}`)}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.address || '—'}</td>
                    <td><RoleBadge role={u.role} /></td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr className="empty-row"><td colSpan="4">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersList;
