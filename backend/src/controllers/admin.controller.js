const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_stores }]] = await pool.query('SELECT COUNT(*) as total_stores FROM stores');
    const [[{ total_ratings }]] = await pool.query('SELECT COUNT(*) as total_ratings FROM ratings');
    res.json({ total_users, total_stores, total_ratings });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ message: 'Name must be 20-60 characters.' });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email.' });

    if (!password || !/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password))
      return res.status(400).json({ message: 'Invalid password format.' });

    if (!['ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(role))
      return res.status(400).json({ message: 'Invalid role.' });

    if (address && address.length > 400)
      return res.status(400).json({ message: 'Address max 400 characters.' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already exists.' });

    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, address || null, role]
    );

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const { name, email, address, role, roles, sortBy = 'name', order = 'ASC' } = req.query;
    const allowed = ['name', 'email', 'address', 'role', 'created_at'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortDir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = 'SELECT id, name, email, address, role FROM users WHERE 1=1';
    const params = [];

    if (name) { query += ' AND name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND address LIKE ?'; params.push(`%${address}%`); }
    if (roles) {
      const roleList = roles.split(',').map((r) => r.trim()).filter(Boolean);
      if (roleList.length > 0) {
        query += ` AND role IN (${roleList.map(() => '?').join(',')})`;
        params.push(...roleList);
      }
    } else if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ` ORDER BY ${sortCol} ${sortDir}`;

    const [users] = await pool.query(query, params);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role,
        s.avg_rating as store_avg_rating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       WHERE u.id = ?`,
      [id]
    );
    if (users.length === 0)
      return res.status(404).json({ message: 'User not found.' });
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const listStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
    const allowed = ['name', 'email', 'address', 'avg_rating'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortDir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `SELECT s.id, s.name, s.email, s.address, s.avg_rating,
                  u.name as owner_name FROM stores s
                  LEFT JOIN users u ON u.id = s.owner_id WHERE 1=1`;
    const params = [];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (email) { query += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` ORDER BY s.${sortCol} ${sortDir}`;

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || name.length < 20 || name.length > 60)
      return res.status(400).json({ message: 'Store name must be 20-60 characters.' });

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email.' });

    if (address && address.length > 400)
      return res.status(400).json({ message: 'Address max 400 characters.' });

    const [owners] = await pool.query(
      'SELECT id FROM users WHERE id = ? AND role = ?',
      [owner_id, 'STORE_OWNER']
    );
    if (owners.length === 0)
      return res.status(400).json({ message: 'Owner must be a STORE_OWNER role user.' });

    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || null, owner_id]
    );

    res.status(201).json({ message: 'Store created successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getDashboardStats, createUser, listUsers, getUserDetail, listStores, createStore };