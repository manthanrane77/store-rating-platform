import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import Alert from '../components/Alert';
import API from '../services/api';
import { validateName, validateEmail, validatePassword, validateAddress, validateForm } from '../utils/validation';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

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
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the platform and start rating stores"
      footer={
        <p className="link">Already have an account? <Link to="/login">Sign in</Link></p>
      }
    >
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full name (20–60 characters)</label>
          <input name="name" value={form.name} placeholder="Your full name"
            onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email address</label>
          <input name="email" type="email" value={form.email} placeholder="you@example.com"
            onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" value={form.password} placeholder="••••••••"
            onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
          <input name="address" value={form.address} placeholder="Your address"
            onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Register;
