const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = function (db) {
  router.post('/register', (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) return res.status(400).json({ error: 'Email already registered' });

      const hashed = bcrypt.hashSync(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) RETURNING id, name, email').get(name, email, hashed);

      const token = jwt.sign(
        { id: result.id, email: result.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.status(201).json({ user: { id: result.id, name: result.name, email: result.email } });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const match = bcrypt.compareSync(password, user.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  return router;
};
