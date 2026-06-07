const pool = require('../config/db');

const submitRating = async (req, res) => {
  try {
    const { store_id, score } = req.body;
    const user_id = req.user.id;

    if (!score || score < 1 || score > 5)
      return res.status(400).json({ message: 'Score must be between 1 and 5.' });

    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [user_id, store_id]
    );
    if (existing.length > 0)
      return res.status(409).json({ message: 'Already rated. Use update instead.' });

    await pool.query(
      'INSERT INTO ratings (user_id, store_id, score) VALUES (?, ?, ?)',
      [user_id, store_id, score]
    );
    await updateAvgRating(store_id);

    res.status(201).json({ message: 'Rating submitted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const user_id = req.user.id;

    if (!score || score < 1 || score > 5)
      return res.status(400).json({ message: 'Score must be between 1 and 5.' });

    const [ratings] = await pool.query(
      'SELECT * FROM ratings WHERE id = ? AND user_id = ?',
      [id, user_id]
    );
    if (ratings.length === 0)
      return res.status(404).json({ message: 'Rating not found.' });

    await pool.query('UPDATE ratings SET score = ? WHERE id = ?', [score, id]);
    await updateAvgRating(ratings[0].store_id);

    res.json({ message: 'Rating updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

const updateAvgRating = async (store_id) => {
  const [[{ avg }]] = await pool.query(
    'SELECT AVG(score) as avg FROM ratings WHERE store_id = ?',
    [store_id]
  );
  await pool.query(
    'UPDATE stores SET avg_rating = ? WHERE id = ?',
    [parseFloat(avg || 0).toFixed(2), store_id]
  );
};

module.exports = { submitRating, updateRating };