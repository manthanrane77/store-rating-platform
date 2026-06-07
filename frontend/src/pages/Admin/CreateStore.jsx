import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';
import API from '../../services/api';
import { validateName, validateEmail, validateAddress, validateForm } from '../../utils/validation';

const CreateStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/admin/users', { params: { role: 'STORE_OWNER' } })
      .then((res) => setOwners(res.data))
      .catch(() => setError('Failed to load store owners.'));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm({
      name: validateName(form.name),
      email: form.email ? validateEmail(form.email) : null,
      address: validateAddress(form.address),
    });
    if (validationError) return setError(validationError);
    if (!form.owner_id) return setError('Please select a store owner.');

    setLoading(true);
    try {
      await API.post('/admin/stores', {
        ...form,
        owner_id: Number(form.owner_id),
      });
      setSuccess('Store created successfully!');
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <PageHeader title="Create Store" subtitle="Register a new store on the platform" />
        <div className="form-page">
          <div className="form-card">
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Store name (20–60 characters)</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Store Owner</label>
                <select name="owner_id" value={form.owner_id} onChange={handleChange} required>
                  <option value="">Select owner...</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                  ))}
                </select>
                {owners.length === 0 && (
                  <Alert type="error">No store owners found. Create a Store Owner user first.</Alert>
                )}
              </div>
              <button type="submit" disabled={loading || owners.length === 0}>
                {loading ? 'Creating...' : 'Create Store'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateStore;
