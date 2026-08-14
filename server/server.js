require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cookieParser = require('cookie-parser');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { authenticate, requireRole } = require('./middleware/auth');

// ---------- Fail-fast config validation ----------
const REQUIRED_ENV = ['JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(
    `[config] Missing required environment variable(s): ${missing.join(', ')}. ` +
      `Set them in the Render dashboard (or .env for local dev) before starting.`
  );
  process.exit(1);
}
if ((process.env.JWT_SECRET || '').length < 32) {
  console.error(
    '[config] JWT_SECRET must be at least 32 characters. Generate a strong random value (e.g. openssl rand -hex 32).'
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the TLS-terminating proxy (Render) so req.secure / req.ip are correct
app.set('trust proxy', 1);

// ---------- Security headers (helmet) ----------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", 'https://cdnjs.cloudflare.com'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        'img-src': ["'self'", 'data:', 'https:'],
        'connect-src': ["'self'", 'https://bosera-backend.onrender.com'],
        'object-src': ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ---------- HTTPS everywhere ----------
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.get('host') + req.originalUrl);
  }
  next();
});

// ---------- Body parsing with size limits ----------
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ---------- Database ----------
const dbPath = path.join(__dirname, 'data', 'litebouyszone.db');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const migration = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial.sql'), 'utf8');
db.exec(migration);

// ---------- Security migrations (idempotent) ----------
function ensureColumn(table, column, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl};`);
  }
}
ensureColumn('users', 'role', 'role TEXT NOT NULL DEFAULT \'user\'');
ensureColumn('users', 'google_id', 'google_id TEXT');
ensureColumn('users', 'provider', 'provider TEXT NOT NULL DEFAULT \'local\'');
db.exec(`CREATE TABLE IF NOT EXISTS request_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  status INTEGER NOT NULL,
  ip TEXT,
  user_agent TEXT,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_request_logs_created ON request_logs(created_at);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);

// ---------- Auto-seed curated Bonkerscorner products if empty ----------
const productCount = db.prepare('SELECT COUNT(*) as n FROM products').get().n;
if (productCount < 18) {
  console.log(`[seed] Products count ${productCount} < 18 — seeding curated Bonkerscorner products...`);
  const curated = require('../curatedProducts.json');
  const catSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const categories = [...new Set(curated.map(p => p.category))].map(name => ({ name, slug: catSlug(name) }));

  const insertCat = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
  for (const c of categories) insertCat.run(c.name, c.slug);

  const catMap = {};
  for (const c of categories) {
    const row = db.prepare('SELECT id FROM categories WHERE slug = ?').get(c.slug);
    if (row) catMap[c.slug] = row.id;
  }

  const insertProduct = db.prepare('INSERT OR IGNORE INTO products (name, slug, price, image_url, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)');
  const insertMany = db.transaction(() => {
    for (const p of curated) {
      insertProduct.run(p.name, p.slug, p.price, p.image, catMap[catSlug(p.category)], 100);
    }
  });
  insertMany();
  console.log(`[seed] Seeded ${curated.length} curated Bonkerscorner products`);
}

// ---------- Seed admin user from env ----------
(function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!email) return;
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    db.prepare("UPDATE users SET role = 'admin', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(existing.id);
  } else if (process.env.ADMIN_PASSWORD) {
    db.prepare("INSERT INTO users (name, email, password_hash, role, provider) VALUES (?, ?, ?, 'admin', 'local')").run(
      'Admin',
      email,
      bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
    );
  }
  console.log('[admin] Admin user ensured for:', email);
})();

// ---------- Google OAuth (trusted authentication) ----------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = String(profile.id);
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value
              ? String(profile.emails[0].value).toLowerCase()
              : null;

          let user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(googleId);
          if (!user && email) {
            user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
          }
          if (!user) {
            const rnd = bcrypt.hashSync(crypto.randomBytes(24).toString('hex'), 10);
            const displayName = profile.displayName || (email ? email.split('@')[0] : 'Google User');
            const result = db
              .prepare("INSERT INTO users (name, email, password_hash, role, provider, google_id) VALUES (?, ?, ?, 'user', 'google', ?)")
              .run(displayName, email, rnd, googleId);
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
          } else if (!user.google_id) {
            db.prepare("UPDATE users SET google_id = ?, provider = 'google', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(googleId, user.id);
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('[auth] Google OAuth disabled - set GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET to enable');
}
app.use(passport.initialize());

// ---------- Rate limiting ----------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth')) return next(); // auth has its own stricter limiter
  apiLimiter(req, res, next);
});

// ---------- Request logging & monitoring ----------
app.use((req, res, next) => {
  res.on('finish', () => {
    try {
      const p = req.path;
      if (p === '/favicon.ico' || /^\/?(css|js|images|uploads)\//.test(p)) return;
      db.prepare(
        'INSERT INTO request_logs (method, path, status, ip, user_agent, user_id) VALUES (?, ?, ?, ?, ?, ?)'
      ).run(
        req.method,
        String(p).slice(0, 500),
        res.statusCode,
        req.ip || '',
        String(req.headers['user-agent'] || '').slice(0, 300),
        req.user ? req.user.id : null
      );
    } catch (e) {
      /* logging must never break a request */
    }
  });
  next();
});

// ---------- Views & static ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/mobile', express.static(path.join(__dirname, '..', 'mobile')));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Routes ----------
const authRoutes = require('./routes/auth')(db);
const productRoutes = require('./routes/products')(db);
const cartRoutes = require('./routes/cart')(db);
const adminRoutes = require('./routes/admin')(db);

app.use('/api/auth', authLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

app.get('/profile', authenticate, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).send('User not found');

    const cartItems = db.prepare(`
      SELECT ci.id, ci.quantity, ci.product_id, p.name, p.price, p.image_url, p.slug
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(req.user.id);

    app.render('profile', { user, cartItems }, (err, html) => {
      if (err) throw err;
      app.render('layout', { title: 'Profile', body: html }, (err2, fullHtml) => {
        if (err2) throw err2;
        res.send(fullHtml);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Admin dashboard page (Role-Based Access Control)
app.get('/admin', authenticate, requireRole(db, 'admin'), (req, res) => {
  try {
    const stats = {
      users: db.prepare('SELECT COUNT(*) AS n FROM users').get().n,
      adminUsers: db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get().n,
      products: db.prepare('SELECT COUNT(*) AS n FROM products').get().n,
      requestsToday: db.prepare("SELECT COUNT(*) AS n FROM request_logs WHERE date(created_at) = date('now')").get().n,
      requestsTotal: db.prepare('SELECT COUNT(*) AS n FROM request_logs').get().n,
    };
    const users = db.prepare('SELECT id, name, email, role, provider, created_at FROM users ORDER BY id DESC LIMIT 100').all();
    const products = db.prepare('SELECT id, name, slug, price, stock FROM products ORDER BY created_at DESC LIMIT 100').all();
    const logs = db.prepare('SELECT * FROM request_logs ORDER BY id DESC LIMIT 100').all();
    res.render('admin', { admin: req.dbUser, stats, users, products, logs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const ROOT_DIR = path.join(__dirname, '..');
const HTML_404 = path.join(ROOT_DIR, '404.html');

// Private paths that must never be served by the catch-all handler.
const BLOCKED_PREFIXES = [
  path.join(ROOT_DIR, 'server'),
  path.join(ROOT_DIR, 'backend'),
  path.join(ROOT_DIR, 'frontend'),
  path.join(ROOT_DIR, 'node_modules'),
  path.join(ROOT_DIR, 'data'),
  path.join(ROOT_DIR, '.git'),
];
const BLOCKED_FILES = new Set([
  'package.json',
  'package-lock.json',
  'render.yaml',
  '.env',
  '.env.example',
  'Dockerfile',
]);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/debug/products', (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as n FROM products').get().n;
  const sample = db.prepare('SELECT id, name, slug, price, image_url FROM products LIMIT 5').all();
  res.json({ count, sample });
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(ROOT_DIR, 'robots.txt'));
});

app.get('/.well-known/security.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(ROOT_DIR, 'security.txt'));
});

// JSON 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const MOBILE_DIR = path.join(ROOT_DIR, 'mobile');
const MOBILE_UA = /Mobile|Android|iPhone|iPad|iPod|IEMobile|BlackBerry|Opera Mini/i;

// Device detection: prefers an explicit ?mobile=1 / ?desktop=1 override, then a
// saved "view" cookie, then falls back to the User-Agent. Same URL serves both
// experiences (mobile pages live in /mobile, extensionless mapping preserved).
app.use((req, res, next) => {
  req.showMobile = undefined;

  if (req.query.mobile === '1' || req.query.mobile === 'true') req.showMobile = true;
  else if (req.query.desktop === '1' || req.query.desktop === 'true') req.showMobile = false;
  else if (req.cookies && req.cookies.view === 'mobile') req.showMobile = true;
  else if (req.cookies && req.cookies.view === 'desktop') req.showMobile = false;
  else req.showMobile = MOBILE_UA.test(req.headers['user-agent'] || '');

  if (req.query.mobile === '1' || req.query.mobile === 'true') {
    res.cookie('view', 'mobile', { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  } else if (req.query.desktop === '1' || req.query.desktop === 'true') {
    res.cookie('view', 'desktop', { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  next();
});

// Serve static HTML pages (extensionless + .html) with a styled 404 fallback.
// Only public HTML pages at the site root are served; private repo paths
// (server/, data/, .git/, node_modules/) and dotfiles are always denied.
app.get('*', (req, res) => {
  if (req.path === '/favicon.ico') return res.status(204).end();

  let p = req.path;
  if (p === '/' || p === '') p = '/index.html';
  else if (!p.includes('.')) p += '.html';

  const file = path.resolve(ROOT_DIR, '.' + p);

  // Only HTML pages are served by the catch-all. Anything else (md, json,
  // yaml, db, logs) is rejected outright.
  if (!p.toLowerCase().endsWith('.html')) return res.status(404).sendFile(HTML_404);

  const segments = p.split('/').filter(Boolean);
  const hasDotSegment = segments.some((s) => s.startsWith('.'));
  const isInside = file.startsWith(ROOT_DIR + path.sep);
  const isBlocked =
    BLOCKED_PREFIXES.some((b) => file.startsWith(b + path.sep)) ||
    BLOCKED_FILES.has(segments[segments.length - 1]) ||
    hasDotSegment;
  if (!isInside || isBlocked) return res.status(404).sendFile(HTML_404);

  // Mobile view: serve the parallel page from /mobile, e.g. /hoodies -> /mobile/hoodies.html.
  let htmlFile = file;
  if (req.showMobile) {
    const mobilePage = path.join(MOBILE_DIR, segments.join(path.sep));
    if (fs.existsSync(mobilePage) && fs.statSync(mobilePage).isFile() && mobilePage.endsWith('.html')) {
      htmlFile = mobilePage;
    }
  }

  if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    res.set('Vary', 'User-Agent');
    return res.sendFile(htmlFile);
  }

  // Mobile view: fall back to the mobile 404 page before the desktop one.
  if (req.showMobile) {
    const mobile404 = path.join(MOBILE_DIR, '404.html');
    if (fs.existsSync(mobile404) && fs.statSync(mobile404).isFile()) {
      res.status(404).set('Vary', 'User-Agent').sendFile(mobile404);
      return;
    }
  }
  res.status(404).sendFile(HTML_404);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});