const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');

module.exports = function (db) {
  router.use(authenticate, requireRole(db, 'admin'));

  router.get('/stats', (req, res) => {
    try {
      const stats = {
        users: db.prepare('SELECT COUNT(*) AS n FROM users').get().n,
        products: db.prepare('SELECT COUNT(*) AS n FROM products').get().n,
        requestsToday: db.prepare("SELECT COUNT(*) AS n FROM request_logs WHERE date(created_at) = date('now')").get().n,
        requestsTotal: db.prepare('SELECT COUNT(*) AS n FROM request_logs').get().n,
        adminUsers: db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get().n,
      };
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/logs', (req, res) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 100, 500);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      const logs = db.prepare(
        'SELECT * FROM request_logs ORDER BY id DESC LIMIT ? OFFSET ?'
      ).all(limit, offset);
      res.json({ logs, limit, offset });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/users', (req, res) => {
    try {
      const users = db.prepare(
        'SELECT id, name, email, role, provider, created_at FROM users ORDER BY id DESC LIMIT 200'
      ).all();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a user (admin only). Admins cannot delete themselves.
  router.delete('/users/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid user id' });
      }
      if (id === req.dbUser.id) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
      }
      const target = db.prepare('SELECT id, email FROM users WHERE id = ?').get(id);
      if (!target) return res.status(404).json({ error: 'User not found' });

      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(id);
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
      res.json({ message: `Deleted user ${target.email}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/products', (req, res) => {
    try {
      const products = db.prepare(
        'SELECT id, name, slug, price, stock, created_at FROM products ORDER BY created_at DESC LIMIT 200'
      ).all();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};