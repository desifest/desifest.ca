const SITE_URL = 'https://www.desifest.ca';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const ROUTE_META = {
  '/': {
    title: "DESIFEST 2026 | Toronto's Largest South Asian Music & Arts Festival | June 18-20",
    description: "Join DESIFEST 2026, Canada's largest South Asian music and arts festival. Celebrating 20 years of uniting generations, genres, and voices on one iconic stage. June 18-20 at Sankofa Square, Toronto.",
  },
  '/concerts': {
    title: 'The 2026 Concert | DESIFEST 2026',
    description: 'Join DESIFEST 2026, June 18-20 at Sankofa Square, Toronto. Experience live South Asian music, food, art, and culture at Canada\'s largest South Asian festival.',
  },
  '/community': {
    title: 'Community | DESIFEST 2026',
    description: 'Discover DESIFEST community programs including Open Mic, Sofa Sessions, and year-round cultural initiatives celebrating South Asian arts in Toronto.',
  },
  '/about': {
    title: 'About Us | DESIFEST 2026',
    description: 'Learn about DESIFEST, Canada\'s largest South Asian music and arts festival. 20 years of celebrating culture, diversity, and community in Toronto.',
  },
  '/sponsorship': {
    title: 'Sponsorship | DESIFEST 2026',
    description: 'Partner with DESIFEST 2026, Toronto\'s largest South Asian music festival. Explore sponsorship opportunities and multicultural marketing with our award-winning event.',
  },
  '/open-mic': {
    title: 'Open Mic | DESIFEST 2026',
    description: 'DESIFEST Open Mic — a platform for emerging South Asian artists to perform, connect, and grow. Join our open mic nights and showcase your talent.',
  },
  '/sofa-session': {
    title: 'Sofa Session | DESIFEST 2026',
    description: 'DESIFEST Sofa Sessions — intimate music performances featuring South Asian artists. Experience music up close and personal.',
  },
  '/our-artists': {
    title: 'Our Artists | DESIFEST 2026',
    description: 'Meet the talented artists performing at DESIFEST 2026. From Bollywood and Bhangra to Hip-Hop and Classical fusion — discover the lineup.',
  },
  '/artists': {
    title: 'Artist Directory | DESIFEST 2026',
    description: 'Browse and discover talented South Asian artists in the DESIFEST network. Filter by genre, city, and availability to find the perfect artist for your event.',
  },
  '/booking': {
    title: 'Community — Artist Network | DESIFEST 2026',
    description: 'Join the DESIFEST Artist Network. South Asian artists: build your profile and get booked. Event organizers: discover and book verified talent across Canada.',
  },
  '/media': {
    title: 'Media | DESIFEST 2026',
    description: 'Explore DESIFEST media coverage, blog posts, press releases, and photo galleries from Canada\'s largest South Asian music and arts festival.',
  },
  '/press-kit': {
    title: 'Press Kit | DESIFEST 2026',
    description: 'Access the DESIFEST press kit with official logos, mission statement, case studies, and media contacts for Canada\'s largest South Asian music festival.',
  },
  '/shop': {
    title: 'Shop | DESIFEST 2026',
    description: 'Shop official DESIFEST merchandise — apparel, accessories, and more to celebrate South Asian music and arts culture.',
  },
  '/umafoundation': {
    title: 'UMA Foundation | DESIFEST 2026',
    description: 'UMA Foundation — a cultural initiative powering DESIFEST and advancing South Asian arts, youth development, and community connection across Ontario.',
  },
  '/artistsignup': {
    title: 'Artist Sign Up | DESIFEST 2026',
    description: 'Apply to perform at DESIFEST 2026 — Canada\'s largest South Asian music and arts festival. Submit your artist application for June 18-20 at Sankofa Square, Toronto.',
  },
  '/volunteersignup': {
    title: 'Volunteer Sign Up | DESIFEST 2026',
    description: 'Volunteer at DESIFEST 2026 — help create Canada\'s largest South Asian music and arts festival. Sign up to be part of the team for June 18-20.',
  },
};

function injectMeta(html, { title, description, url, image, type }) {
  const safeTitle = (title || '').replace(/"/g, '&quot;');
  const safeDesc = (description || '').replace(/"/g, '&quot;');
  const ogImage = image || DEFAULT_IMAGE;
  const ogType = type || 'website';
  const canonical = url || SITE_URL;

  let result = html;
  result = result.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`);
  result = result.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${safeDesc}" />`);
  result = result.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  result = result.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${ogType}" />`);
  result = result.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  result = result.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${safeTitle}" />`);
  result = result.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${safeDesc}" />`);
  result = result.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${ogImage}" />`);
  result = result.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${safeTitle}" />`);
  result = result.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${safeDesc}" />`);
  result = result.replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${ogImage}" />`);
  return result;
}

function getStaticMeta(path) {
  const normalized = path.replace(/\/+$/, '') || '/';
  return ROUTE_META[normalized] || null;
}

export { SITE_URL, DEFAULT_IMAGE, ROUTE_META, injectMeta, getStaticMeta };
