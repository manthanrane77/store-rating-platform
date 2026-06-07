import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  NORMAL_USER: 'User',
  STORE_OWNER: 'Store Owner',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <nav>
      <Link to="/" className="nav-brand">
        <span className="nav-brand-icon">⭐</span>
        Store Rating
      </Link>
      <div className="nav-links">
        {user?.role === 'ADMIN' && (
          <>
            <NavLink to="/admin/dashboard" className={navClass}>Dashboard</NavLink>
            <NavLink to="/admin/users" className={navClass}>Users</NavLink>
            <NavLink to="/admin/stores" className={navClass}>Stores</NavLink>
          </>
        )}
        {user?.role === 'NORMAL_USER' && (
          <NavLink to="/stores" className={navClass}>Browse Stores</NavLink>
        )}
        {user?.role === 'STORE_OWNER' && (
          <NavLink to="/owner/dashboard" className={navClass}>My Store</NavLink>
        )}
        <NavLink to="/change-password" className={navClass}>Password</NavLink>
        <div className="nav-user">
          <div className="nav-avatar">{initials}</div>
          <div className="nav-user-info">
            <span className="nav-user-name">{user?.name}</span>
            <span className="nav-user-role">{ROLE_LABELS[user?.role]}</span>
          </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
