const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

module.exports = function (db) {
  router.use(authenticate);

  router.get('/', (req, res) => {
    try {
      const items = db.prepare(`
        SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.image_url, p.slug
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
        ORDER BY ci.created_at DESC
      `).all(req.user.id);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', (req, res) => {
    try {
      const { product_id, quantity } = req.body;
      const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(req.user.id, product_id);
      if (existing) {
        db.prepare('UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(quantity || 1, existing.id);
        const updated = db.prepare('SELECT * FROM cart_items WHERE id = ?').get(existing.id);
        return res.json(updated);
      }
      const result = db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?) RETURNING *').get(req.user.id, product_id, quantity || 1);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
      res.json({ message: 'Item removed' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
