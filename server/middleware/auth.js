const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const bearer =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;
  const token = req.cookies.token || bearer;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function issueToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Role-Based Access Control - always reads the CURRENT role from the DB
function requireRole(db, ...roles) {
  return (req, res, next) => {
    const user = db
      .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
      .get(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.dbUser = user;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = { authenticate, issueToken, requireRole };