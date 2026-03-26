import { requireAuth, requireRole } from './auth.js';

export function registerReviewRoutes(app, pool) {
  app.post('/api/reviews', requireAuth, requireRole('client'), async (req, res) => {
    try {
      const { booking_id, rating, review_text, event_type } = req.body;

      if (!booking_id || !rating) {
        return res.status(400).json({ error: 'booking_id and rating are required' });
      }
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      const booking = await pool.query(
        'SELECT * FROM bookings WHERE id = $1 AND client_user_id = $2',
        [booking_id, req.user.id]
      );
      if (booking.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found or you are not the client for this booking' });
      }
      if (booking.rows[0].status !== 'completed') {
        return res.status(400).json({ error: 'Can only review completed bookings' });
      }

      const existingReview = await pool.query(
        'SELECT id FROM reviews WHERE booking_id = $1',
        [booking_id]
      );
      if (existingReview.rows.length > 0) {
        return res.status(409).json({ error: 'A review already exists for this booking' });
      }

      const result = await pool.query(
        `INSERT INTO reviews (booking_id, client_user_id, artist_id, rating, review_text, event_type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [booking_id, req.user.id, booking.rows[0].artist_id, rating, review_text || null, event_type || booking.rows[0].event_type]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Create review error:', err);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  });

  app.get('/api/artists/:slug/reviews', async (req, res) => {
    try {
      const artist = await pool.query(
        'SELECT id FROM artist_signups WHERE slug = $1',
        [req.params.slug]
      );
      if (artist.rows.length === 0) {
        return res.status(404).json({ error: 'Artist not found' });
      }

      const result = await pool.query(
        `SELECT r.id, r.rating, r.review_text, r.event_type, r.created_at,
                u.first_name as reviewer_first_name, u.last_name as reviewer_last_name
         FROM reviews r
         JOIN users u ON r.client_user_id = u.id
         WHERE r.artist_id = $1 AND r.moderated = true
         ORDER BY r.created_at DESC`,
        [artist.rows[0].id]
      );

      const avgResult = await pool.query(
        'SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as review_count FROM reviews WHERE artist_id = $1 AND moderated = true',
        [artist.rows[0].id]
      );

      res.json({
        reviews: result.rows,
        avg_rating: parseFloat(avgResult.rows[0].avg_rating) || 0,
        review_count: parseInt(avgResult.rows[0].review_count) || 0,
      });
    } catch (err) {
      console.error('Fetch reviews error:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });
}
