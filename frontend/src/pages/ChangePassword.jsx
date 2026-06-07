import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Alert from '../components/Alert';
import API from '../services/api';
import { validatePassword } from '../utils/validation';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const pwdError = validatePassword(form.newPassword);
    if (pwdError) return setError(pwdError);
    if (form.newPassword !== form.confirmPassword)
      return setError('New passwords do not match.');

    setLoading(true);
    try {
      await API.patch('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader title="Change Password" subtitle="Update your account security" />
        <div className="form-page">
          <div className="form-card">
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input name="currentPassword" type="password" value={form.currentPassword}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input name="newPassword" type="password" value={form.newPassword}
                  placeholder="8–16 chars, 1 uppercase, 1 special"
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword}
                  onChange={handleChange} required />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
