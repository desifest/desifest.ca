import { requireAuth, requireRole } from './auth.js';

export function setupDashboardRoutes(app, pool) {

  app.get('/api/dashboard/artist/profile', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) {
        return res.json({ id: req.user.id, email: req.user.email, first_name: '', last_name: '', bio: '', genre: '', pricing: '', set_length: '', tech_requirements: '', performance_types: [], languages: [], social_links: {} });
      }
      const result = await pool.query(
        `SELECT a.id as artist_signup_id, a.first_name, a.last_name, a.email, a.city, a.country,
                a.genre, a.other_genre, a.performance_language, a.bio,
                a.instagram, a.spotify, a.youtube, a.website, a.facebook, a.tiktok,
                a.looking_for, a.available_for_gigs, a.starting_price, a.price_type, a.set_length,
                a.technical_requirements, a.languages_performed, a.performance_types_offered,
                a.press_photo_data IS NOT NULL as has_photo, a.slug
         FROM artist_signups a WHERE a.id = $1`,
        [req.user.artist_signup_id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Artist profile not found' });
      const row = result.rows[0];
      res.json({
        id: req.user.id,
        email: req.user.email,
        first_name: row.first_name,
        last_name: row.last_name,
        bio: row.bio || '',
        genre: row.genre || '',
        press_photo_url: row.has_photo ? `/api/artists/${row.slug}/photo` : '',
        banner_image_url: '',
        pricing: row.starting_price ? `${row.starting_price} ${row.price_type || ''}`.trim() : '',
        set_length: row.set_length || '',
        tech_requirements: row.technical_requirements || '',
        performance_types: Array.isArray(row.performance_types_offered) ? row.performance_types_offered : [],
        languages: Array.isArray(row.languages_performed) ? row.languages_performed : [],
        social_links: {
          instagram: row.instagram || '', spotify: row.spotify || '', youtube: row.youtube || '',
          website: row.website || '', facebook: row.facebook || '', tiktok: row.tiktok || ''
        },
        city: row.city || '',
        country: row.country || '',
        slug: row.slug || '',
      });
    } catch (err) {
      console.error('[dashboard] Artist profile fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.put('/api/dashboard/artist/profile', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) {
        return res.status(400).json({ error: 'No artist profile linked to your account' });
      }
      const { bio, pricing, setLength, techRequirements, performanceTypes, languages, socialLinks, genre, pressPhoto } = req.body;
      const updates = [];
      const values = [];
      let idx = 1;

      if (bio !== undefined) { updates.push(`bio = $${idx++}`); values.push(bio); }
      if (genre !== undefined) { updates.push(`genre = $${idx++}`); values.push(genre); }
      if (pricing !== undefined) { updates.push(`starting_price = $${idx++}`); values.push(pricing); }
      if (setLength !== undefined) { updates.push(`set_length = $${idx++}`); values.push(setLength); }
      if (techRequirements !== undefined) { updates.push(`technical_requirements = $${idx++}`); values.push(techRequirements); }
      if (performanceTypes !== undefined) { updates.push(`performance_types_offered = $${idx++}`); values.push(JSON.stringify(performanceTypes)); }
      if (languages !== undefined) { updates.push(`languages_performed = $${idx++}`); values.push(JSON.stringify(languages)); }
      if (socialLinks) {
        const s = socialLinks;
        if (s.instagram !== undefined) { updates.push(`instagram = $${idx++}`); values.push(s.instagram); }
        if (s.spotify !== undefined) { updates.push(`spotify = $${idx++}`); values.push(s.spotify); }
        if (s.youtube !== undefined) { updates.push(`youtube = $${idx++}`); values.push(s.youtube); }
        if (s.website !== undefined) { updates.push(`website = $${idx++}`); values.push(s.website); }
        if (s.facebook !== undefined) { updates.push(`facebook = $${idx++}`); values.push(s.facebook); }
        if (s.tiktok !== undefined) { updates.push(`tiktok = $${idx++}`); values.push(s.tiktok); }
      }
      if (pressPhoto && pressPhoto.startsWith('data:')) {
        const match = pressPhoto.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          const base64Data = match[2];
          const sizeBytes = Math.ceil(base64Data.length * 3 / 4);
          if (sizeBytes > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'Photo must be under 5MB' });
          }
          updates.push(`press_photo_mime = $${idx++}`); values.push(match[1]);
          updates.push(`press_photo_data = $${idx++}`); values.push(base64Data);
        }
      }

      if (updates.length === 0) return res.json({ success: true });

      values.push(req.user.artist_signup_id);
      await pool.query(
        `UPDATE artist_signups SET ${updates.join(', ')} WHERE id = $${idx}`,
        values
      );
      res.json({ success: true, message: 'Profile updated' });
    } catch (err) {
      console.error('[dashboard] Artist profile update error:', err.message);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  app.get('/api/dashboard/artist/photo', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.status(404).json({ error: 'No photo' });
      const result = await pool.query(
        'SELECT press_photo_data, press_photo_mime FROM artist_signups WHERE id = $1',
        [req.user.artist_signup_id]
      );
      if (result.rows.length === 0 || !result.rows[0].press_photo_data) {
        return res.status(404).json({ error: 'No photo' });
      }
      const { press_photo_data, press_photo_mime } = result.rows[0];
      const buffer = Buffer.from(press_photo_data, 'base64');
      res.set('Content-Type', press_photo_mime || 'image/jpeg');
      res.set('Cache-Control', 'no-cache');
      res.send(buffer);
    } catch (err) {
      console.error('[dashboard] Photo fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch photo' });
    }
  });

  app.get('/api/dashboard/artist/media', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM artist_media WHERE user_id = $1 ORDER BY sort_order, created_at',
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('[dashboard] Artist media fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch media' });
    }
  });

  app.post('/api/dashboard/artist/media', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      const { mediaType, url, sortOrder } = req.body;
      if (!mediaType || !url) return res.status(400).json({ error: 'Media type and URL are required' });

      const counts = await pool.query(
        'SELECT media_type, COUNT(*) as cnt FROM artist_media WHERE user_id = $1 GROUP BY media_type',
        [req.user.id]
      );
      const countMap = {};
      counts.rows.forEach(r => { countMap[r.media_type] = parseInt(r.cnt); });

      if (mediaType === 'photo' && (countMap.photo || 0) >= 6) return res.status(400).json({ error: 'Maximum 6 photos allowed' });
      if (mediaType === 'video' && (countMap.video || 0) >= 3) return res.status(400).json({ error: 'Maximum 3 videos allowed' });
      if (mediaType === 'music' && (countMap.music || 0) >= 1) return res.status(400).json({ error: 'Maximum 1 music embed allowed' });

      const result = await pool.query(
        'INSERT INTO artist_media (user_id, media_type, url, sort_order) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, mediaType, url, sortOrder || 0]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[dashboard] Artist media add error:', err.message);
      res.status(500).json({ error: 'Failed to add media' });
    }
  });

  app.delete('/api/dashboard/artist/media/:id', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      const result = await pool.query(
        'DELETE FROM artist_media WHERE id = $1 AND user_id = $2 RETURNING id',
        [req.params.id, req.user.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ success: true });
    } catch (err) {
      console.error('[dashboard] Artist media delete error:', err.message);
      res.status(500).json({ error: 'Failed to delete media' });
    }
  });

  app.get('/api/dashboard/artist/availability', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.json([]);
      const result = await pool.query(
        'SELECT blocked_dates FROM artist_signups WHERE id = $1',
        [req.user.artist_signup_id]
      );
      const blockedDates = result.rows[0]?.blocked_dates || [];
      res.json(blockedDates.map(d => ({ blocked_date: d })));
    } catch (err) {
      console.error('[dashboard] Availability fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  });

  app.post('/api/dashboard/artist/availability', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.status(400).json({ error: 'No artist profile linked' });
      const { date } = req.body;
      if (!date) return res.status(400).json({ error: 'Date is required' });

      const result = await pool.query(
        'SELECT blocked_dates FROM artist_signups WHERE id = $1',
        [req.user.artist_signup_id]
      );
      let blockedDates = result.rows[0]?.blocked_dates || [];

      if (blockedDates.includes(date)) {
        blockedDates = blockedDates.filter(d => d !== date);
        await pool.query(
          'UPDATE artist_signups SET blocked_dates = $1 WHERE id = $2',
          [JSON.stringify(blockedDates), req.user.artist_signup_id]
        );
        return res.json({ action: 'unblocked', date });
      }

      blockedDates.push(date);
      await pool.query(
        'UPDATE artist_signups SET blocked_dates = $1 WHERE id = $2',
        [JSON.stringify(blockedDates), req.user.artist_signup_id]
      );
      res.json({ action: 'blocked', date });
    } catch (err) {
      console.error('[dashboard] Availability toggle error:', err.message);
      res.status(500).json({ error: 'Failed to toggle availability' });
    }
  });

  app.get('/api/dashboard/artist/bookings', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.json([]);
      const result = await pool.query(
        `SELECT b.*, u.first_name as client_first_name, u.last_name as client_last_name, u.email as client_email
         FROM bookings b JOIN users u ON b.client_user_id = u.id
         WHERE b.artist_id = $1 ORDER BY b.created_at DESC`,
        [req.user.artist_signup_id]
      );
      const bookings = result.rows.map(b => ({
        ...b,
        event_name: b.event_type || 'Booking Request',
        event_location: [b.venue, b.city].filter(Boolean).join(', '),
        event_description: b.message || '',
        price: b.budget_range || '0',
      }));
      res.json(bookings);
    } catch (err) {
      console.error('[dashboard] Artist bookings fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.patch('/api/dashboard/artist/bookings/:id', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.status(400).json({ error: 'No artist profile linked' });
      const { action, counterPrice, counterDate } = req.body;
      if (!['accept', 'decline', 'counter'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const booking = await pool.query('SELECT * FROM bookings WHERE id = $1 AND artist_id = $2', [req.params.id, req.user.artist_signup_id]);
      if (booking.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

      let status = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'counter';
      const updates = ['status = $1'];
      const values = [status];
      let idx = 2;

      if (action === 'counter') {
        if (counterPrice) { updates.push(`counter_price = $${idx++}`); values.push(counterPrice); }
        if (counterDate) { updates.push(`counter_date = $${idx++}`); values.push(counterDate); }
      }

      values.push(req.params.id);
      const result = await pool.query(
        `UPDATE bookings SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
        values
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('[dashboard] Booking update error:', err.message);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  app.get('/api/dashboard/artist/earnings', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) return res.json({ total_bookings: '0', gross_earnings: '0', net_earnings: '0.00', pending_bookings: '0' });
      const result = await pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'accepted' OR status = 'confirmed' OR status = 'completed') as total_bookings,
           COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings
         FROM bookings WHERE artist_id = $1`,
        [req.user.artist_signup_id]
      );
      const row = result.rows[0];
      res.json({ total_bookings: row.total_bookings || '0', gross_earnings: '0', net_earnings: '0.00', pending_bookings: row.pending_bookings || '0' });
    } catch (err) {
      console.error('[dashboard] Earnings fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch earnings' });
    }
  });

  app.get('/api/dashboard/client/bookings', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT b.*, a.first_name as artist_first_name, a.last_name as artist_last_name, a.email as artist_email
         FROM bookings b JOIN artist_signups a ON b.artist_id = a.id
         WHERE b.client_user_id = $1 ORDER BY b.created_at DESC`,
        [req.user.id]
      );
      const bookings = result.rows.map(b => ({
        ...b,
        event_name: b.event_type || 'Booking Request',
        event_location: [b.venue, b.city].filter(Boolean).join(', '),
        event_description: b.message || '',
        price: b.budget_range || '0',
      }));
      res.json(bookings);
    } catch (err) {
      console.error('[dashboard] Client bookings fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.post('/api/dashboard/client/bookings', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const { artistId, eventName, eventDate, eventLocation, eventDescription, price } = req.body;
      if (!artistId || !eventName || !eventDate) {
        return res.status(400).json({ error: 'Artist, event name, and date are required' });
      }

      const artist = await pool.query('SELECT id FROM artist_signups WHERE id = $1', [artistId]);
      if (artist.rows.length === 0) return res.status(404).json({ error: 'Artist not found' });

      const result = await pool.query(
        `INSERT INTO bookings (artist_id, client_user_id, event_date, event_type, city, venue, budget_range, message, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING *`,
        [artistId, req.user.id, eventDate, eventName, '', eventLocation || '', price ? String(price) : '', eventDescription || '']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[dashboard] Create booking error:', err.message);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  app.patch('/api/dashboard/client/bookings/:id', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const { action } = req.body;
      if (!['confirm', 'cancel'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const booking = await pool.query('SELECT * FROM bookings WHERE id = $1 AND client_user_id = $2', [req.params.id, req.user.id]);
      if (booking.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

      const status = action === 'confirm' ? 'confirmed' : 'cancelled';
      const result = await pool.query(
        'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, req.params.id]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error('[dashboard] Client booking update error:', err.message);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  app.get('/api/dashboard/client/reviews', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT r.*, a.first_name as artist_first_name, a.last_name as artist_last_name,
                b.event_type as event_name
         FROM reviews r
         JOIN bookings b ON r.booking_id = b.id
         JOIN artist_signups a ON r.artist_id = a.id
         WHERE r.client_user_id = $1 ORDER BY r.created_at DESC`,
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('[dashboard] Reviews fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/dashboard/client/reviews', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const { bookingId, rating, text } = req.body;
      if (!bookingId || !rating) return res.status(400).json({ error: 'Booking ID and rating are required' });
      if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

      const booking = await pool.query(
        "SELECT * FROM bookings WHERE id = $1 AND client_user_id = $2 AND status IN ('accepted', 'confirmed', 'completed')",
        [bookingId, req.user.id]
      );
      if (booking.rows.length === 0) return res.status(400).json({ error: 'Can only review completed bookings' });

      const existing = await pool.query('SELECT id FROM reviews WHERE booking_id = $1 AND client_user_id = $2', [bookingId, req.user.id]);
      if (existing.rows.length > 0) return res.status(409).json({ error: 'Review already submitted for this booking' });

      const result = await pool.query(
        'INSERT INTO reviews (booking_id, client_user_id, artist_id, rating, review_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [bookingId, req.user.id, booking.rows[0].artist_id, rating, text || '']
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('[dashboard] Review create error:', err.message);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  app.get('/api/dashboard/client/favourites', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT f.id as favourite_id, f.created_at as favourited_at,
                a.id as artist_id, a.first_name, a.last_name, a.email,
                a.bio, a.genre, a.slug,
                a.press_photo_data IS NOT NULL as has_photo
         FROM favourites f
         JOIN artist_signups a ON f.artist_id = a.id
         WHERE f.client_id = $1 ORDER BY f.created_at DESC`,
        [req.user.id]
      );
      const favourites = result.rows.map(f => ({
        ...f,
        press_photo_url: f.has_photo ? `/api/artists/${f.slug}/photo` : '',
      }));
      res.json(favourites);
    } catch (err) {
      console.error('[dashboard] Favourites fetch error:', err.message);
      res.status(500).json({ error: 'Failed to fetch favourites' });
    }
  });

  app.post('/api/dashboard/client/favourites', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const { artistId } = req.body;
      if (!artistId) return res.status(400).json({ error: 'Artist ID is required' });

      const existing = await pool.query(
        'SELECT id FROM favourites WHERE client_id = $1 AND artist_id = $2',
        [req.user.id, artistId]
      );
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM favourites WHERE id = $1', [existing.rows[0].id]);
        return res.json({ action: 'removed' });
      }

      await pool.query(
        'INSERT INTO favourites (client_id, artist_id) VALUES ($1, $2)',
        [req.user.id, artistId]
      );
      res.json({ action: 'added' });
    } catch (err) {
      console.error('[dashboard] Favourite toggle error:', err.message);
      res.status(500).json({ error: 'Failed to toggle favourite' });
    }
  });

  app.get('/api/artists/list', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, first_name, last_name, bio, genre, slug,
                starting_price as pricing,
                press_photo_data IS NOT NULL as has_photo
         FROM artist_signups
         WHERE profile_approved = true
         ORDER BY first_name`
      );
      const artists = result.rows.map(a => ({
        ...a,
        press_photo_url: a.has_photo ? `/api/artists/${a.slug}/photo` : '',
      }));
      res.json(artists);
    } catch (err) {
      console.error('[dashboard] Artists list error:', err.message);
      res.status(500).json({ error: 'Failed to fetch artists' });
    }
  });
}
