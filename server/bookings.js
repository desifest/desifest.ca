import { requireAuth, requireRole } from './auth.js';

export function registerBookingRoutes(app, pool, getEmail) {
  app.post('/api/bookings', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const {
        artist_id, event_date, event_type, audience_size,
        city, venue, budget_range, message
      } = req.body;

      if (!artist_id || !event_date || !event_type) {
        return res.status(400).json({ error: 'artist_id, event_date, and event_type are required' });
      }

      const artist = await pool.query(
        'SELECT id, first_name, last_name, email, blocked_dates FROM artist_signups WHERE id = $1',
        [artist_id]
      );
      if (artist.rows.length === 0) {
        return res.status(404).json({ error: 'Artist not found' });
      }

      const blockedDates = artist.rows[0].blocked_dates || [];
      if (blockedDates.includes(event_date)) {
        return res.status(400).json({ error: 'Artist is not available on this date' });
      }

      const result = await pool.query(
        `INSERT INTO bookings (artist_id, client_user_id, event_date, event_type, audience_size, city, venue, budget_range, message)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [artist_id, req.user.id, event_date, event_type, audience_size || null, city || null, venue || null, budget_range || null, message || null]
      );

      const booking = result.rows[0];

      try {
        const emailMod = await getEmail();
        await emailMod.sendBookingRequestEmail({
          booking,
          artistName: `${artist.rows[0].first_name} ${artist.rows[0].last_name}`.trim(),
          artistEmail: artist.rows[0].email,
          clientEmail: req.user.email,
        });
      } catch (emailErr) {
        console.error('Booking request email failed:', emailErr.message);
      }

      res.status(201).json(booking);
    } catch (err) {
      console.error('Create booking error:', err);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  });

  app.get('/api/bookings', requireAuth, async (req, res) => {
    try {
      let result;
      if (req.user.role === 'client') {
        result = await pool.query(
          `SELECT b.*, a.first_name as artist_first_name, a.last_name as artist_last_name, a.slug as artist_slug
           FROM bookings b
           JOIN artist_signups a ON b.artist_id = a.id
           WHERE b.client_user_id = $1
           ORDER BY b.created_at DESC`,
          [req.user.id]
        );
      } else if (req.user.role === 'artist' && req.user.artist_signup_id) {
        result = await pool.query(
          `SELECT b.*, u.email as client_email, u.first_name as client_first_name, u.last_name as client_last_name
           FROM bookings b
           JOIN users u ON b.client_user_id = u.id
           WHERE b.artist_id = $1
           ORDER BY b.created_at DESC`,
          [req.user.artist_signup_id]
        );
      } else {
        return res.json([]);
      }
      res.json(result.rows);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  app.get('/api/bookings/:id', requireAuth, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT b.*, a.first_name as artist_first_name, a.last_name as artist_last_name, a.slug as artist_slug,
                u.email as client_email, u.first_name as client_first_name, u.last_name as client_last_name
         FROM bookings b
         JOIN artist_signups a ON b.artist_id = a.id
         JOIN users u ON b.client_user_id = u.id
         WHERE b.id = $1`,
        [req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const booking = result.rows[0];
      const isClient = booking.client_user_id === req.user.id;
      const isArtist = req.user.artist_signup_id && booking.artist_id === req.user.artist_signup_id;
      if (!isClient && !isArtist) {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }

      res.json(booking);
    } catch (err) {
      console.error('Fetch booking error:', err);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  });

  app.patch('/api/bookings/:id/status', requireAuth, async (req, res) => {
    try {
      const { status, artist_response, counter_price, counter_date } = req.body;
      const validTransitions = {
        'pending': ['accepted', 'declined', 'counter'],
        'counter': ['confirmed', 'declined'],
        'accepted': ['confirmed'],
        'confirmed': ['completed'],
      };

      const booking = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
      if (booking.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const current = booking.rows[0];
      const isClient = current.client_user_id === req.user.id;
      const isArtist = req.user.artist_signup_id && current.artist_id === req.user.artist_signup_id;

      if (!isClient && !isArtist) {
        return res.status(403).json({ error: 'Not authorized to update this booking' });
      }

      const artistStatuses = ['accepted', 'declined', 'counter'];
      const clientStatuses = ['confirmed'];
      const eitherStatuses = ['completed'];

      if (artistStatuses.includes(status) && !isArtist) {
        return res.status(403).json({ error: 'Only the artist can set this status' });
      }
      if (clientStatuses.includes(status) && !isClient) {
        return res.status(403).json({ error: 'Only the client can confirm a booking' });
      }

      const allowed = validTransitions[current.status];
      if (!allowed || !allowed.includes(status)) {
        return res.status(400).json({ error: `Cannot transition from "${current.status}" to "${status}"` });
      }

      const updates = ['status = $1', 'updated_at = NOW()'];
      const values = [status];
      let idx = 2;

      if (artist_response !== undefined) {
        updates.push(`artist_response = $${idx++}`);
        values.push(artist_response);
      }
      if (status === 'counter') {
        if (counter_price !== undefined) {
          updates.push(`counter_price = $${idx++}`);
          values.push(counter_price);
        }
        if (counter_date !== undefined) {
          updates.push(`counter_date = $${idx++}`);
          values.push(counter_date);
        }
      }

      values.push(req.params.id);
      const result = await pool.query(
        `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );

      const updatedBooking = result.rows[0];

      try {
        const emailMod = await getEmail();
        const artistInfo = await pool.query('SELECT first_name, last_name, email FROM artist_signups WHERE id = $1', [current.artist_id]);
        const clientInfo = await pool.query('SELECT email, first_name, last_name FROM users WHERE id = $1', [current.client_user_id]);

        if (['accepted', 'declined', 'counter'].includes(status)) {
          await emailMod.sendBookingResponseEmail({
            booking: updatedBooking,
            artistName: `${artistInfo.rows[0].first_name} ${artistInfo.rows[0].last_name}`.trim(),
            clientEmail: clientInfo.rows[0].email,
            status,
          });
        } else if (status === 'confirmed') {
          await emailMod.sendBookingConfirmedEmail({
            booking: updatedBooking,
            artistName: `${artistInfo.rows[0].first_name} ${artistInfo.rows[0].last_name}`.trim(),
            artistEmail: artistInfo.rows[0].email,
            clientEmail: clientInfo.rows[0].email,
          });
        }
      } catch (emailErr) {
        console.error('Booking status email failed:', emailErr.message);
      }

      res.json(updatedBooking);
    } catch (err) {
      console.error('Update booking status error:', err);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  });
}
