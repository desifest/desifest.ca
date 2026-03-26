import express from 'express';
import cors from 'cors';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import { registerAuthRoutes } from './auth.js';
import { registerBookingRoutes } from './bookings.js';
import { registerReviewRoutes } from './reviews.js';
import { registerArtistProfileRoutes } from './artist-profile.js';
import { setupDashboardRoutes } from './dashboard.js';
import { SITE_URL, ROUTE_META, injectMeta, getStaticMeta } from './seo-meta.js';
let _seedData = null;
function getSeedData() {
  if (!_seedData) _seedData = import('./seed-data.js');
  return _seedData;
}
let _email = null;
function getEmail() {
  if (!_email) _email = import('./email.js');
  return _email;
}
let _ai = null;
function getAI() {
  if (!_ai) _ai = import('./ai.js');
  return _ai;
}
let _queueProcessor = null;
function getQueueProcessor() {
  if (!_queueProcessor) _queueProcessor = import('./queue-processor.js');
  return _queueProcessor;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isTitleCaseHeading(line) {
  if (!line || line.length <= 2 || line.length >= 60) return false;
  if (/[.!?;,:]$/.test(line)) return false;
  if (!/^[A-Z]/.test(line)) return false;
  const words = line.split(/\s+/);
  if (words.length < 2 || words.length > 8) return false;
  const smallWords = ['a','an','and','as','at','but','by','for','in','is','it','of','on','or','the','to','with'];
  const capWords = words.filter(w => /^[A-Z]/.test(w) || /^\d+$/.test(w));
  if (capWords.length < 2) return false;
  return words.every(w => /^[A-Z]/.test(w) || /^\d+$/.test(w) || smallWords.includes(w.toLowerCase()));
}

function serverParseSections(sections) {
  const newSections = [];
  for (const section of sections) {
    if (section.type !== 'paragraph') {
      newSections.push(section);
      continue;
    }
    const line = section.text;
    const isAllCaps = line === line.toUpperCase() && line.length < 80 && line.length > 2 && /[A-Z]/.test(line);
    if (isAllCaps || isTitleCaseHeading(line)) {
      newSections.push({ type: 'heading', text: line });
    } else {
      newSections.push(section);
    }
  }
  return newSections;
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const { Pool } = pg;

const dbUrl = process.env.DATABASE_URL || '';
const needsSsl = dbUrl.includes('neon') || dbUrl.includes('supabase') || dbUrl.includes('amazonaws') || process.env.PGSSLMODE === 'require';
const pool = new Pool({
  connectionString: dbUrl,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err.message);
});

async function runDataMigrations(client) {
  await client.query(`CREATE TABLE IF NOT EXISTS migrations (key VARCHAR(100) PRIMARY KEY, applied_at TIMESTAMP DEFAULT NOW())`);

  const staleFieldFixes = [
    { slug: 'concerts', key: 'hero_subtitle', oldVal: 'LIVE MUSIC. SHARED ENERGY. REAL CONNECTION', newVal: 'LIVE MUSIC. SHARED ENERGY. REAL CONNECTION.' },
    { slug: 'concerts', key: 'day1_title', oldVal: 'EVENING SHOWCASE', newVal: 'MULTICULTURAL MUSIC CELEBRATION' },
    { slug: 'concerts', key: 'day1_description', oldVal: '19+ International artist for a ticketed event', newVal: 'A free public event highlighting artists shaped by South Asian roots and global influence. Expect high-energy performances, cross-genre collaborations, and a crowd that reflects the diversity of Toronto itself.' },
  ];

  const migKey = 'fix_stale_concerts_copy_v1';
  const already = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey]);
  if (already.rows.length === 0) {
    let fixed = 0;
    for (const fix of staleFieldFixes) {
      const r = await client.query(
        'UPDATE page_content SET content_value = $1, updated_at = NOW() WHERE page_slug = $2 AND section_key = $3 AND content_value = $4',
        [fix.newVal, fix.slug, fix.key, fix.oldVal]
      );
      if (r.rowCount > 0) {
        console.log(`[migration] Fixed ${fix.slug}.${fix.key}`);
        fixed++;
      }
    }
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey]);
    console.log(`[migration] ${migKey}: ${fixed} fields corrected.`);
  }

  const migKey2 = 'fix_concerts_btn_labels_v1';
  const already2 = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey2]);
  if (already2.rows.length === 0) {
    let fixed2 = 0;
    const btnFixes = [
      { slug: 'concerts', key: 'volunteer_btn', oldVal: 'VOLUNTEER', newVal: 'VOLUNTEER SIGN UP' },
    ];
    for (const fix of btnFixes) {
      const r = await client.query(
        'UPDATE page_content SET content_value = $1, updated_at = NOW() WHERE page_slug = $2 AND section_key = $3 AND content_value = $4',
        [fix.newVal, fix.slug, fix.key, fix.oldVal]
      );
      if (r.rowCount > 0) {
        console.log(`[migration] Fixed ${fix.slug}.${fix.key}`);
        fixed2++;
      }
    }
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey2]);
    console.log(`[migration] ${migKey2}: ${fixed2} fields corrected.`);
  }

  const migKey3 = 'fix_video_urls_youtube_v2';
  const already3 = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey3]);
  if (already3.rows.length === 0) {
    let fixed3 = 0;
    const videoFixes = [
      { slug: 'home', key: 'animation_video_url', newVal: 'czf4UcWwEio' },
      { slug: 'sponsorship', key: 'video1_url', newVal: 'CPhw-lFpLsE' },
    ];
    for (const fix of videoFixes) {
      const r = await client.query(
        `UPDATE page_content SET content_value = $1, updated_at = NOW() WHERE page_slug = $2 AND section_key = $3 AND content_value NOT LIKE 'http%' AND content_value NOT LIKE $1`,
        [fix.newVal, fix.slug, fix.key]
      );
      if (r.rowCount > 0) {
        console.log(`[migration] Fixed ${fix.slug}.${fix.key} -> ${fix.newVal}`);
        fixed3++;
      }
    }
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey3]);
    console.log(`[migration] ${migKey3}: ${fixed3} video URLs updated to YouTube IDs.`);
  }

  const migKey4 = 'fix_day2_description_v1';
  const already4 = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey4]);
  if (already4.rows.length === 0) {
    const newDesc = '12 hours of free, family-friendly music and dance \u2014 showcasing Canadian and international artists performing everything from Bollywood favourites and Punjabi bangers to Hip Hop, Dance, and Pop.';
    const r = await client.query(
      'UPDATE page_content SET content_value = $1, updated_at = NOW() WHERE page_slug = $2 AND section_key = $3',
      [newDesc, 'concerts', 'day2_description']
    );
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey4]);
    console.log(`[migration] ${migKey4}: day2_description updated (${r.rowCount} rows).`);
  }

  const migKey5 = 'refresh_openmic_featured_images_v1';
  const already5 = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey5]);
  if (already5.rows.length === 0) {
    const r = await client.query(
      "DELETE FROM page_content WHERE page_slug = 'openmic' AND section_key LIKE 'featured_img%'"
    );
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey5]);
    console.log(`[migration] ${migKey5}: cleared ${r.rowCount} old featured artist images to use updated code defaults.`);
  }

  const migKey6 = 'three_day_festival_content_v1';
  const already6 = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey6]);
  if (already6.rows.length === 0) {
    await client.query("UPDATE page_content SET content_value = 'June 18 – 20', updated_at = NOW() WHERE page_slug = 'home' AND section_key = 'hero_date'");
    await client.query("UPDATE page_content SET content_value = 'DAY 02', updated_at = NOW() WHERE page_slug = 'concerts' AND section_key = 'day1_label'");
    await client.query("UPDATE page_content SET content_value = 'DAY 03', updated_at = NOW() WHERE page_slug = 'concerts' AND section_key = 'day2_label'");
    await client.query(`UPDATE page_content SET content_value = E'THREE DAYS.\nONE COMMUNITY.\nCOUNTLESS MOMENTS.', updated_at = NOW() WHERE page_slug = 'concerts' AND section_key = 'hero_taglines'`);
    await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey6]);
    console.log('[migration] three_day_festival_content_v1: updated hero_date, day labels, and taglines for 3-day festival.');
  }
}

async function backfillPageImages(client) {
  const migKey = 'backfill_page_images_v1';
  const already = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey]);
  if (already.rows.length > 0) return;

  const rows = await client.query(
    "SELECT id, page_slug, section_key, content_value FROM page_content WHERE content_type = 'image' AND content_value LIKE '/uploads/%' AND (image_data IS NULL OR image_data = '')"
  );
  let backfilled = 0;
  for (const row of rows.rows) {
    const filePath = path.join(__dirname, '..', row.content_value);
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath);
        const base64 = fileData.toString('base64');
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
        const mime = mimeMap[ext] || 'image/png';
        const apiUrl = `/api/page-image/${row.page_slug}/${row.section_key}`;
        await client.query(
          'UPDATE page_content SET image_data = $1, image_mime = $2, content_value = $3, updated_at = NOW() WHERE id = $4',
          [base64, mime, apiUrl, row.id]
        );
        backfilled++;
        console.log(`[backfill] Stored ${row.page_slug}.${row.section_key} in DB`);
      } catch (e) {
        console.error(`[backfill] Failed to read ${row.content_value}:`, e.message);
      }
    } else {
      console.warn(`[backfill] File not found: ${row.content_value} for ${row.page_slug}.${row.section_key}`);
    }
  }
  await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey]);
  console.log(`[backfill] ${migKey}: ${backfilled}/${rows.rows.length} images stored in DB.`);
}

async function refreshFeaturedImages(client) {
  const migKey = 'refresh_featured_images_v2';
  const already = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migKey]);
  if (already.rows.length > 0) return;

  let refreshed = 0;
  for (let i = 1; i <= 16; i++) {
    const filePath = path.join(__dirname, '..', 'uploads', 'openmic', `featured${i}.png`);
    if (!fs.existsSync(filePath)) continue;
    try {
      const fileData = fs.readFileSync(filePath);
      const base64 = fileData.toString('base64');
      const sectionKey = `featured_img${i}`;
      const apiUrl = `/api/page-image/openmic/${sectionKey}`;
      const result = await client.query(
        `UPDATE page_content SET image_data = $1, image_mime = 'image/png', content_value = $2, updated_at = NOW()
         WHERE page_slug = 'openmic' AND section_key = $3`,
        [base64, apiUrl, sectionKey]
      );
      if (result.rowCount > 0) {
        refreshed++;
        console.log(`[migration] Refreshed openmic.${sectionKey}`);
      }
    } catch (e) {
      console.error(`[migration] Failed to refresh featured${i}.png:`, e.message);
    }
  }
  await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migKey]);
  console.log(`[migration] ${migKey}: ${refreshed} featured images refreshed.`);
}

async function seedIfEmpty() {
  let client;
  try {
    client = await pool.connect();
    console.log('[startup] Database connected, checking seed data...');

    await client.query('ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_data TEXT');
    await client.query('ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS image_mime VARCHAR(50)');
    await client.query('ALTER TABLE page_content ADD COLUMN IF NOT EXISTS image_data TEXT');
    await client.query('ALTER TABLE page_content ADD COLUMN IF NOT EXISTS image_mime VARCHAR(50)');
    await client.query('ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS phone_code VARCHAR(10)');
    await client.query('ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(30)');

    await runDataMigrations(client);

    await backfillPageImages(client);
    await refreshFeaturedImages(client);

    let inTransaction = false;

    const { pageContentData, blogPostsData } = await getSeedData();
    const pcCount = await client.query('SELECT COUNT(*) FROM page_content');
    if (parseInt(pcCount.rows[0].count) === 0) {
      console.log('[startup] Seeding page_content...');
      await client.query('BEGIN');
      inTransaction = true;
      for (const [pageSlug, sectionKey, contentType, contentValue, label] of pageContentData) {
        await client.query(
          `INSERT INTO page_content (page_slug, section_key, content_type, content_value, label)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (page_slug, section_key) DO NOTHING`,
          [pageSlug, sectionKey, contentType, contentValue, label]
        );
      }
      await client.query('COMMIT');
      inTransaction = false;
      console.log(`[startup] Seeded ${pageContentData.length} page content entries.`);
    } else {
      let inserted = 0;
      for (const [pageSlug, sectionKey, contentType, contentValue, label] of pageContentData) {
        const res = await client.query(
          `INSERT INTO page_content (page_slug, section_key, content_type, content_value, label)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (page_slug, section_key) DO NOTHING`,
          [pageSlug, sectionKey, contentType, contentValue, label]
        );
        if (res.rowCount > 0) inserted++;
      }
      if (inserted > 0) console.log(`[startup] Inserted ${inserted} new page content fields.`);
    }

    await client.query(`
      UPDATE blog_posts SET image_url = '/uploads/media/blog-cover-1.png' WHERE image_url = '/src/Assets/home/Media/image1.png';
      UPDATE blog_posts SET image_url = '/uploads/media/blog-cover-2.png' WHERE image_url = '/src/Assets/home/Media/image2.png';
      UPDATE blog_posts SET image_url = '/uploads/media/blog-cover-3.png' WHERE image_url = '/src/Assets/home/Media/image3.png';
    `);

    const post4 = await client.query("SELECT id, sections::text, image_url FROM blog_posts WHERE slug = 'three-more-years-one-shared-commitment-to-culture'");
    if (post4.rows.length > 0) {
      const raw = post4.rows[0].sections;
      const imgUrl = post4.rows[0].image_url;
      if (imgUrl && !imgUrl.startsWith('/uploads/media/')) {
        await client.query("UPDATE blog_posts SET image_url = '/uploads/media/blog-cover-4.png' WHERE id = $1", [post4.rows[0].id]);
      }
      const needsFix = raw && !raw.includes('"heading"') && !raw.includes('"list"');
      if (needsFix) {
        const fixedSections = [
          {"type":"intro","text":"There are moments in a festival\u0027s journey that feel bigger than programming."},
          {"type":"paragraph","text":"Today is one of them."},
          {"type":"paragraph","text":"As DESIFEST enters its 20th year, we are proud to announce a renewed three year partnership with TD Bank, extending their continued support of our platform and the South Asian creative community across Canada."},
          {"type":"paragraph","text":"For two decades, DESIFEST has been built on belief. Belief that South Asian artists deserve major stages. Belief that families deserve spaces where heritage and identity are celebrated openly. Belief that culture is not a niche audience. It is infrastructure."},
          {"type":"paragraph","text":"Partnerships like this do not happen overnight. They are earned over time through consistency, credibility, and community trust."},
          {"type":"paragraph","text":"TD has been part of our journey not just as a logo on a stage, but as a partner who understands that culture drives connection, belonging, and long term brand equity."},
          {"type":"heading","text":"WHY THIS MATTERS"},
          {"type":"paragraph","text":"Arts and culture platforms often operate in a delicate ecosystem. Government funding looks for private sector validation. Corporate sponsors look for measurable impact. Meanwhile, communities look for places to gather and see themselves reflected."},
          {"type":"paragraph","text":"A multi year commitment sends a different message."},
          {"type":"paragraph","text":"It says culture is not a one year experiment."},
          {"type":"paragraph","text":"It says community building requires continuity."},
          {"type":"paragraph","text":"It says long term investment creates long term impact."},
          {"type":"paragraph","text":"Over the next three years, this partnership will support:"},
          {"type":"list","items":["Canadian South Asian artists performing on a national stage","Multi generational programming in the heart of downtown Toronto","Opportunities for students, newcomers, and families to connect through music","Experiential engagement that reflects the diversity of our city"]},
          {"type":"paragraph","text":"TD\u0027s continued support reinforces that DESIFEST is not just an event. It is part of Toronto\u0027s cultural fabric."},
          {"type":"heading","text":"TWENTY YEARS STRONG"},
          {"type":"paragraph","text":"In 2026, DESIFEST celebrates 20 years at Sankofa Square. From our earliest stages to welcoming over 100,000 attendees annually, we have grown alongside the community we serve."},
          {"type":"paragraph","text":"The South Asian population in Canada continues to expand in influence, entrepreneurship, education, and cultural leadership. Platforms like DESIFEST create the spaces where that identity is expressed publicly and proudly."},
          {"type":"paragraph","text":"To have a partner like TD stand with us for another three years affirms the value of that work."},
          {"type":"heading","text":"GRATITUDE AND RESPONSIBILITY"},
          {"type":"paragraph","text":"We are grateful for the trust."},
          {"type":"paragraph","text":"And we take it seriously."},
          {"type":"paragraph","text":"This renewed partnership allows us to think bigger, plan further ahead, and deepen the experiences we create for artists, families, and audiences."},
          {"type":"paragraph","text":"Culture survives because people show up."},
          {"type":"paragraph","text":"Culture thrives because partners invest."},
          {"type":"paragraph","text":"To TD Bank, thank you for believing in the stage, the artists, and the community."},
          {"type":"paragraph","text":"We look forward to building the next chapter together."}
        ];
        await client.query(
          'UPDATE blog_posts SET sections = $1::jsonb WHERE id = $2',
          [JSON.stringify(fixedSections), post4.rows[0].id]
        );
      }
    }

    const blogCount = await client.query('SELECT COUNT(*) FROM blog_posts');
    if (parseInt(blogCount.rows[0].count) === 0) {
      console.log('[startup] Seeding blog_posts...');
      await client.query('BEGIN');
      inTransaction = true;
      for (const blog of blogPostsData) {
        await client.query(
          `INSERT INTO blog_posts (slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
           ON CONFLICT (slug) DO NOTHING`,
          [blog.slug, blog.title, blog.full_title, blog.date, blog.author, blog.category, blog.description, blog.image_url, blog.badge, JSON.stringify(blog.meta), JSON.stringify(blog.sections), JSON.stringify(blog.social_links), blog.published]
        );
      }
      await client.query('COMMIT');
      inTransaction = false;
      console.log(`[startup] Seeded ${blogPostsData.length} blog posts.`);
    } else {
      for (const blog of blogPostsData) {
        await client.query(
          `INSERT INTO blog_posts (slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
           ON CONFLICT (slug) DO NOTHING`,
          [blog.slug, blog.title, blog.full_title, blog.date, blog.author, blog.category, blog.description, blog.image_url, blog.badge, JSON.stringify(blog.meta), JSON.stringify(blog.sections), JSON.stringify(blog.social_links), blog.published]
        );
      }
    }

    const allPosts = await client.query('SELECT id, slug, sections FROM blog_posts');
    let reparsedCount = 0;
    for (const post of allPosts.rows) {
      if (!Array.isArray(post.sections)) continue;
      const reparsed = serverParseSections(post.sections);
      const changed = JSON.stringify(reparsed) !== JSON.stringify(post.sections);
      if (changed) {
        await client.query('UPDATE blog_posts SET sections = $1::jsonb WHERE id = $2', [JSON.stringify(reparsed), post.id]);
        reparsedCount++;
      }
    }
    if (reparsedCount > 0) console.log(`[startup] Re-parsed ${reparsedCount} blog posts with improved heading detection.`);

    const postsNeedingImages = await client.query("SELECT id, image_url FROM blog_posts WHERE image_data IS NULL AND image_url IS NOT NULL");
    let seededImages = 0;
    for (const post of postsNeedingImages.rows) {
      const imgUrl = post.image_url;
      if (!imgUrl) continue;
      let filePath;
      if (imgUrl.startsWith('/uploads/')) {
        filePath = path.join(__dirname, '..', 'public', imgUrl);
        if (!fs.existsSync(filePath)) {
          filePath = path.join(__dirname, '..', 'dist', imgUrl);
        }
      }
      if (filePath && fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath);
        const base64 = fileData.toString('base64');
        const ext = path.extname(filePath).toLowerCase();
        const mimeMap = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
        const mime = mimeMap[ext] || 'image/png';
        await client.query('UPDATE blog_posts SET image_data = $1, image_mime = $2, image_url = $3 WHERE id = $4',
          [base64, mime, `/api/blog-image/${post.id}`, post.id]);
        seededImages++;
      }
    }
    if (seededImages > 0) console.log(`[startup] Seeded ${seededImages} blog images into database.`);

    const migShortlist = 'add_artist_shortlisted_v1';
    const alreadyShortlist = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migShortlist]);
    if (alreadyShortlist.rows.length === 0) {
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS shortlisted BOOLEAN DEFAULT FALSE');
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migShortlist]);
      console.log('[migration] Added shortlisted column to artist_signups');
    }

    const migArtistProfiles = 'add_artist_profile_fields_v1';
    const alreadyProfiles = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migArtistProfiles]);
    if (alreadyProfiles.rows.length === 0) {
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS profile_approved BOOLEAN DEFAULT FALSE');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS alumni BOOLEAN DEFAULT FALSE');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS bio TEXT');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS press_photo_data TEXT');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS press_photo_mime VARCHAR(50)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS looking_for JSONB DEFAULT \'[]\'::jsonb');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS available_for_gigs BOOLEAN DEFAULT FALSE');

      const existing = await client.query('SELECT id, first_name, last_name, city FROM artist_signups WHERE slug IS NULL');
      for (const row of existing.rows) {
        const base = [row.first_name, row.last_name, row.city].filter(Boolean).join(' ').toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        let slug = base || `artist-${row.id}`;
        let suffix = 1;
        while (true) {
          const check = await client.query('SELECT 1 FROM artist_signups WHERE slug = $1 AND id != $2', [slug, row.id]);
          if (check.rows.length === 0) break;
          slug = `${base}-${suffix++}`;
        }
        await client.query('UPDATE artist_signups SET slug = $1 WHERE id = $2', [slug, row.id]);
      }

      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migArtistProfiles]);
      console.log('[migration] Added artist profile fields and generated slugs');
    }

    const migExtendedProfile = 'artist_extended_profile_v1';
    const alreadyExtendedProfile = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migExtendedProfile]);
    if (alreadyExtendedProfile.rows.length === 0) {
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS tagline VARCHAR(200)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS event_types JSONB DEFAULT \'[]\'');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS travel_radius VARCHAR(50)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS travel_notes TEXT');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS setup_options JSONB DEFAULT \'[]\'');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS equipment_notes TEXT');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS avg_response_time VARCHAR(50)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT \'[]\'');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS collaboration_open BOOLEAN DEFAULT false');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS preferred_venues JSONB DEFAULT \'[]\'');

      await client.query(`CREATE TABLE IF NOT EXISTS artist_gallery (
        id SERIAL PRIMARY KEY,
        artist_id INTEGER REFERENCES artist_signups(id) ON DELETE CASCADE,
        image_data TEXT NOT NULL,
        image_mime VARCHAR(50) DEFAULT 'image/jpeg',
        caption VARCHAR(200),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`);

      await client.query(`CREATE TABLE IF NOT EXISTS artist_reviews (
        id SERIAL PRIMARY KEY,
        artist_id INTEGER REFERENCES artist_signups(id) ON DELETE CASCADE,
        reviewer_name VARCHAR(100) NOT NULL,
        reviewer_email VARCHAR(255),
        event_type VARCHAR(100),
        event_date DATE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )`);

      await client.query('ALTER TABLE artist_media ADD COLUMN IF NOT EXISTS title VARCHAR(200)');
      await client.query('ALTER TABLE artist_media ADD COLUMN IF NOT EXISTS artist_id INTEGER REFERENCES artist_signups(id) ON DELETE CASCADE');

      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migExtendedProfile]);
      console.log('[migration] Added extended artist profile fields, gallery, and reviews tables');
    }

    const migQueue = 'create_blog_queue_v1';
    const alreadyQueue = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migQueue]);
    if (alreadyQueue.rows.length === 0) {
      await client.query(`CREATE TABLE IF NOT EXISTS blog_queue (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        keyword TEXT,
        status VARCHAR(20) DEFAULT 'queued',
        scheduled_date DATE,
        generated_content JSONB,
        generated_image_url TEXT,
        blog_post_id INTEGER,
        error TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`);
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migQueue]);
      console.log('[migration] Created blog_queue table');
    }

    const migFixSchema = 'fix_dashboard_schema_v1';
    const alreadyFixSchema = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migFixSchema]);
    if (alreadyFixSchema.rows.length === 0) {
      const hasOldCol = await client.query(
        "SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'client_id'"
      );
      if (hasOldCol.rows.length > 0) {
        await client.query('DROP TABLE IF EXISTS reviews CASCADE');
        await client.query('DROP TABLE IF EXISTS bookings CASCADE');
        await client.query('DROP TABLE IF EXISTS favourites CASCADE');
        await client.query("DELETE FROM migrations WHERE key = 'create_bookings_table_v1'");
        await client.query("DELETE FROM migrations WHERE key = 'create_reviews_table_v1'");
        console.log('[migration] Dropped old schema tables for recreation');
      }
      const hasOldUsers = await client.query(
        "SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id'"
      );
      const hasArtistFk = await client.query(
        "SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'artist_signup_id'"
      );
      if (hasOldUsers.rows.length > 0 && hasArtistFk.rows.length === 0) {
        await client.query('DROP TABLE IF EXISTS artist_media CASCADE');
        await client.query('DROP TABLE IF EXISTS reviews CASCADE');
        await client.query('DROP TABLE IF EXISTS bookings CASCADE');
        await client.query('DROP TABLE IF EXISTS favourites CASCADE');
        await client.query('DROP TABLE IF EXISTS users CASCADE');
        await client.query("DELETE FROM migrations WHERE key = 'create_users_table_v1'");
        await client.query("DELETE FROM migrations WHERE key = 'create_bookings_table_v1'");
        await client.query("DELETE FROM migrations WHERE key = 'create_reviews_table_v1'");
        console.log('[migration] Dropped old users table missing artist_signup_id');
      }
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migFixSchema]);
    }

    const migUsers = 'create_users_table_v1';
    const alreadyUsers = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migUsers]);
    if (alreadyUsers.rows.length === 0) {
      await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('artist', 'client')),
        artist_signup_id INTEGER REFERENCES artist_signups(id),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )`);
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migUsers]);
      console.log('[migration] Created users table');
    }

    const migBookings = 'create_bookings_table_v1';
    const alreadyBookings = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migBookings]);
    if (alreadyBookings.rows.length === 0) {
      await client.query(`CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        artist_id INTEGER REFERENCES artist_signups(id),
        client_user_id INTEGER REFERENCES users(id),
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        event_date DATE,
        event_type VARCHAR(255),
        audience_size VARCHAR(100),
        city VARCHAR(255),
        venue VARCHAR(255),
        budget_range VARCHAR(100),
        budget DECIMAL(10,2),
        commission_amount DECIMAL(10,2),
        commission_status VARCHAR(20) DEFAULT 'pending',
        message TEXT,
        notes TEXT,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'counter', 'confirmed', 'completed')),
        artist_response TEXT,
        counter_price VARCHAR(100),
        counter_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`);
      await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_artist ON bookings(artist_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)');
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migBookings]);
      console.log('[migration] Created bookings table');
    }

    const migReviews = 'create_reviews_table_v1';
    const alreadyReviews = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migReviews]);
    if (alreadyReviews.rows.length === 0) {
      await client.query(`CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER REFERENCES bookings(id),
        client_user_id INTEGER REFERENCES users(id),
        artist_id INTEGER REFERENCES artist_signups(id),
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        event_type VARCHAR(255),
        approved BOOLEAN DEFAULT FALSE,
        moderated BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )`);
      await client.query('CREATE INDEX IF NOT EXISTS idx_reviews_artist ON reviews(artist_id)');
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migReviews]);
      console.log('[migration] Created reviews table');
    }

    await client.query(`CREATE TABLE IF NOT EXISTS artist_media (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'music')),
      url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await client.query(`CREATE TABLE IF NOT EXISTS favourites (
      id SERIAL PRIMARY KEY,
      client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      artist_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(client_id, artist_id)
    )`);

    const migArtistExtend = 'extend_artist_signups_v1';
    const alreadyArtistExtend = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migArtistExtend]);
    if (alreadyArtistExtend.rows.length === 0) {
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS banner_image_data TEXT');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS banner_image_mime VARCHAR(50)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS starting_price VARCHAR(100)');
      await client.query("ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS price_type VARCHAR(20) DEFAULT 'quote'");
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS set_length VARCHAR(100)');
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS technical_requirements TEXT');
      await client.query("ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS languages_performed JSONB DEFAULT '[]'::jsonb");
      await client.query("ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS performance_types_offered JSONB DEFAULT '[]'::jsonb");
      await client.query("ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS blocked_dates JSONB DEFAULT '[]'::jsonb");
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migArtistExtend]);
      console.log('[migration] Extended artist_signups with pricing, availability, and performance fields');
    }

    const migFeaturedOrder = 'add_featured_order_v1';
    const alreadyFeaturedOrder = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migFeaturedOrder]);
    if (alreadyFeaturedOrder.rows.length === 0) {
      await client.query('ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0');
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migFeaturedOrder]);
      console.log('[migration] Added featured_order column to artist_signups');
    }

    const migSignupSource = 'add_signup_source_to_artist_signups';
    const hasSignupSource = await client.query('SELECT 1 FROM migrations WHERE key = $1', [migSignupSource]);
    if (hasSignupSource.rows.length === 0) {
      await client.query("ALTER TABLE artist_signups ADD COLUMN IF NOT EXISTS signup_source VARCHAR(20) DEFAULT 'festival'");
      await client.query("UPDATE artist_signups SET signup_source = 'booking' WHERE event IS NULL OR event = 'Account Signup'");
      await client.query('INSERT INTO migrations (key) VALUES ($1) ON CONFLICT DO NOTHING', [migSignupSource]);
      console.log('[migration] Added signup_source column to artist_signups');
    }

    const fixedImages = await client.query(
      `UPDATE blog_posts SET image_url = '' WHERE image_url LIKE '%blob.core.windows.net%' AND image_data IS NULL RETURNING id, title`
    );
    if (fixedImages.rows.length > 0) {
      console.log(`[startup] Cleared ${fixedImages.rows.length} expired DALL-E image URL(s):`, fixedImages.rows.map(r => `#${r.id}`).join(', '));
    }

    const queuedItems = await client.query(
      `SELECT id FROM blog_queue WHERE status = 'queued' ORDER BY scheduled_date ASC, id ASC`
    );
    if (queuedItems.rows.length > 0) {
      const tomorrowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
      tomorrowET.setDate(tomorrowET.getDate() + 1);
      for (let i = 0; i < queuedItems.rows.length; i++) {
        const newDate = new Date(tomorrowET);
        newDate.setDate(newDate.getDate() + i);
        await client.query(
          `UPDATE blog_queue SET scheduled_date = $1, updated_at = NOW() WHERE id = $2`,
          [newDate.toISOString().split('T')[0], queuedItems.rows[i].id]
        );
      }
      console.log(`[startup] Recompacted ${queuedItems.rows.length} queued item date(s) starting from tomorrow`);
    }

    console.log('[startup] Database initialization complete.');
    dbReady = true;
  } catch (err) {
    console.error('[startup] Seed error:', err.message);
    try { await client?.query('ROLLBACK'); } catch (_) {}
    dbReady = true;
  } finally {
    client?.release();
  }
}

const app = express();

const distPath = path.join(__dirname, '..', 'dist');
const distIndexPath = path.join(distPath, 'index.html');
let cachedIndexHtml = null;
try {
  if (fs.existsSync(distIndexPath)) {
    cachedIndexHtml = fs.readFileSync(distIndexPath, 'utf8');
  }
} catch (e) {}

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json({ limit: '100mb' }));

registerAuthRoutes(app, pool);
registerBookingRoutes(app, pool, getEmail);
registerReviewRoutes(app, pool);
registerArtistProfileRoutes(app, pool);
setupDashboardRoutes(app, pool);

let dbReady = false;

app.get('/api/blog-image/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT image_data, image_mime FROM blog_posts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0 || !result.rows[0].image_data) {
      return res.status(404).send('Image not found');
    }
    const { image_data, image_mime } = result.rows[0];
    const buffer = Buffer.from(image_data, 'base64');
    res.set('Content-Type', image_mime || 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    console.error('Blog image error:', err.message);
    res.status(500).send('Failed to load image');
  }
});

app.get('/api/page-image/:slug/:key', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT image_data, image_mime FROM page_content WHERE page_slug = $1 AND section_key = $2',
      [req.params.slug, req.params.key]
    );
    if (result.rows.length === 0 || !result.rows[0].image_data) {
      return res.status(404).send('Image not found');
    }
    const { image_data, image_mime } = result.rows[0];
    const buffer = Buffer.from(image_data, 'base64');
    const crypto = await import('crypto');
    const etag = crypto.createHash('md5').update(image_data).digest('hex');
    res.set('Content-Type', image_mime || 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('ETag', `"${etag}"`);
    res.set('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error('Page image error:', err.message);
    res.status(500).send('Failed to load image');
  }
});

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const videosDir = path.join(uploadsDir, 'videos');
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, videosDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /mp4|webm|mov|avi|quicktime/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext || mime);
  },
});

app.post('/api/contact', async (req, res) => {
  try {
    if (req.body.website_url) {
      return res.json({ success: true, message: 'Contact form submitted successfully' });
    }
    const { name, email, message, consent, phone_code, phone, source } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    await pool.query(
      'INSERT INTO contact_submissions (name, email, message, consent, phone_code, phone) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, email, message, consent || false, phone_code || null, phone || null]
    );
    getEmail().then(m => m.sendFormEmail('contact', { name, email, message, consent, phone_code, phone, source })).catch(() => {});
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

function generateSlug(firstName, lastName, city) {
  const base = [firstName, lastName, city].filter(Boolean).join(' ').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return base || null;
}

async function uniqueSlug(pool, base, excludeId = null) {
  let slug = base;
  let suffix = 1;
  while (true) {
    const params = excludeId ? [slug, excludeId] : [slug, -1];
    const check = await pool.query('SELECT 1 FROM artist_signups WHERE slug = $1 AND id != $2', params);
    if (check.rows.length === 0) return slug;
    slug = `${base}-${suffix++}`;
  }
}

app.get('/api/artists', async (req, res) => {
  try {
    const { search, genre, city, availability, price_min, price_max, sort_by, limit, offset } = req.query;
    const conditions = ['a.profile_approved = true'];
    const values = [];
    let idx = 1;

    if (search) {
      conditions.push(`(LOWER(a.first_name || ' ' || COALESCE(a.last_name, '')) LIKE $${idx})`);
      values.push(`%${search.toLowerCase()}%`);
      idx++;
    }
    if (genre) {
      conditions.push(`(LOWER(a.genre) = $${idx} OR LOWER(a.other_genre) = $${idx})`);
      values.push(genre.toLowerCase());
      idx++;
    }
    if (city) {
      conditions.push(`LOWER(a.city) = $${idx}`);
      values.push(city.toLowerCase());
      idx++;
    }
    if (availability === 'true') {
      conditions.push('a.available_for_gigs = true');
    }
    if (price_min) {
      conditions.push(`CAST(NULLIF(a.starting_price, '') AS NUMERIC) >= $${idx}`);
      values.push(parseFloat(price_min));
      idx++;
    }
    if (price_max) {
      conditions.push(`CAST(NULLIF(a.starting_price, '') AS NUMERIC) <= $${idx}`);
      values.push(parseFloat(price_max));
      idx++;
    }

    let orderBy = 'a.featured DESC, COALESCE(a.featured_order, 0) ASC, a.first_name ASC';
    if (sort_by === 'newest') {
      orderBy = 'a.created_at DESC';
    } else if (sort_by === 'rating') {
      orderBy = 'avg_rating DESC NULLS LAST, a.first_name ASC';
    } else if (sort_by === 'most_booked') {
      orderBy = 'booking_count DESC NULLS LAST, a.first_name ASC';
    }

    const limitVal = Math.min(parseInt(limit) || 50, 100);
    const offsetVal = parseInt(offset) || 0;

    const query = `
      SELECT a.slug, a.first_name, a.last_name, a.city, a.country, a.genre, a.other_genre, a.performance_language,
             a.bio, a.tagline, a.instagram, a.spotify, a.youtube, a.website, a.looking_for, a.available_for_gigs, a.featured, a.alumni,
             a.starting_price, a.price_type, a.set_length, a.languages_performed, a.performance_types_offered,
             a.performance_type, a.is_band, a.event_types, a.travel_radius, a.setup_options,
             a.avg_response_time, a.collaboration_open, a.preferred_venues,
             a.press_photo_data IS NOT NULL as has_photo,
             COALESCE(rv.avg_rating, 0) as avg_rating,
             COALESCE(rv.review_count, 0) as review_count,
             COALESCE(bk.booking_count, 0) as booking_count
      FROM artist_signups a
      LEFT JOIN (
        SELECT artist_id, AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as review_count FROM (
          SELECT artist_id, rating FROM reviews WHERE moderated = true
          UNION ALL
          SELECT artist_id, rating FROM artist_reviews WHERE approved = true
        ) combined GROUP BY artist_id
      ) rv ON rv.artist_id = a.id
      LEFT JOIN (SELECT artist_id, COUNT(*) as booking_count FROM bookings GROUP BY artist_id) bk ON bk.artist_id = a.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    values.push(limitVal, offsetVal);

    const result = await pool.query(query, values);

    const countQuery = `SELECT COUNT(*) FROM artist_signups a WHERE ${conditions.join(' AND ')}`;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);
    const artists = result.rows.map(r => ({
      ...r,
      photo_url: r.has_photo ? `/api/artists/${r.slug}/photo` : null,
      has_photo: undefined,
      avg_rating: parseFloat(r.avg_rating) || 0,
      review_count: parseInt(r.review_count) || 0,
      booking_count: parseInt(r.booking_count) || 0,
    }));
    res.json({ artists, total, limit: limitVal, offset: offsetVal });
  } catch (err) {
    console.error('Fetch artists error:', err);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

app.get('/api/artists/:slug', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.slug, a.first_name, a.last_name, a.city, a.country, a.genre, a.other_genre, a.performance_language,
              a.bio, a.tagline, a.instagram, a.spotify, a.youtube, a.website, a.facebook, a.tiktok, a.looking_for, a.available_for_gigs,
              a.featured, a.alumni, a.press_photo_data IS NOT NULL as has_photo, a.past_links, a.created_at,
              a.starting_price, a.price_type, a.set_length, a.technical_requirements, a.languages_performed,
              a.performance_types_offered, a.blocked_dates, a.performance_type, a.is_band,
              a.event_types, a.travel_radius, a.travel_notes, a.setup_options, a.equipment_notes,
              a.avg_response_time, a.achievements, a.collaboration_open, a.preferred_venues,
              COALESCE(rv.avg_rating, 0) as avg_rating,
              COALESCE(rv.review_count, 0) as review_count
       FROM artist_signups a
       LEFT JOIN (
         SELECT artist_id, AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as review_count FROM (
           SELECT artist_id, rating FROM reviews WHERE moderated = true
           UNION ALL
           SELECT artist_id, rating FROM artist_reviews WHERE approved = true
         ) combined GROUP BY artist_id
       ) rv ON rv.artist_id = a.id
       WHERE a.slug = $1 AND a.profile_approved = true`,
      [req.params.slug]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artist not found' });
    const artist = result.rows[0];
    const artistId = artist.id;
    artist.photo_url = artist.has_photo ? `/api/artists/${artist.slug}/photo` : null;
    delete artist.has_photo;
    delete artist.id;
    artist.avg_rating = parseFloat(artist.avg_rating) || 0;
    artist.review_count = parseInt(artist.review_count) || 0;

    const reviewsResult = await pool.query(
      `SELECT reviewer_name, event_type, event_date, rating, review_text, created_at FROM artist_reviews WHERE artist_id = $1 AND approved = true ORDER BY created_at DESC LIMIT 20`,
      [artistId]
    );
    artist.reviews = reviewsResult.rows;

    const galleryResult = await pool.query(
      `SELECT id, caption, sort_order FROM artist_gallery WHERE artist_id = $1 ORDER BY sort_order ASC, id ASC`,
      [artistId]
    );
    artist.gallery = galleryResult.rows.map(g => ({
      id: g.id,
      url: `/api/artists/${artist.slug}/gallery/${g.id}`,
      caption: g.caption,
    }));

    const mediaResult = await pool.query(
      `SELECT id, media_type, url, title FROM artist_media WHERE artist_id = $1 ORDER BY sort_order ASC, id ASC`,
      [artistId]
    );
    artist.media_samples = mediaResult.rows;

    res.json(artist);
  } catch (err) {
    console.error('Fetch artist error:', err);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

app.get('/api/artists/:slug/photo', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT press_photo_data, press_photo_mime FROM artist_signups WHERE slug = $1',
      [req.params.slug]
    );
    if (result.rows.length === 0 || !result.rows[0].press_photo_data) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    const { press_photo_data, press_photo_mime } = result.rows[0];
    const buffer = Buffer.from(press_photo_data, 'base64');
    res.set('Content-Type', press_photo_mime || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    console.error('Fetch artist photo error:', err);
    res.status(500).json({ error: 'Failed to fetch photo' });
  }
});

app.get('/api/artists/:slug/gallery/:imageId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.image_data, g.image_mime FROM artist_gallery g
       JOIN artist_signups a ON a.id = g.artist_id
       WHERE a.slug = $1 AND g.id = $2 AND a.profile_approved = true`,
      [req.params.slug, req.params.imageId]
    );
    if (result.rows.length === 0 || !result.rows[0].image_data) {
      return res.status(404).json({ error: 'Image not found' });
    }
    const { image_data, image_mime } = result.rows[0];
    const buffer = Buffer.from(image_data, 'base64');
    res.set('Content-Type', image_mime || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(buffer);
  } catch (err) {
    console.error('Fetch gallery image error:', err);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

app.post('/api/artist-signup', async (req, res) => {
  try {
    if (req.body.website_url) {
      return res.json({ success: true, message: 'Artist application submitted successfully' });
    }
    const d = req.body;
    if (!d.firstName || !d.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    const baseSlug = generateSlug(d.firstName, d.lastName, d.city);
    const slug = baseSlug ? await uniqueSlug(pool, baseSlug) : null;

    let pressPhotoData = null, pressPhotoMime = null;
    if (d.pressPhoto && d.pressPhoto.startsWith('data:')) {
      const match = d.pressPhoto.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) { pressPhotoMime = match[1]; pressPhotoData = match[2]; }
    }

    await pool.query(
      `INSERT INTO artist_signups (
        event, first_name, last_name, email, phone_code, phone,
        address, city, province, postal_code, country,
        facebook, youtube, instagram, tiktok, spotify, website,
        genre, other_genre, performance_language, is_band, performed_before,
        performance_type, socan_registered,
        manager_first_name, manager_last_name, manager_email, manager_phone_code, manager_phone,
        past_links, ideas, consent, slug, bio, press_photo_data, press_photo_mime, looking_for, available_for_gigs
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38)`,
      [
        d.event, d.firstName, d.lastName, d.email, d.phoneCode, d.phone,
        d.address, d.city, d.province, d.postalCode, d.country,
        d.facebook, d.youtube, d.instagram, d.tiktok, d.spotify, d.website,
        d.genre, d.otherGenre, d.performanceLanguage, d.isBand, d.performedBefore,
        d.performanceType, d.socanRegistered,
        d.managerFirstName, d.managerLastName, d.managerEmail, d.managerPhoneCode, d.managerPhone,
        d.pastLinks || [], d.ideas, d.consent || false, slug, d.bio || null,
        pressPhotoData, pressPhotoMime, JSON.stringify(d.lookingFor || []), d.availableForGigs || false
      ]
    );
    getEmail().then(m => m.sendFormEmail('artist', d)).catch(() => {});
    res.json({ success: true, message: 'Artist application submitted successfully' });
  } catch (err) {
    console.error('Artist signup error:', err);
    res.status(500).json({ error: 'Failed to submit artist application' });
  }
});

app.post('/api/booking-requests', async (req, res) => {
  try {
    if (req.body.website_url) {
      return res.json({ success: true });
    }
    const d = req.body;
    if (!d.artistSlug || !d.name || !d.email || !d.eventDate) {
      return res.status(400).json({ error: 'Artist, name, email, and event date are required' });
    }
    await pool.query(
      `CREATE TABLE IF NOT EXISTS booking_requests (
        id SERIAL PRIMARY KEY,
        artist_slug VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL,
        event_type VARCHAR(100),
        audience_size VARCHAR(50),
        city_venue VARCHAR(255),
        budget_range VARCHAR(100),
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )`
    );
    await pool.query(
      `INSERT INTO booking_requests (artist_slug, client_name, client_email, event_date, event_type, audience_size, city_venue, budget_range, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [d.artistSlug, d.name, d.email, d.eventDate, d.eventType || null, d.audienceSize || null, d.cityVenue || null, d.budgetRange || null, d.message || null]
    );
    res.json({ success: true, message: 'Booking request submitted successfully' });
  } catch (err) {
    console.error('Booking request error:', err);
    res.status(500).json({ error: 'Failed to submit booking request' });
  }
});

app.post('/api/volunteer-signup', async (req, res) => {
  try {
    if (req.body.website_url) {
      return res.json({ success: true, message: 'Volunteer application submitted successfully' });
    }
    const d = req.body;
    if (!d.firstName || !d.email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    await pool.query(
      `INSERT INTO volunteer_signups (
        first_name, last_name, email, phone_code, phone,
        address, city, province, postal_code, country,
        genre, linkedin, how_can_you_help, how_can_we_help_you, consent
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        d.firstName, d.lastName, d.email, d.phoneCode, d.phone,
        d.address, d.city, d.province, d.postalCode, d.country,
        d.genre, d.linkedin || null, d.howCanYouHelp, d.howCanWeHelpYou, d.consent || false
      ]
    );
    getEmail().then(m => m.sendFormEmail('volunteer', d)).catch(() => {});
    res.json({ success: true, message: 'Volunteer application submitted successfully' });
  } catch (err) {
    console.error('Volunteer signup error:', err);
    res.status(500).json({ error: 'Failed to submit volunteer application' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    if (req.body.website_url) {
      return res.json({ success: true, message: 'Subscribed successfully' });
    }
    const { firstName, email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    await pool.query(
      'INSERT INTO newsletter_subscriptions (first_name, email) VALUES ($1, $2)',
      [firstName, email]
    );
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.warn('WARNING: ADMIN_PASSWORD environment variable is not set. Admin endpoints will be inaccessible.');
}

function requireAdmin(req, res, next) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin not configured' });
  }
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/admin/contacts', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.patch('/api/admin/artists/:id/shortlist', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE artist_signups SET shortlisted = NOT COALESCE(shortlisted, false) WHERE id = $1 RETURNING id, shortlisted',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to toggle shortlist' });
  }
});

app.get('/api/admin/artists', requireAdmin, async (req, res) => {
  try {
    const source = req.query.source;
    let whereClause = '';
    const params = [];
    if (source === 'festival') {
      whereClause = "WHERE (signup_source = 'festival' OR signup_source IS NULL)";
    } else if (source === 'booking') {
      whereClause = "WHERE signup_source = 'booking'";
    }
    const result = await pool.query(
      `SELECT id, event, first_name, last_name, email, phone_code, phone,
              address, city, province, postal_code, country,
              facebook, youtube, instagram, tiktok, spotify, website,
              genre, other_genre, performance_language, is_band, performed_before,
              performance_type, socan_registered,
              manager_first_name, manager_last_name, manager_email, manager_phone_code, manager_phone,
              past_links, ideas, consent, shortlisted, created_at,
              profile_approved, featured, alumni, slug, bio, looking_for, available_for_gigs,
              press_photo_data IS NOT NULL as has_press_photo,
              COALESCE(signup_source, 'festival') as signup_source
       FROM artist_signups ${whereClause} ORDER BY created_at DESC`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

app.patch('/api/admin/artists/:id/profile', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { profile_approved, featured, alumni, bio, looking_for, available_for_gigs, press_photo, slug: newSlug,
            tagline, event_types, travel_radius, travel_notes, setup_options, equipment_notes,
            avg_response_time, achievements, collaboration_open, preferred_venues,
            starting_price, price_type, set_length, technical_requirements } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;

    if (profile_approved !== undefined) { updates.push(`profile_approved = $${idx++}`); values.push(profile_approved); }
    if (featured !== undefined) { updates.push(`featured = $${idx++}`); values.push(featured); }
    if (alumni !== undefined) { updates.push(`alumni = $${idx++}`); values.push(alumni); }
    if (bio !== undefined) { updates.push(`bio = $${idx++}`); values.push(bio); }
    if (looking_for !== undefined) { updates.push(`looking_for = $${idx++}`); values.push(JSON.stringify(looking_for)); }
    if (available_for_gigs !== undefined) { updates.push(`available_for_gigs = $${idx++}`); values.push(available_for_gigs); }
    if (newSlug !== undefined) { updates.push(`slug = $${idx++}`); values.push(newSlug); }
    if (tagline !== undefined) { updates.push(`tagline = $${idx++}`); values.push(tagline); }
    if (event_types !== undefined) { updates.push(`event_types = $${idx++}`); values.push(JSON.stringify(event_types)); }
    if (travel_radius !== undefined) { updates.push(`travel_radius = $${idx++}`); values.push(travel_radius); }
    if (travel_notes !== undefined) { updates.push(`travel_notes = $${idx++}`); values.push(travel_notes); }
    if (setup_options !== undefined) { updates.push(`setup_options = $${idx++}`); values.push(JSON.stringify(setup_options)); }
    if (equipment_notes !== undefined) { updates.push(`equipment_notes = $${idx++}`); values.push(equipment_notes); }
    if (avg_response_time !== undefined) { updates.push(`avg_response_time = $${idx++}`); values.push(avg_response_time); }
    if (achievements !== undefined) { updates.push(`achievements = $${idx++}`); values.push(JSON.stringify(achievements)); }
    if (collaboration_open !== undefined) { updates.push(`collaboration_open = $${idx++}`); values.push(collaboration_open); }
    if (preferred_venues !== undefined) { updates.push(`preferred_venues = $${idx++}`); values.push(JSON.stringify(preferred_venues)); }
    if (starting_price !== undefined) { updates.push(`starting_price = $${idx++}`); values.push(starting_price); }
    if (price_type !== undefined) { updates.push(`price_type = $${idx++}`); values.push(price_type); }
    if (set_length !== undefined) { updates.push(`set_length = $${idx++}`); values.push(set_length); }
    if (technical_requirements !== undefined) { updates.push(`technical_requirements = $${idx++}`); values.push(technical_requirements); }

    if (press_photo && press_photo.startsWith('data:')) {
      const match = press_photo.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        updates.push(`press_photo_mime = $${idx++}`); values.push(match[1]);
        updates.push(`press_photo_data = $${idx++}`); values.push(match[2]);
      }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const result = await pool.query(
      `UPDATE artist_signups SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, profile_approved, featured, alumni, slug, bio, looking_for, available_for_gigs`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    if (profile_approved !== undefined) {
      const artistInfo = await pool.query(
        'SELECT email, first_name, slug FROM artist_signups WHERE id = $1',
        [id]
      );
      if (artistInfo.rows.length > 0) {
        const artist = artistInfo.rows[0];
        if (profile_approved) {
          getEmail().then(m => m.sendProfileApprovedEmail({
            email: artist.email,
            firstName: artist.first_name,
            slug: artist.slug,
          })).catch(() => {});
        } else {
          const rejectionReason = req.body.rejection_reason || '';
          getEmail().then(m => m.sendProfileRejectedEmail({
            email: artist.email,
            firstName: artist.first_name,
            reason: rejectionReason,
          })).catch(() => {});
        }
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update artist profile error:', err);
    res.status(500).json({ error: 'Failed to update artist profile' });
  }
});

app.delete('/api/admin/artists/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM reviews WHERE artist_id = $1', [id]);
    await pool.query('DELETE FROM bookings WHERE artist_id = $1', [id]);
    await pool.query('DELETE FROM users WHERE artist_signup_id = $1', [id]);
    const result = await pool.query('DELETE FROM artist_signups WHERE id = $1 RETURNING id, first_name, last_name', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artist not found' });
    res.json({ success: true, deleted: result.rows[0] });
  } catch (err) {
    console.error('Delete artist error:', err);
    res.status(500).json({ error: 'Failed to delete artist' });
  }
});

app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, a.first_name as artist_first_name, a.last_name as artist_last_name, a.slug as artist_slug
       FROM bookings b
       LEFT JOIN artist_signups a ON b.artist_id = a.id
       ORDER BY b.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const { client_name, client_email, artist_id, event_date, event_type, status, budget, notes } = req.body;
    if (!client_name) return res.status(400).json({ error: 'Client name is required' });
    const commissionAmount = budget ? (parseFloat(budget) * 0.15).toFixed(2) : null;
    const result = await pool.query(
      `INSERT INTO bookings (client_name, client_email, artist_id, event_date, event_type, status, budget, commission_amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [client_name, client_email || null, artist_id || null, event_date || null, event_type || null, status || 'pending', budget || null, commissionAmount, notes || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.patch('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { status, notes, budget, event_date, event_type } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;
    if (status !== undefined) { updates.push(`status = $${idx++}`); values.push(status); }
    if (notes !== undefined) { updates.push(`notes = $${idx++}`); values.push(notes); }
    if (budget !== undefined) {
      updates.push(`budget = $${idx++}`); values.push(budget);
      const commissionAmount = budget ? (parseFloat(budget) * 0.15).toFixed(2) : null;
      updates.push(`commission_amount = $${idx++}`); values.push(commissionAmount);
    }
    if (event_date !== undefined) { updates.push(`event_date = $${idx++}`); values.push(event_date); }
    if (event_type !== undefined) { updates.push(`event_type = $${idx++}`); values.push(event_type); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    updates.push(`updated_at = NOW()`);
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

app.get('/api/admin/commissions', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, a.first_name as artist_first_name, a.last_name as artist_last_name
       FROM bookings b
       LEFT JOIN artist_signups a ON b.artist_id = a.id
       WHERE b.status = 'confirmed' OR b.status = 'completed'
       ORDER BY b.created_at DESC`
    );
    const stats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status IN ('confirmed','completed')) as total_commissionable,
        COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'pending' AND status IN ('confirmed','completed')), 0) as pending_total,
        COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'paid' AND status IN ('confirmed','completed')), 0) as collected_total
       FROM bookings`
    );
    res.json({ bookings: result.rows, stats: stats.rows[0] });
  } catch (err) {
    console.error('Fetch commissions error:', err);
    res.status(500).json({ error: 'Failed to fetch commissions' });
  }
});

app.patch('/api/admin/commissions/:id/paid', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE bookings SET commission_status = 'paid', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Mark commission paid error:', err);
    res.status(500).json({ error: 'Failed to update commission' });
  }
});

app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, a.first_name as artist_first_name, a.last_name as artist_last_name, a.slug as artist_slug
       FROM reviews r
       LEFT JOIN artist_signups a ON r.artist_id = a.id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.patch('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body;
    if (approved === undefined) return res.status(400).json({ error: 'approved field required' });
    const result = await pool.query(
      'UPDATE reviews SET approved = $1 WHERE id = $2 RETURNING *',
      [approved, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

app.patch('/api/admin/artists/:id/featured-order', requireAdmin, async (req, res) => {
  try {
    const { featured, featured_order } = req.body;
    const updates = [];
    const values = [];
    let idx = 1;
    if (featured !== undefined) { updates.push(`featured = $${idx++}`); values.push(featured); }
    if (featured_order !== undefined) { updates.push(`featured_order = $${idx++}`); values.push(featured_order); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE artist_signups SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, first_name, last_name, featured, featured_order, slug, profile_approved`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Artist not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update featured order error:', err);
    res.status(500).json({ error: 'Failed to update featured order' });
  }
});

app.get('/api/admin/featured-artists', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, slug, featured, featured_order, profile_approved, genre, city,
              press_photo_data IS NOT NULL as has_press_photo
       FROM artist_signups
       WHERE profile_approved = true
       ORDER BY featured DESC, featured_order ASC, first_name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch featured artists error:', err);
    res.status(500).json({ error: 'Failed to fetch featured artists' });
  }
});

app.post('/api/admin/artists/:id/request-info', requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const artist = await pool.query('SELECT first_name, last_name, email FROM artist_signups WHERE id = $1', [req.params.id]);
    if (artist.rows.length === 0) return res.status(404).json({ error: 'Artist not found' });
    const { first_name, last_name, email } = artist.rows[0];
    if (!email) return res.status(400).json({ error: 'Artist has no email address' });
    const emailMod = await getEmail();
    await emailMod.sendRequestInfoEmail(email, [first_name, last_name].filter(Boolean).join(' '), message);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    console.error('Request info email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const [artistsRes, bookingsRes, bookingsMonthRes, commissionsRes, enquiriesRes, confirmedRes] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM artist_signups WHERE profile_approved = true'),
      pool.query('SELECT COUNT(*) as total FROM bookings'),
      pool.query('SELECT COUNT(*) as total FROM bookings WHERE created_at >= $1', [firstOfMonth]),
      pool.query(`SELECT
        COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'pending' AND status IN ('confirmed','completed')), 0) as pending,
        COALESCE(SUM(commission_amount) FILTER (WHERE commission_status = 'paid' AND status IN ('confirmed','completed')), 0) as collected
        FROM bookings`),
      pool.query('SELECT COUNT(*) as total FROM contact_submissions'),
      pool.query("SELECT COUNT(*) as total FROM bookings WHERE status = 'confirmed' OR status = 'completed'"),
    ]);

    const totalEnquiries = parseInt(enquiriesRes.rows[0].total) || 0;
    const totalConfirmed = parseInt(confirmedRes.rows[0].total) || 0;
    const conversionRate = totalEnquiries > 0 ? ((totalConfirmed / totalEnquiries) * 100).toFixed(1) : '0.0';

    res.json({
      total_artists: parseInt(artistsRes.rows[0].total) || 0,
      total_bookings: parseInt(bookingsRes.rows[0].total) || 0,
      bookings_this_month: parseInt(bookingsMonthRes.rows[0].total) || 0,
      commission_pending: parseFloat(commissionsRes.rows[0].pending) || 0,
      commission_collected: parseFloat(commissionsRes.rows[0].collected) || 0,
      total_enquiries: totalEnquiries,
      conversion_rate: parseFloat(conversionRate),
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

app.get('/api/admin/volunteers', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM volunteer_signups ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
});

app.get('/api/admin/newsletter', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM newsletter_subscriptions ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch newsletter subscriptions' });
  }
});

const blogMediaDir = path.join(__dirname, '..', 'uploads', 'media');
if (!fs.existsSync(blogMediaDir)) {
  fs.mkdirSync(blogMediaDir, { recursive: true });
}

function getNextBlogCoverName() {
  const files = fs.readdirSync(blogMediaDir);
  let maxNum = 0;
  for (const f of files) {
    const match = f.match(/^blog-cover-(\d+)\./);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1]));
  }
  return `blog-cover-${maxNum + 1}`;
}

const blogStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, blogMediaDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = getNextBlogCoverName();
    cb(null, name + ext);
  },
});
const blogUpload = multer({
  storage: blogStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

app.post('/api/admin/upload', requireAdmin, (req, res) => {
  const uploadType = req.query.type;
  if (uploadType === 'video') {
    videoUpload.single('video')(req, res, async (err) => {
      if (err) {
        console.error('Video upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 200MB.' });
        }
        return res.status(400).json({ error: err.message || 'Failed to upload video' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No video uploaded' });
      }
      res.json({ success: true, url: `/uploads/videos/${req.file.filename}`, originalName: req.file.originalname });
    });
  } else {
    const isBlog = uploadType === 'blog';
    const uploader = isBlog ? blogUpload : upload;
    uploader.single('image')(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
        }
        return res.status(400).json({ error: err.message || 'Failed to upload image' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }
      if (isBlog) {
        try {
          const fileData = fs.readFileSync(req.file.path);
          const base64 = fileData.toString('base64');
          const mime = req.file.mimetype || 'image/png';
          res.json({ success: true, url: `/uploads/media/${req.file.filename}`, imageData: base64, imageMime: mime });
        } catch (e) {
          res.json({ success: true, url: `/uploads/media/${req.file.filename}` });
        }
      } else {
        try {
          const fileData = fs.readFileSync(req.file.path);
          const base64 = fileData.toString('base64');
          const mime = req.file.mimetype || 'image/png';
          res.json({ success: true, url: `/uploads/${req.file.filename}`, imageData: base64, imageMime: mime });
        } catch (e) {
          res.json({ success: true, url: `/uploads/${req.file.filename}` });
        }
      }
    });
  }
});

app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, created_at, updated_at FROM blog_posts WHERE published = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, created_at, updated_at FROM blog_posts WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

app.get('/api/admin/blogs', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, created_at, updated_at FROM blog_posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

app.post('/api/admin/blogs', requireAdmin, async (req, res) => {
  try {
    const { slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, image_data, image_mime } = req.body;
    if (!slug || !title) {
      return res.status(400).json({ error: 'Slug and title are required' });
    }
    const result = await pool.query(
      `INSERT INTO blog_posts (slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, image_data, image_mime)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [slug, title, full_title || title, date, author, category, description, image_url, badge, JSON.stringify(meta || {}), JSON.stringify(sections || []), JSON.stringify(social_links || {}), published !== false, image_data || null, image_mime || null]
    );
    const row = result.rows[0];
    if (row.image_data && !row.image_url?.startsWith('/api/blog-image/')) {
      await pool.query('UPDATE blog_posts SET image_url = $1 WHERE id = $2', [`/api/blog-image/${row.id}`, row.id]);
      row.image_url = `/api/blog-image/${row.id}`;
    }
    if (row.published) {
      const metaObj = typeof row.meta === 'string' ? JSON.parse(row.meta) : (row.meta || {});
      getEmail().then(m => m.sendBlogPublishedEmail({
        title: row.title,
        slug: row.slug,
        description: row.description,
        sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
        imageUrl: row.image_url || null,
        reelScript: metaObj.reel_script || '',
      })).catch(() => {});
    }
    res.json(row);
  } catch (err) {
    console.error('Blog create error:', err);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

app.put('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const { slug, title, full_title, date, author, category, description, image_url, badge, meta, sections, social_links, published, image_data, image_mime } = req.body;
    const prev = await pool.query('SELECT published FROM blog_posts WHERE id = $1', [req.params.id]);
    const wasPublished = prev.rows.length > 0 && prev.rows[0].published;
    let finalImageUrl = image_url;
    if (image_data) {
      await pool.query('UPDATE blog_posts SET image_data = $1, image_mime = $2 WHERE id = $3', [image_data, image_mime || 'image/png', req.params.id]);
      finalImageUrl = `/api/blog-image/${req.params.id}`;
    }
    const result = await pool.query(
      `UPDATE blog_posts SET slug=$1, title=$2, full_title=$3, date=$4, author=$5, category=$6, description=$7, image_url=$8, badge=$9, meta=$10, sections=$11, social_links=$12, published=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [slug, title, full_title || title, date, author, category, description, finalImageUrl, badge, JSON.stringify(meta || {}), JSON.stringify(sections || []), JSON.stringify(social_links || {}), published !== false, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    const row = result.rows[0];
    if (row.published && !wasPublished) {
      const metaObj = typeof row.meta === 'string' ? JSON.parse(row.meta) : (row.meta || {});
      getEmail().then(m => m.sendBlogPublishedEmail({
        title: row.title,
        slug: row.slug,
        description: row.description,
        sections: typeof row.sections === 'string' ? JSON.parse(row.sections) : row.sections,
        imageUrl: row.image_url || null,
        reelScript: metaObj.reel_script || '',
      })).catch(() => {});
    }
    res.json(row);
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

app.post('/api/admin/blogs/:id/reparse', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, sections FROM blog_posts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    const sections = result.rows[0].sections;
    if (!Array.isArray(sections)) return res.json(result.rows[0]);
    const reparsed = serverParseSections(sections);
    await pool.query('UPDATE blog_posts SET sections = $1::jsonb, updated_at = NOW() WHERE id = $2', [JSON.stringify(reparsed), req.params.id]);
    const updated = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Blog reparse error:', err);
    res.status(500).json({ error: 'Failed to reparse blog post' });
  }
});

app.delete('/api/admin/blogs/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM blog_posts WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Blog delete error:', err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

app.post('/api/admin/ai/brainstorm', requireAdmin, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }
    const ai = await getAI();
    const ideas = await ai.brainstormIdeas(topic.trim());
    res.json({ ideas });
  } catch (err) {
    console.error('AI brainstorm error:', err);
    res.status(500).json({ error: 'Failed to generate ideas. Please try again.' });
  }
});

app.post('/api/admin/ai/write', requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    const ai = await getAI();
    const content = await ai.writeBlogPost(title, description);
    res.json({ content });
  } catch (err) {
    console.error('AI write error:', err);
    res.status(500).json({ error: 'Failed to generate blog post. Please try again.' });
  }
});

app.post('/api/admin/ai/image', requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const ai = await getAI();
    const imagePrompt = await ai.generateImagePrompt(title, description || title);

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

    const imgResponse = await fetch(dalleUrl);
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageData = buffer.toString('base64');
    const imageMime = imgResponse.headers.get('content-type') || 'image/png';

    res.json({ imageData, imageMime, imagePrompt });
  } catch (err) {
    console.error('AI image error:', err);
    res.status(500).json({ error: 'Failed to generate image. Please try again.' });
  }
});

app.get('/api/admin/queue', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blog_queue ORDER BY scheduled_date ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Queue fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

app.post('/api/admin/queue', requireAdmin, async (req, res) => {
  try {
    const { ideas } = req.body;
    if (!ideas || !Array.isArray(ideas) || ideas.length === 0) {
      return res.status(400).json({ error: 'Ideas array is required' });
    }

    const lastScheduled = await pool.query(
      `SELECT MAX(scheduled_date) as last_date FROM blog_queue WHERE status IN ('queued', 'writing')`
    );
    const todayET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    let nextDate = new Date(todayET);
    nextDate.setDate(nextDate.getDate() + 1);
    if (lastScheduled.rows[0].last_date) {
      const lastDate = new Date(lastScheduled.rows[0].last_date);
      lastDate.setDate(lastDate.getDate() + 1);
      if (lastDate > nextDate) nextDate = lastDate;
    }

    const inserted = [];
    for (const idea of ideas) {
      const result = await pool.query(
        `INSERT INTO blog_queue (title, description, keyword, scheduled_date) VALUES ($1, $2, $3, $4) RETURNING *`,
        [idea.title, idea.description || '', idea.keyword || '', nextDate.toISOString().split('T')[0]]
      );
      inserted.push(result.rows[0]);
      nextDate.setDate(nextDate.getDate() + 1);
    }

    res.json({ inserted, count: inserted.length });
  } catch (err) {
    console.error('Queue add error:', err);
    res.status(500).json({ error: 'Failed to add to queue' });
  }
});

app.post('/api/admin/queue/reorder', requireAdmin, async (req, res) => {
  try {
    const { id1, id2 } = req.body;
    if (!id1 || !id2) return res.status(400).json({ error: 'Two item IDs required' });
    const items = await pool.query('SELECT id, scheduled_date FROM blog_queue WHERE id = ANY($1)', [[id1, id2]]);
    if (items.rows.length !== 2) return res.status(404).json({ error: 'Items not found' });
    const item1 = items.rows.find(r => r.id === id1);
    const item2 = items.rows.find(r => r.id === id2);
    await pool.query('UPDATE blog_queue SET scheduled_date = $1 WHERE id = $2', [item2.scheduled_date, id1]);
    await pool.query('UPDATE blog_queue SET scheduled_date = $1 WHERE id = $2', [item1.scheduled_date, id2]);
    res.json({ success: true });
  } catch (err) {
    console.error('Queue reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder queue' });
  }
});

app.delete('/api/admin/queue/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM blog_queue WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Queue delete error:', err);
    res.status(500).json({ error: 'Failed to delete queue item' });
  }
});

app.patch('/api/admin/queue/:id', requireAdmin, async (req, res) => {
  try {
    const { scheduled_date, title, description, keyword } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;
    if (scheduled_date !== undefined) { fields.push(`scheduled_date = $${idx++}`); values.push(scheduled_date); }
    if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (keyword !== undefined) { fields.push(`keyword = $${idx++}`); values.push(keyword); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    fields.push(`updated_at = NOW()`);
    values.push(req.params.id);
    const result = await pool.query(
      `UPDATE blog_queue SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Queue update error:', err);
    res.status(500).json({ error: 'Failed to update queue item' });
  }
});

app.post('/api/admin/queue/:id/preview', requireAdmin, async (req, res) => {
  try {
    const item = await pool.query('SELECT * FROM blog_queue WHERE id = $1', [req.params.id]);
    if (item.rows.length === 0) return res.status(404).json({ error: 'Item not found' });

    await pool.query(`UPDATE blog_queue SET status = 'writing', updated_at = NOW() WHERE id = $1`, [req.params.id]);

    const ai = await getAI();
    let result;
    try {
      result = await ai.writeBlogPost(item.rows[0].title, item.rows[0].description);
    } catch (err) {
      await pool.query(`UPDATE blog_queue SET status = 'queued', updated_at = NOW() WHERE id = $1`, [req.params.id]);
      return res.status(500).json({ error: `AI write failed: ${err.message}` });
    }

    await pool.query(
      `UPDATE blog_queue SET status = 'queued', generated_content = $1, updated_at = NOW() WHERE id = $2`,
      [JSON.stringify(result), req.params.id]
    );

    res.json({ content: result });
  } catch (err) {
    console.error('Queue preview error:', err);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

app.put('/api/admin/queue/:id/content', requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    const result = await pool.query(
      `UPDATE blog_queue SET generated_content = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [JSON.stringify(content), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Queue content save error:', err);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.post('/api/admin/queue/:id/process', requireAdmin, async (req, res) => {
  try {
    const item = await pool.query('SELECT * FROM blog_queue WHERE id = $1', [req.params.id]);
    if (item.rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    if (item.rows[0].status === 'published') return res.status(400).json({ error: 'Already published' });
    if (item.rows[0].status === 'writing') return res.status(400).json({ error: 'Already being processed' });

    const todayET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })).toISOString().split('T')[0];
    await pool.query(`UPDATE blog_queue SET scheduled_date = $2, status = 'queued', updated_at = NOW() WHERE id = $1`, [req.params.id, todayET]);

    const qp = await getQueueProcessor();
    const result = await qp.processNextInQueue(pool);

    const tomorrowET = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
    tomorrowET.setDate(tomorrowET.getDate() + 1);
    const remaining = await pool.query(
      `SELECT id FROM blog_queue WHERE status = 'queued' ORDER BY scheduled_date ASC, id ASC`
    );
    for (let i = 0; i < remaining.rows.length; i++) {
      const newDate = new Date(tomorrowET);
      newDate.setDate(newDate.getDate() + i);
      await pool.query(
        `UPDATE blog_queue SET scheduled_date = $1, updated_at = NOW() WHERE id = $2`,
        [newDate.toISOString().split('T')[0], remaining.rows[i].id]
      );
    }

    res.json(result || { status: 'no items to process' });
  } catch (err) {
    console.error('Queue process error:', err);
    res.status(500).json({ error: 'Failed to process queue item' });
  }
});

let playlistCache = { data: null, timestamp: 0, playlistId: '' };
app.get('/api/south-asian-playlist', async (req, res) => {
  try {
    const playlistId = req.query.list || 'OLAK5uy_lSTp1DIuzZBUyee3kDsXwPgP25WdfwB40';
    const now = Date.now();
    if (playlistCache.data && playlistCache.playlistId === playlistId && (now - playlistCache.timestamp) < 30 * 60 * 1000) {
      return res.json(playlistCache.data);
    }
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) return res.json({ items: [], error: 'No API key' });

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=20&playlistId=${playlistId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.items) return res.json({ items: [], error: data.error?.message || 'Failed to fetch' });

    const videoIds = data.items.map(i => i.contentDetails.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${apiKey}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    const durationMap = {};
    if (detailsData.items) {
      detailsData.items.forEach(v => {
        const dur = v.contentDetails.duration;
        const match = dur.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const h = parseInt(match?.[1] || '0');
        const m = parseInt(match?.[2] || '0');
        const s = parseInt(match?.[3] || '0');
        durationMap[v.id] = h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
      });
    }

    const items = data.items.map((item, i) => ({
      position: i + 1,
      title: item.snippet.title,
      artist: item.snippet.videoOwnerChannelTitle?.replace(/ - Topic$/, '') || item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
      videoId: item.contentDetails.videoId,
      duration: durationMap[item.contentDetails.videoId] || '',
      publishedAt: item.snippet.publishedAt,
    }));

    let plTitle = 'South Asian Charts';
    try {
      const plUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`;
      const plRes = await fetch(plUrl);
      const plData = await plRes.json();
      if (plData.items?.[0]?.snippet?.title) plTitle = plData.items[0].snippet.title;
    } catch (_) {}
    const result = { items, title: plTitle };
    playlistCache = { data: result, timestamp: now, playlistId };
    res.json(result);
  } catch (err) {
    console.error('Playlist fetch error:', err);
    res.status(500).json({ items: [], error: 'Failed to fetch playlist' });
  }
});

app.get('/api/admin/pages', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT page_slug FROM page_content ORDER BY page_slug');
    res.json(result.rows.map(r => r.page_slug));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

app.get('/api/admin/pages/:pageSlug', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM page_content WHERE page_slug = $1 ORDER BY section_key',
      [req.params.pageSlug]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

app.put('/api/admin/pages/:pageSlug', requireAdmin, async (req, res) => {
  try {
    const { sections } = req.body;
    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: 'Sections array required' });
    }
    for (const section of sections) {
      if (section.image_data && section.image_mime) {
        await pool.query(
          `INSERT INTO page_content (page_slug, section_key, content_type, content_value, label, image_data, image_mime)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (page_slug, section_key) DO UPDATE SET content_value = $4, label = $5, image_data = $6, image_mime = $7, updated_at = NOW()`,
          [req.params.pageSlug, section.section_key, section.content_type || 'text', section.content_value, section.label || section.section_key, section.image_data, section.image_mime]
        );
      } else {
        await pool.query(
          `INSERT INTO page_content (page_slug, section_key, content_type, content_value, label)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (page_slug, section_key) DO UPDATE SET content_value = $4, label = $5, updated_at = NOW()`,
          [req.params.pageSlug, section.section_key, section.content_type || 'text', section.content_value, section.label || section.section_key]
        );
      }
    }
    const result = await pool.query(
      'SELECT * FROM page_content WHERE page_slug = $1 ORDER BY section_key',
      [req.params.pageSlug]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Page content update error:', err);
    res.status(500).json({ error: 'Failed to update page content' });
  }
});

const BUILD_TIMESTAMP = new Date().toISOString();

app.get('/api/version', (req, res) => {
  res.json({ build: BUILD_TIMESTAMP, node: process.version });
});

app.get('/api/page-content/:pageSlug', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'X-Build-Version': BUILD_TIMESTAMP,
  });
  try {
    const result = await pool.query(
      "SELECT section_key, content_type, content_value, image_data IS NOT NULL AS has_image, EXTRACT(EPOCH FROM updated_at)::bigint AS updated_ts FROM page_content WHERE page_slug = $1",
      [req.params.pageSlug]
    );
    const content = Object.create(null);
    result.rows.forEach(r => {
      if (r.has_image && r.content_type === 'image') {
        content[r.section_key] = `/api/page-image/${req.params.pageSlug}/${r.section_key}?v=${r.updated_ts || '1'}`;
      } else {
        content[r.section_key] = r.content_value;
      }
    });
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

app.get('/images/sathish-avatar.png', (req, res) => {
  const avatarPath = path.join(__dirname, '..', 'public', 'images', 'sathish-avatar.png');
  if (fs.existsSync(avatarPath)) {
    res.set('Cache-Control', 'public, max-age=2592000');
    res.set('Content-Type', 'image/png');
    res.sendFile(avatarPath);
  } else {
    res.status(404).send('Not found');
  }
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const staticPages = [
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/concerts', changefreq: 'weekly', priority: '0.9' },
      { path: '/about', changefreq: 'monthly', priority: '0.8' },
      { path: '/artists', changefreq: 'weekly', priority: '0.8' },
      { path: '/our-artists', changefreq: 'monthly', priority: '0.8' },
      { path: '/booking', changefreq: 'monthly', priority: '0.7' },
      { path: '/community', changefreq: 'monthly', priority: '0.7' },
      { path: '/media', changefreq: 'weekly', priority: '0.7' },
      { path: '/umafoundation', changefreq: 'monthly', priority: '0.7' },
      { path: '/sponsorship', changefreq: 'monthly', priority: '0.7' },
      { path: '/open-mic', changefreq: 'monthly', priority: '0.6' },
      { path: '/sofa-session', changefreq: 'monthly', priority: '0.6' },
      { path: '/press-kit', changefreq: 'monthly', priority: '0.6' },
      { path: '/artistsignup', changefreq: 'monthly', priority: '0.5' },
      { path: '/volunteersignup', changefreq: 'monthly', priority: '0.5' },
    ];

    const blogRows = await pool.query(
      "SELECT slug, updated_at FROM blog_posts WHERE published = true ORDER BY updated_at DESC"
    );
    const artistRows = await pool.query(
      "SELECT slug, created_at FROM artist_signups WHERE slug IS NOT NULL AND slug != '' AND profile_approved = true ORDER BY created_at DESC"
    );

    const base = 'https://www.desifest.ca';
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const p of staticPages) {
      xml += `  <url>\n    <loc>${base}${p.path}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }

    for (const row of blogRows.rows) {
      const lastmod = row.updated_at ? new Date(row.updated_at).toISOString().split('T')[0] : '';
      xml += `  <url>\n    <loc>${base}/blog/${row.slug}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    for (const row of artistRows.rows) {
      const lastmod = row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '';
      xml += `  <url>\n    <loc>${base}/artists/${row.slug}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    xml += '</urlset>';

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

if (fs.existsSync(distPath)) {
  console.log(`[startup] Serving static files from ${distPath}`);
  app.use(express.static(distPath, {
    maxAge: '7d',
    immutable: true,
    acceptRanges: true,
  }));
}
const KNOWN_CLIENT_ROUTES = new Set([
  ...Object.keys(ROUTE_META),
  '/admin', '/login', '/signup', '/dashboard',
]);

app.get('/blog', (req, res) => {
  res.redirect(301, `${SITE_URL}/media`);
});

app.get(['/', '/{*splat}'], async (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }

  if (!cachedIndexHtml) {
    return res.status(200).send('DESIFEST - Loading...');
  }

  const normalizedPath = req.path.replace(/\/+$/, '') || '/';
  const pageUrl = `${SITE_URL}${normalizedPath}`;

  const blogMatch = req.path.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    try {
      const slug = blogMatch[1];
      const result = await pool.query(
        'SELECT title, full_title, description, image_url, meta, slug FROM blog_posts WHERE slug = $1 AND published = true',
        [slug]
      );
      if (result.rows.length > 0) {
        const blog = result.rows[0];
        const blogTitle = (blog.meta?.seo_title || blog.full_title || blog.title || '') + ' | DESIFEST';
        const blogDesc = blog.meta?.meta_description || blog.description || '';
        const blogImage = blog.image_url || undefined;
        const blogUrl = `${SITE_URL}/blog/${blog.slug}`;
        const html = injectMeta(cachedIndexHtml, {
          title: blogTitle,
          description: blogDesc,
          url: blogUrl,
          image: blogImage,
          type: 'article',
        });
        return res.type('html').status(200).send(html);
      }
    } catch (err) {
      console.error('Blog OG meta error:', err.message);
    }
    const html = injectMeta(cachedIndexHtml, { title: 'Not Found | DESIFEST', description: '', url: pageUrl });
    return res.type('html').status(404).send(html);
  }

  const artistMatch = req.path.match(/^\/artists\/([^/]+)\/?$/);
  if (artistMatch) {
    try {
      const slug = artistMatch[1];
      const result = await pool.query(
        "SELECT first_name, last_name, genre, city, bio, press_photo_data IS NOT NULL as has_photo FROM artist_signups WHERE slug = $1 AND profile_approved = true",
        [slug]
      );
      if (result.rows.length > 0) {
        const artist = result.rows[0];
        const fullName = [artist.first_name, artist.last_name].filter(Boolean).join(' ');
        const artistTitle = `${fullName} | DESIFEST Artist Network`;
        const artistDesc = artist.bio
          ? artist.bio.substring(0, 160).replace(/\s+/g, ' ').trim()
          : `${fullName} — ${[artist.genre, artist.city].filter(Boolean).join(', ')}. Discover and book this artist through the DESIFEST Artist Network.`;
        const artistImage = artist.has_photo ? `${SITE_URL}/api/artists/${slug}/photo` : undefined;
        const artistUrl = `${SITE_URL}/artists/${slug}`;
        const html = injectMeta(cachedIndexHtml, {
          title: artistTitle,
          description: artistDesc,
          url: artistUrl,
          image: artistImage,
        });
        return res.type('html').status(200).send(html);
      }
    } catch (err) {
      console.error('Artist OG meta error:', err.message);
    }
    const html = injectMeta(cachedIndexHtml, { title: 'Not Found | DESIFEST', description: '', url: pageUrl });
    return res.type('html').status(404).send(html);
  }

  const staticMeta = getStaticMeta(req.path);
  if (staticMeta) {
    const html = injectMeta(cachedIndexHtml, {
      title: staticMeta.title,
      description: staticMeta.description,
      url: pageUrl,
    });
    return res.type('html').status(200).send(html);
  }

  const legalMatch = req.path.match(/^\/legal\/([^/]+)\/?$/);
  const isKnownRoute = KNOWN_CLIENT_ROUTES.has(normalizedPath) || legalMatch;

  if (isKnownRoute) {
    const html = injectMeta(cachedIndexHtml, { title: 'DESIFEST 2026', description: '', url: pageUrl });
    return res.type('html').status(200).send(html);
  }

  const html = injectMeta(cachedIndexHtml, { title: 'Not Found | DESIFEST', description: '', url: pageUrl });
  res.type('html').status(404).send(html);
});

app.use((err, req, res, next) => {
  console.error('[error] Unhandled error:', err.message);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  seedIfEmpty().then(() => {
    getQueueProcessor().then(qp => qp.startQueueScheduler(pool)).catch(err => console.error('[queue] Scheduler start error:', err.message));
  }).catch(err => console.error('[startup] seedIfEmpty failed:', err.message));
});

function gracefulShutdown(signal) {
  console.log(`[shutdown] Received ${signal}, shutting down...`);
  server.close(() => {
    pool.end().then(() => {
      console.log('[shutdown] Database pool closed.');
      process.exit(0);
    }).catch(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10000);
}
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
