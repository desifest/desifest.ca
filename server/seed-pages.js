import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const pageData = [
  // HOMEPAGE
  { page_slug: 'home', section_key: 'hero_line1', content_type: 'text', content_value: 'Where South', label: 'Hero Line 1' },
  { page_slug: 'home', section_key: 'hero_line2', content_type: 'text', content_value: 'Asian Culture', label: 'Hero Line 2' },
  { page_slug: 'home', section_key: 'hero_line3', content_type: 'text', content_value: 'Meets the World.', label: 'Hero Line 3' },
  { page_slug: 'home', section_key: 'hero_description', content_type: 'text', content_value: "Canada's largest South Asian music and arts festival— uniting generations, genres, and voices on one iconic stage.", label: 'Hero Description' },
  { page_slug: 'home', section_key: 'hero_date', content_type: 'text', content_value: 'June 18 – 20', label: 'Event Date' },
  { page_slug: 'home', section_key: 'hero_location', content_type: 'text', content_value: 'Sankofa Square, Canada', label: 'Event Location' },
  { page_slug: 'home', section_key: 'hero_year', content_type: 'text', content_value: '2026', label: 'Event Year' },
  { page_slug: 'home', section_key: 'hero_anniversary', content_type: 'text', content_value: '20th Anniversary', label: 'Anniversary Text' },
  { page_slug: 'home', section_key: 'artists_section_title', content_type: 'text', content_value: 'Artists', label: 'Artists Section Title' },
  { page_slug: 'home', section_key: 'community_section_title', content_type: 'text', content_value: 'Community', label: 'Community Section Title' },
  { page_slug: 'home', section_key: 'govt_support_title', content_type: 'text', content_value: 'Government Support', label: 'Government Support Title' },
  { page_slug: 'home', section_key: 'contact_heading', content_type: 'text', content_value: 'Get In Touch', label: 'Contact Section Heading' },

  // ABOUT
  { page_slug: 'about', section_key: 'hero_label', content_type: 'text', content_value: 'ABOUT US', label: 'Hero Label' },
  { page_slug: 'about', section_key: 'hero_line1', content_type: 'text', content_value: 'showing up for', label: 'Hero Line 1' },
  { page_slug: 'about', section_key: 'hero_line2', content_type: 'text', content_value: '20 years', label: 'Hero Line 2' },

  // CONCERTS
  { page_slug: 'concerts', section_key: 'hero_line1', content_type: 'text', content_value: 'THE', label: 'Hero Title Line 1' },
  { page_slug: 'concerts', section_key: 'hero_taglines', content_type: 'text', content_value: "THREE DAYS.\nONE COMMUNITY.\nCOUNTLESS MOMENTS.", label: 'Hero Taglines (one per line)' },
  { page_slug: 'concerts', section_key: 'hero_year', content_type: 'text', content_value: '2026', label: 'Hero Year' },
  { page_slug: 'concerts', section_key: 'hero_line2', content_type: 'text', content_value: 'CONCERT', label: 'Hero Title Line 2' },
  { page_slug: 'concerts', section_key: 'hero_subtitle', content_type: 'text', content_value: 'LIVE MUSIC. SHARED ENERGY. REAL CONNECTION', label: 'Hero Subtitle' },
  { page_slug: 'concerts', section_key: 'artist_signup_btn', content_type: 'text', content_value: 'ARTIST SIGN UP', label: 'Artist Signup Button Text' },
  { page_slug: 'concerts', section_key: 'volunteer_btn', content_type: 'text', content_value: 'VOLUNTEER', label: 'Volunteer Button Text' },
  { page_slug: 'concerts', section_key: 'day0_label', content_type: 'text', content_value: 'LAUNCH NIGHT', label: 'Day 0 Label' },
  { page_slug: 'concerts', section_key: 'day0_date', content_type: 'text', content_value: 'JUNE 18', label: 'Day 0 Date (Thursday Kick-Off)' },
  { page_slug: 'concerts', section_key: 'day0_time', content_type: 'text', content_value: '7:00PM – 11:00PM', label: 'Day 0 Time' },
  { page_slug: 'concerts', section_key: 'day0_title', content_type: 'text', content_value: 'THE BLUEPRINT: HOW SOUTH ASIAN SOUND SHAPED GLOBAL SOUNDS', label: 'Day 0 Title' },
  { page_slug: 'concerts', section_key: 'day0_description', content_type: 'text', content_value: 'The 20th Anniversary kick-off — an evening showcase exploring the roots and reach of South Asian music across the globe. A celebration of the sounds, stories, and artists that built the blueprint.', label: 'Day 0 Description' },
  { page_slug: 'concerts', section_key: 'day1_label', content_type: 'text', content_value: 'DAY 02', label: 'Day 1 Label' },
  { page_slug: 'concerts', section_key: 'day1_date', content_type: 'text', content_value: 'JUNE 19', label: 'Day 1 Date' },
  { page_slug: 'concerts', section_key: 'day1_time', content_type: 'text', content_value: '5:00PM – 11:00PM', label: 'Day 1 Time' },
  { page_slug: 'concerts', section_key: 'day1_title', content_type: 'text', content_value: 'MULTICULTURAL MUSIC CELEBRATION', label: 'Day 1 Title' },
  { page_slug: 'concerts', section_key: 'day1_description', content_type: 'text', content_value: 'A free public event highlighting artists shaped by South Asian roots and global influence. Expect high-energy performances, cross-genre collaborations, and a crowd that reflects the diversity of Toronto itself.', label: 'Day 1 Description' },
  { page_slug: 'concerts', section_key: 'day2_label', content_type: 'text', content_value: 'DAY 03', label: 'Day 2 Label' },
  { page_slug: 'concerts', section_key: 'day2_date', content_type: 'text', content_value: 'JUNE 20', label: 'Day 2 Date' },
  { page_slug: 'concerts', section_key: 'day2_time', content_type: 'text', content_value: '11:00AM – 11:00PM', label: 'Day 2 Time' },
  { page_slug: 'concerts', section_key: 'day2_title', content_type: 'text', content_value: 'FOOD VENDORS, BRAND ACTIVATIONS', label: 'Day 2 Title' },
  { page_slug: 'concerts', section_key: 'day2_description', content_type: 'text', content_value: '12 hours of free, family-friendly music and dance — showcasing Canadian and international artists performing everything from Bollywood favourites and Punjabi bangers to Hip Hop, Dance, and Pop.', label: 'Day 2 Description' },

  // COMMUNITY
  { page_slug: 'community', section_key: 'hero_line1', content_type: 'text', content_value: 'Our', label: 'Hero Line 1' },
  { page_slug: 'community', section_key: 'hero_line2', content_type: 'text', content_value: 'Community', label: 'Hero Line 2' },
  { page_slug: 'community', section_key: 'hero_subtitle', content_type: 'text', content_value: 'More than a festival. A year-round movement.', label: 'Hero Subtitle' },
  { page_slug: 'community', section_key: 'hero_subtitle2', content_type: 'text', content_value: 'But also go through our...', label: 'Hero Subtitle Line 2' },
  { page_slug: 'community', section_key: 'open_mic_btn', content_type: 'text', content_value: 'Open Mic', label: 'Open Mic Button Text' },
  { page_slug: 'community', section_key: 'sofa_btn', content_type: 'text', content_value: 'Sofa Sessions', label: 'Sofa Sessions Button Text' },

  // MEDIA
  { page_slug: 'media', section_key: 'hero_top_text', content_type: 'text', content_value: 'The Story Behind The Stage', label: 'Hero Top Text' },
  { page_slug: 'media', section_key: 'hero_title', content_type: 'text', content_value: 'MEDIA & PRESS', label: 'Hero Title' },
  { page_slug: 'media', section_key: 'press_details_text', content_type: 'text', content_value: 'Get Our Press Details Here!', label: 'Press Details Text' },

  // SPONSORSHIP
  { page_slug: 'sponsorship', section_key: 'description', content_type: 'text', content_value: "We are excited to be back for our 18th annual DESIFEST – Toronto's award winning South Asian Music Festival. This is a unique and proven marketing opportunity for your brand! Find a time below that work for us to get a on call and explore how you can tap into the power of multicultural marketing with DESIFEST 2024.", label: 'Sponsorship Description' },

  // OUR ARTISTS
  { page_slug: 'artists', section_key: 'hero_line1', content_type: 'text', content_value: 'OUR', label: 'Hero Line 1' },
  { page_slug: 'artists', section_key: 'hero_line2', content_type: 'text', content_value: 'ARTISTS', label: 'Hero Line 2' },
  { page_slug: 'artists', section_key: 'hero_subtitle', content_type: 'text', content_value: "LET'S SHOW UP, CONNECT AND GROW PERFORMANCES", label: 'Hero Subtitle' },

  // PRESS KIT
  { page_slug: 'press-kit', section_key: 'hero_top_heading', content_type: 'text', content_value: '2026 DESIFEST', label: 'Top Heading' },
  { page_slug: 'press-kit', section_key: 'hero_title', content_type: 'text', content_value: 'MEDIA KIT', label: 'Main Title' },
  { page_slug: 'press-kit', section_key: 'hero_subtext', content_type: 'text', content_value: 'Download the full 2026 media kit', label: 'Subtext' },
  { page_slug: 'press-kit', section_key: 'download_btn', content_type: 'text', content_value: 'Download Kit', label: 'Download Button Text' },
];

async function seed() {
  console.log('Seeding page content...');
  
  await pool.query('DELETE FROM page_content');
  
  for (const item of pageData) {
    await pool.query(
      `INSERT INTO page_content (page_slug, section_key, content_type, content_value, label)
       VALUES ($1, $2, $3, $4, $5)`,
      [item.page_slug, item.section_key, item.content_type, item.content_value, item.label]
    );
  }
  
  console.log(`Seeded ${pageData.length} page content entries.`);
  await pool.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
