const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { body } = require('express-validator');
const router = express.Router();
const { issueToken } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

function setAuthCookie(res, user) {
  res.cookie('token', issueToken(user), COOKIE_OPTS);
}

module.exports = function (db) {
  // ---- Register: validate + sanitize before storage ----
  router.post(
    '/register',
    body('name')
      .trim()
      .escape()
      .isLength({ min: 3, max: 60 })
      .withMessage('Name must be 3-60 characters'),
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password')
      .isLength({ min: 6, max: 128 })
      .withMessage('Password must be 6-128 characters'),
    handleValidation,
    (req, res) => {
      try {
        const name = req.body.name;
        const email = String(req.body.email).toLowerCase();
        const password = req.body.password;

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ error: 'Email already registered' });

        const hashed = bcrypt.hashSync(password, 10);
        const result = db
          .prepare('INSERT INTO users (name, email, password_hash, role, provider) VALUES (?, ?, ?, ?, ?)')
          .run(name, email, hashed, 'user', 'local');

        const user = db
          .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
          .get(result.lastInsertRowid);
        try {
          setAuthCookie(res, user);
        } catch (tokenErr) {
          db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
          return res.status(500).json({ error: 'Could not complete registration, please try again' });
        }
        res.status(201).json({ user });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );

  // ---- Login ----
  router.post(
    '/login',
    body('email').isEmail().normalizeEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidation,
    (req, res) => {
      try {
        const email = String(req.body.email).toLowerCase();
        const password = req.body.password;

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = bcrypt.compareSync(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
        setAuthCookie(res, safeUser);
        res.json({ user: safeUser });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  );

  router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
  });

  // ---- Google OAuth (enabled when GOOGLE_CLIENT_ID / SECRET are configured) ----
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
    router.get(
      '/google/callback',
      passport.authenticate('google', { session: false, failureRedirect: '/' }),
      (req, res) => {
        setAuthCookie(res, req.user);
        res.redirect('/');
      }
    );
  } else {
    router.get('/google', (req, res) =>
      res.status(501).json({ error: 'Google OAuth is not configured on this server' })
    );
  }

  return router;
};