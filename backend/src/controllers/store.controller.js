const pool = require('../config/db');

const listStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const userId = req.user.id;
    const allowed = ['name', 'address', 'avg_rating'];
    const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
    const sortDir = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
      SELECT s.id, s.name, s.address, s.avg_rating,
        r.id as rating_id, r.score as user_rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id AND r.user_id = ?
      WHERE 1=1`;
    const params = [userId];

    if (name) { query += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
    if (address) { query += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

    query += ` ORDER BY s.${sortCol} ${sortDir}`;

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { listStores };