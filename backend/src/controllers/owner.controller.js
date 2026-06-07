const pool = require('../config/db');

const getDashboard = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const [stores] = await pool.query(
      'SELECT id, name, avg_rating FROM stores WHERE owner_id = ?',
      [owner_id]
    );
    if (stores.length === 0)
      return res.status(404).json({ message: 'No store found for this owner.' });

    const store = stores[0];

    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.score, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({ store, raters });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getDashboard };