import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendFormEmail } from './email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'desifest-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, artist_signup_id: user.artist_signup_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function registerAuthRoutes(app, pool) {
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, role, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      if (!role || !['artist', 'client'].includes(role)) {
        return res.status(400).json({ error: 'Role must be "artist" or "client"' });
      }
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      let artistSignupId = null;

      if (role === 'artist') {
        const artistMatch = await pool.query(
          'SELECT id FROM artist_signups WHERE LOWER(email) = $1',
          [email.toLowerCase()]
        );
        if (artistMatch.rows.length > 0) {
          artistSignupId = artistMatch.rows[0].id;
        } else {
          const baseSlug = [firstName, lastName].filter(Boolean).join(' ').toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          let slug = baseSlug || `artist-${Date.now()}`;
          let suffix = 1;
          while (true) {
            const check = await pool.query('SELECT 1 FROM artist_signups WHERE slug = $1', [slug]);
            if (check.rows.length === 0) break;
            slug = `${baseSlug}-${suffix++}`;
          }
          const newArtist = await pool.query(
            `INSERT INTO artist_signups (first_name, last_name, email, slug, profile_approved, signup_source)
             VALUES ($1, $2, $3, $4, false, 'booking') RETURNING id`,
            [firstName || '', lastName || '', email.toLowerCase(), slug]
          );
          artistSignupId = newArtist.rows[0].id;
        }
      }

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, role, artist_signup_id, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, artist_signup_id, first_name, last_name, created_at`,
        [email.toLowerCase(), passwordHash, role, artistSignupId, firstName || null, lastName || null]
      );

      const user = result.rows[0];
      const token = generateToken(user);

      sendWelcomeEmail({ email: user.email, firstName: user.first_name, role: user.role });
      if (role === 'artist') {
        sendFormEmail('artist', { firstName: firstName || '', lastName: lastName || '', email: email.toLowerCase(), event: 'Account Signup' }).catch(() => {});
      }

      res.status(201).json({
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name, artist_signup_id: user.artist_signup_id }
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Failed to create account' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const result = await pool.query(
        'SELECT id, email, password_hash, role, artist_signup_id, first_name, last_name FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user);

      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name, artist_signup_id: user.artist_signup_id }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Failed to log in' });
    }
  });

  app.get('/api/auth/me', requireAuth, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, role, artist_signup_id, first_name, last_name, created_at FROM users WHERE id = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = result.rows[0];

      let artistProfile = null;
      if (user.role === 'artist' && user.artist_signup_id) {
        const artist = await pool.query(
          `SELECT slug, first_name, last_name, city, country, genre, other_genre, performance_language,
                  bio, instagram, spotify, youtube, website, facebook, tiktok, looking_for, available_for_gigs,
                  featured, alumni, profile_approved, starting_price, price_type, set_length,
                  technical_requirements, languages_performed, performance_types_offered, blocked_dates,
                  press_photo_data IS NOT NULL as has_photo
           FROM artist_signups WHERE id = $1`,
          [user.artist_signup_id]
        );
        if (artist.rows.length > 0) {
          artistProfile = artist.rows[0];
          artistProfile.photo_url = artistProfile.has_photo ? `/api/artists/${artistProfile.slug}/photo` : null;
          delete artistProfile.has_photo;
        }
      }

      res.json({
        id: user.id, email: user.email, role: user.role, firstName: user.first_name, lastName: user.last_name,
        artist_signup_id: user.artist_signup_id, artistProfile
      });
    } catch (err) {
      console.error('Me endpoint error:', err);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  });

  app.post('/api/auth/claim-profile', requireAuth, async (req, res) => {
    try {
      if (req.user.role !== 'artist') {
        return res.status(403).json({ error: 'Only artist accounts can claim profiles' });
      }
      const { artistSignupId } = req.body;
      if (!artistSignupId) {
        return res.status(400).json({ error: 'artistSignupId is required' });
      }

      const artist = await pool.query(
        'SELECT id, email FROM artist_signups WHERE id = $1',
        [artistSignupId]
      );
      if (artist.rows.length === 0) {
        return res.status(404).json({ error: 'Artist profile not found' });
      }

      if (artist.rows[0].email.toLowerCase() !== req.user.email.toLowerCase()) {
        return res.status(403).json({ error: 'You can only claim profiles matching your email' });
      }

      const alreadyClaimed = await pool.query(
        'SELECT id FROM users WHERE artist_signup_id = $1 AND id != $2',
        [artistSignupId, req.user.id]
      );
      if (alreadyClaimed.rows.length > 0) {
        return res.status(409).json({ error: 'This profile has already been claimed' });
      }

      await pool.query(
        'UPDATE users SET artist_signup_id = $1 WHERE id = $2',
        [artistSignupId, req.user.id]
      );

      res.json({ success: true, artist_signup_id: artistSignupId });
    } catch (err) {
      console.error('Claim profile error:', err);
      res.status(500).json({ error: 'Failed to claim profile' });
    }
  });
}
