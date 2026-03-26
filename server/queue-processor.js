export async function processNextInQueue(pool) {
  let client;
  try {
    client = await pool.connect();

    const todayET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })).toISOString().split('T')[0];
    const pending = await client.query(
      `SELECT * FROM blog_queue WHERE status = 'queued' AND scheduled_date <= $1 ORDER BY RANDOM() LIMIT 1`,
      [todayET]
    );

    if (pending.rows.length === 0) return null;

    const item = pending.rows[0];
    console.log(`[queue] Processing item #${item.id}: ${item.title}`);

    await client.query(`UPDATE blog_queue SET status = 'writing', updated_at = NOW() WHERE id = $1`, [item.id]);

    const ai = await import('./ai.js');

    let result;
    try {
      result = await ai.writeBlogPost(item.title, item.description || item.title);
    } catch (err) {
      await client.query(`UPDATE blog_queue SET status = 'failed', error = $1, updated_at = NOW() WHERE id = $2`, [`Write failed: ${err.message}`, item.id]);
      console.error(`[queue] Write failed for #${item.id}:`, err.message);
      return { id: item.id, status: 'failed', error: err.message };
    }

    let imageUrl = '';
    let imageData = null;
    let imageMime = null;
    try {
      const imagePrompt = await ai.generateImagePrompt(item.title, item.description || item.title);
      const OpenAI = (await import('openai')).default;
      const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const imageResponse = await openaiClient.images.generate({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      });
      const dalleUrl = imageResponse.data[0].url;

      const response = await fetch(dalleUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageData = buffer.toString('base64');
      imageMime = 'image/png';
    } catch (err) {
      console.error(`[queue] Image generation failed for #${item.id}:`, err.message);
    }

    const article = result.article || '';
    const seoTitle = result.seo_title || item.title;
    const metaDesc = result.meta_description || '';
    const primaryKeyword = result.primary_keyword || '';
    const secondaryKeywords = result.secondary_keywords || [];
    const suggestedLinks = result.suggested_links || [];
    const reelScript = result.reel_script || '';

    const allLines = article.split('\n').map(l => l.trim()).filter(Boolean);
    const title = seoTitle.length > 60 ? seoTitle.substring(0, 60) : seoTitle;
    const fullTitle = seoTitle;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const description = metaDesc || (allLines.length > 0 ? allLines[0] : '');

    const sections = [];
    for (let i = 0; i < allLines.length; i++) {
      const line = allLines[i];
      if (i === 0) {
        sections.push({ type: 'intro', text: line });
        continue;
      }
      const isAllCaps = line === line.toUpperCase() && line.length < 80 && line.length > 2 && /[A-Z]/.test(line);
      if (isAllCaps) {
        sections.push({ type: 'heading', text: line });
      } else if ((line.startsWith('"') || line.startsWith('\u201C')) && (line.endsWith('"') || line.endsWith('\u201D') || line.endsWith('."') || line.endsWith('.\u201D'))) {
        const text = line.replace(/^[\u201C"]+/, '').replace(/[\u201D"]+$/, '');
        let attr;
        if (i + 1 < allLines.length && /^\s*[-\u2014\u2013]\s*/.test(allLines[i + 1])) {
          i++;
          attr = allLines[i].replace(/^\s*[-\u2014\u2013]\s*/, '');
        }
        sections.push({ type: 'quote', text, ...(attr ? { attribution: attr } : {}) });
      } else {
        sections.push({ type: 'paragraph', text: line });
      }
    }

    const blogData = {
      slug,
      title,
      full_title: fullTitle,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: 'DESIFEST',
      category: 'Editorial',
      description,
      image_url: imageData ? '' : '',
      badge: '',
      meta: {
        seo_title: seoTitle,
        meta_description: metaDesc,
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        suggested_links: suggestedLinks,
        reel_script: reelScript,
        auto_generated: true,
        queue_id: item.id,
      },
      sections,
      social_links: {},
      published: true,
    };

    const insertResult = await client.query(
      `INSERT INTO blog_posts (slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, image_data, image_mime)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,
      [blogData.slug, blogData.title, blogData.full_title, blogData.date, blogData.author, blogData.category, blogData.description,
       imageData ? '' : '', blogData.badge, JSON.stringify(blogData.meta), JSON.stringify(blogData.sections),
       JSON.stringify(blogData.social_links), blogData.published, imageData, imageMime]
    );

    const blogPostId = insertResult.rows[0].id;

    if (imageData) {
      await client.query('UPDATE blog_posts SET image_url = $1 WHERE id = $2', [`/api/blog-image/${blogPostId}`, blogPostId]);
    }

    await client.query(
      `UPDATE blog_queue SET status = 'published', generated_content = $1, blog_post_id = $2, updated_at = NOW() WHERE id = $3`,
      [JSON.stringify(result), blogPostId, item.id]
    );

    console.log(`[queue] Published item #${item.id} as blog post #${blogPostId}`);

    try {
      const email = await import('./email.js');
      await email.sendBlogPublishedEmail({
        title: blogData.title,
        slug: blogData.slug,
        description: blogData.description,
        sections: blogData.sections,
        imageUrl: imageData ? `/api/blog-image/${blogPostId}` : null,
        reelScript,
      });
    } catch (emailErr) {
      console.error('[queue] Blog publish email failed:', emailErr.message);
    }

    return { id: item.id, status: 'published', blogPostId };

  } catch (err) {
    console.error('[queue] Processing error:', err.message);
    return { id: null, status: 'failed', error: err.message };
  } finally {
    client?.release();
  }
}

async function sendReviewPrompts(pool) {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const completedBookings = await pool.query(
      `SELECT b.id, b.artist_id, b.client_user_id, b.event_date,
              a.first_name as artist_first_name, a.last_name as artist_last_name,
              u.email as client_email
       FROM bookings b
       JOIN artist_signups a ON b.artist_id = a.id
       JOIN users u ON b.client_user_id = u.id
       LEFT JOIN reviews r ON r.booking_id = b.id
       WHERE b.status = 'confirmed' AND b.event_date <= $1 AND r.id IS NULL`,
      [yesterdayStr]
    );

    for (const booking of completedBookings.rows) {
      await pool.query("UPDATE bookings SET status = 'completed', updated_at = NOW() WHERE id = $1", [booking.id]);

      try {
        const email = await import('./email.js');
        await email.sendReviewPromptEmail({
          clientEmail: booking.client_email,
          artistName: `${booking.artist_first_name} ${booking.artist_last_name}`.trim(),
          bookingId: booking.id,
        });
      } catch (emailErr) {
        console.error(`[review-prompt] Email failed for booking #${booking.id}:`, emailErr.message);
      }
    }

    if (completedBookings.rows.length > 0) {
      console.log(`[review-prompt] Sent ${completedBookings.rows.length} review prompt(s)`);
    }
  } catch (err) {
    console.error('[review-prompt] Error:', err.message);
  }
}

export function startQueueScheduler(pool) {
  const CHECK_INTERVAL = 60 * 60 * 1000;

  async function check() {
    try {
      const todayET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })).toISOString().split('T')[0];
      const result = await pool.query(
        `SELECT COUNT(*) FROM blog_queue WHERE status = 'queued' AND scheduled_date <= $1`,
        [todayET]
      );
      const count = parseInt(result.rows[0].count);
      if (count > 0) {
        console.log(`[queue] Found ${count} item(s) due today, processing next...`);
        await processNextInQueue(pool);
      }

      await sendReviewPrompts(pool);
    } catch (err) {
      console.error('[queue] Scheduler check error:', err.message);
    }
  }

  check();
  setInterval(check, CHECK_INTERVAL);
  console.log('[queue] Scheduler started, checking every hour.');
}
