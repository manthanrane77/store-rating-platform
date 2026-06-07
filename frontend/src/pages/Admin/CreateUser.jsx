import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import API from '../../services/api';
import { validateName, validateEmail, validatePassword, validateAddress, validateForm } from '../../utils/validation';

const CreateUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validateForm({
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    });
    if (validationError) return setError(validationError);
    setLoading(true);
    try {
      await API.post('/admin/users', form);
      setSuccess('User created successfully!');
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader title="Create User" subtitle="Add a new admin, user, or store owner" />
        <div className="form-page">
          <div className="form-card">
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full name (20–60 characters)</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="NORMAL_USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUser;
