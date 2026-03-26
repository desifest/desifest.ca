import { requireAuth, requireRole } from './auth.js';

export function registerArtistProfileRoutes(app, pool) {
  app.patch('/api/artist/profile', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) {
        return res.status(400).json({ error: 'No artist profile linked to your account' });
      }

      const {
        bio, city, country, genre, other_genre, performance_language,
        instagram, spotify, youtube, website, facebook, tiktok,
        looking_for, available_for_gigs,
        starting_price, price_type, set_length,
        technical_requirements, languages_performed,
        performance_types_offered, blocked_dates,
        press_photo, banner_image
      } = req.body;

      const updates = [];
      const values = [];
      let idx = 1;

      const fields = {
        bio, city, country, genre, other_genre, performance_language,
        instagram, spotify, youtube, website, facebook, tiktok,
        starting_price, price_type, set_length, technical_requirements
      };

      for (const [key, val] of Object.entries(fields)) {
        if (val !== undefined) {
          updates.push(`${key} = $${idx++}`);
          values.push(val);
        }
      }

      if (available_for_gigs !== undefined) {
        updates.push(`available_for_gigs = $${idx++}`);
        values.push(available_for_gigs);
      }

      const jsonFields = { looking_for, languages_performed, performance_types_offered, blocked_dates };
      for (const [key, val] of Object.entries(jsonFields)) {
        if (val !== undefined) {
          updates.push(`${key} = $${idx++}`);
          values.push(JSON.stringify(val));
        }
      }

      if (press_photo && press_photo.startsWith('data:')) {
        const match = press_photo.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          updates.push(`press_photo_mime = $${idx++}`);
          values.push(match[1]);
          updates.push(`press_photo_data = $${idx++}`);
          values.push(match[2]);
        }
      }

      if (banner_image && banner_image.startsWith('data:')) {
        const match = banner_image.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          updates.push(`banner_image_mime = $${idx++}`);
          values.push(match[1]);
          updates.push(`banner_image_data = $${idx++}`);
          values.push(match[2]);
        }
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.user.artist_signup_id);
      const result = await pool.query(
        `UPDATE artist_signups SET ${updates.join(', ')} WHERE id = $${idx}
         RETURNING slug, first_name, last_name, city, country, genre, other_genre, performance_language,
                 bio, instagram, spotify, youtube, website, facebook, tiktok, looking_for, available_for_gigs,
                 featured, alumni, profile_approved, starting_price, price_type, set_length,
                 technical_requirements, languages_performed, performance_types_offered, blocked_dates,
                 press_photo_data IS NOT NULL as has_photo`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Artist profile not found' });
      }

      const profile = result.rows[0];
      profile.photo_url = profile.has_photo ? `/api/artists/${profile.slug}/photo` : null;
      delete profile.has_photo;

      res.json(profile);
    } catch (err) {
      console.error('Update artist profile error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  app.get('/api/artist/availability', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) {
        return res.status(400).json({ error: 'No artist profile linked to your account' });
      }

      const result = await pool.query(
        'SELECT available_for_gigs, blocked_dates FROM artist_signups WHERE id = $1',
        [req.user.artist_signup_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Artist profile not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Fetch availability error:', err);
      res.status(500).json({ error: 'Failed to fetch availability' });
    }
  });

  app.put('/api/artist/availability', requireAuth, requireRole('artist'), async (req, res) => {
    try {
      if (!req.user.artist_signup_id) {
        return res.status(400).json({ error: 'No artist profile linked to your account' });
      }

      const { available_for_gigs, blocked_dates } = req.body;
      const updates = [];
      const values = [];
      let idx = 1;

      if (available_for_gigs !== undefined) {
        updates.push(`available_for_gigs = $${idx++}`);
        values.push(available_for_gigs);
      }
      if (blocked_dates !== undefined) {
        updates.push(`blocked_dates = $${idx++}`);
        values.push(JSON.stringify(blocked_dates));
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(req.user.artist_signup_id);
      const result = await pool.query(
        `UPDATE artist_signups SET ${updates.join(', ')} WHERE id = $${idx}
         RETURNING available_for_gigs, blocked_dates`,
        values
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Update availability error:', err);
      res.status(500).json({ error: 'Failed to update availability' });
    }
  });
}
