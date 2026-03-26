# Desifest & UMA Foundation

Full-stack web application for Canada's largest South Asian music and arts festival.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend**: Node.js, Express 5, PostgreSQL (Replit DB)
- **Email**: Resend
- **Deployment**: Replit

## Core Features
- **Public Website**: Festival info, artist lineups, schedules.
- **UMA Foundation**: Institutional landing page for the cultural non-profit initiative. Clearly separates "UMA Today" (active operations) from "UMA Centre 2027" (future physical space).
- **CMS**: Admin dashboard for managing content.
- **Forms**: Integrated contact, artist signup, volunteer, newsletter, and Founding Circle interest forms.
- **AI Blog Writer**: Admin tool using OpenAI GPT-4o for brainstorming editorial-style blog ideas, generating full articles with SEO metadata, and creating DALL-E 3 cover images. Flow: topic → 5 ideas → pick → AI writes → generate image → edit & publish. AI never names specific artists — only generic references allowed. Only Sathish Bala may be named.
- **South Asian Charts**: YouTube playlist player on the Artists page (`/our-artists`), between hero and featured artists. Playlist ID managed via CMS (`charts_playlist_id` in `artists` page content). Component: `src/Components/Artist/SouthAsianCharts.jsx`.
- **Content Queue**: Autopilot blog pipeline. Admin brainstorms and multi-selects ideas, which get queued with auto-assigned daily publish dates. A scheduler runs hourly and auto-processes due items (writes article, generates image, publishes, sends email notification with 60-second reel script). Manual "Process Now" also available. After manual publish, remaining queue dates recompact to start from tomorrow.
- **Blog Publish Emails**: When a blog is published (auto or manual), sends email to info@desifest.ca with article preview, "Read Full Article" link, and a 60-second conversational reel script for video content.
- **SEO**: Dynamic `SEO` component (`src/Components/SEO.jsx`) sets per-page title, description, OG image, Twitter cards, canonical URL, and og:type. Blog posts include `BlogPosting` JSON-LD structured data. Dynamic sitemap at `/sitemap.xml` includes all static pages, published blog posts, and approved artist profiles. `robots.txt` in `public/`.
- **Artist Network (Phase 1)**: Artist signup submissions auto-generate public profiles at `/artists/:slug`. Admin can approve, feature, mark as alumni, edit bio, upload press photos, and set collaboration preferences. Signup form collects optional profile data (bio, press photo, looking for, available for gigs). Public API: `GET /api/artists` (all approved), `GET /api/artists/:slug` (single profile), `GET /api/artists/:slug/photo` (press photo). Admin API: `PATCH /api/admin/artists/:id/profile` (update profile fields). Profile page: `src/Pages/ArtistProfilePage.jsx`.
- **Artist Registry & Booking System**: Full auth, booking, review, and admin management system.
  - **Auth**: JWT-based auth with `users` table (email, password_hash, role: artist/client, artist_signup_id FK). Endpoints: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/claim-profile`. Middleware: `requireAuth`, `requireRole`.
  - **Bookings**: `bookings` table with status flow (pending → accepted/declined/counter → confirmed → completed). Endpoints: `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:id`, `PATCH /api/bookings/:id/status`.
  - **Booking Management**: Admin panel tab for tracking all booking requests. Supports status filters (pending, accepted, confirmed, completed, declined), click-through details with manual status override, and new booking creation. Admin API: `GET/POST /api/admin/bookings`, `PATCH /api/admin/bookings/:id`.
  - **Commission Tracking**: 15% commission auto-calculated on booking budget. Admin panel tab showing confirmed/completed bookings with commission amounts, pending/collected totals, and mark-as-paid action. Admin API: `GET /api/admin/commissions`, `PATCH /api/admin/commissions/:id/paid`.
  - **Reviews**: `reviews` table (rating 1-5, review_text, moderated flag). Endpoints: `POST /api/reviews`, `GET /api/artists/:slug/reviews`. Admin panel tab to approve/reject/delete client reviews. Admin API: `GET /api/admin/reviews`, `PATCH /api/admin/reviews/:id`, `DELETE /api/admin/reviews/:id`.
  - **Artist Profile Updates**: Authenticated artist endpoints: `PATCH /api/artist/profile`, `GET /api/artist/availability`, `PUT /api/artist/availability`.
  - **Search/Filter API**: `GET /api/artists` supports query params: search, genre, city, availability, price_min, price_max, sort_by (featured/newest/rating/most_booked/A-Z), limit/offset pagination. Returns `{ artists, total, limit, offset }`.
  - **Extended artist_signups**: New columns: banner_image_data/mime, starting_price, price_type, set_length, technical_requirements, languages_performed (JSONB), performance_types_offered (JSONB), blocked_dates (JSONB), `featured_order`.
  - **Featured Artist Management**: Admin panel tab to toggle featured status and set display order for the artist directory. Admin API: `GET /api/admin/featured-artists`, `PATCH /api/admin/artists/:id/featured-order`.
  - **Analytics Dashboard**: Admin panel landing page with summary cards: total artists, total bookings, bookings this month, conversion rate, commission pending/collected, total enquiries. Admin API: `GET /api/admin/analytics`.
  - **Email Notifications**: Booking request (to artist + admin), artist response (to client), booking confirmed (to both), review prompt (to client 1 day after event_date via scheduler), and "Request More Info" ask for applicants via Resend.
  - **Dependencies**: bcryptjs, jsonwebtoken.
- **Artist Directory** (`/artists`): Searchable, filterable grid of approved artists with search bar, genre/city/availability filters, sort options (Featured, Newest, A-Z), and pagination. Component: `src/Pages/ArtistDirectoryPage.jsx`, card: `src/Components/Artist/ArtistCard.jsx`.
- **Enhanced Artist Profiles** (`/artists/:slug`): Melodist-inspired editorial layout. Hero: lime-green container with artist name, tagline, photo, badges, genre tags, social links. Sections: About (bio, performance details grid), Performance Details (event types, travel radius/notes, setup options, equipment/tech, preferred venues, response time, collaboration status), Achievements (awards, press mentions), Discography & Media (YouTube embeds, Spotify/YouTube cards), Reviews (star ratings, client testimonials with event type/date), Booking CTA (price, availability, response time, modal booking form). Booking requests stored in `booking_requests` table via `POST /api/booking-requests`.
  - **Extended Profile Fields**: tagline, event_types (JSONB), travel_radius, travel_notes, setup_options (JSONB), equipment_notes, avg_response_time, achievements (JSONB), collaboration_open, preferred_venues (JSONB).
  - **Artist Reviews**: `artist_reviews` table (reviewer_name, event_type, event_date, rating 1-5, review_text, approved flag). Combined with booking reviews for aggregate rating.
  - **Artist Gallery**: `artist_gallery` table (image_data base64, caption, sort_order). Served via `/api/artists/:slug/gallery/:imageId`.
- **Artist Page (Legacy)** (`/our-artists`): Original hardcoded artist showcase page preserved at `/our-artists` with featured artists, community section, and South Asian Charts.

- **Artist & Client Dashboards**: Authenticated dashboard system with JWT-based auth. Artists can manage profiles (bio, photos, pricing, performance types, languages, social links), upload/manage media (up to 6 photos, 3 video links, 1 music embed), manage availability via calendar, view/respond to booking requests (accept/decline/counter), and see earnings summary. Clients can view booking requests with status tracking, confirm/cancel bookings, leave reviews (1-5 stars + text) for completed bookings, and save/unsave favourite artists. Auth: `/login`, `/signup` (with role selection), `/dashboard` (redirects by role). Auth state persisted in localStorage with JWT. Protected routes redirect to login if unauthenticated.

## Project Structure
- `src/`: React frontend
  - `Pages/`: Main route components (e.g., `UmaFoundationPage.jsx`, `AdminPage.jsx`, `LoginPage.jsx`, `SignupPage.jsx`, `DashboardPage.jsx`)
  - `Components/`: Reusable UI components
  - `Components/Dashboard/`: Artist and Client dashboard components (`ArtistDashboard.jsx`, `ClientDashboard.jsx`)
  - `context/`: React contexts (`AuthContext.jsx` for auth state management)
  - `Routes/`: App routing logic
- `server/`: Express backend
  - `index.js`: API endpoints, server setup, and database migrations
  - `auth.js`: JWT auth system (signup, login, me, claim-profile, requireAuth/requireRole middleware)
  - `bookings.js`: Booking CRUD endpoints with status flow
  - `reviews.js`: Review submission and per-artist review listing
  - `artist-profile.js`: Authenticated artist profile update and availability management
  - `dashboard.js`: Artist and client dashboard API routes (frontend dashboard backends)
  - `ai.js`: OpenAI integration for blog brainstorming, writing, and image generation
  - `queue-processor.js`: Autopilot content queue processor, hourly scheduler, and review prompt sender
  - `email.js`: Resend email templates (forms, blog publish, booking notifications, review prompts)
- `public/`: Static assets

## Key Configurations
- **Hostname Routing**: UMA Foundation is served on `umafoundation.org` or `/umafoundation`.
- **Theming**: UMA uses a green-based palette (`#1B3A2D`, `#F5F7F4`) with `oswaldd` font for headings.
- **Navigation**: Vertical pill-style navbar for desktop; hamburger menu for all screen sizes.

## UMA Foundation Page Structure
The page has 7 sections with anchor IDs for navigation:
1. **Hero** — "UMA / Culture. Forward." with "Explore UMA" CTA → `#uma-today`
2. **UMA Today** (`#uma-today`) — Current initiatives, DESIFEST flagship callout
3. **Impact & Leadership** (`#impact`) — Stats grid, track record, micro funding
4. **UMA Centre 2027** (`#uma-centre`) — Future physical space, blueprint-styled cards, "Planned 2027 Launch" badge. NO real venue photos.
5. **Why This Matters** (`#why-it-matters`) — Evolution from event-based to institution
6. **Founding Supporters** (`#founding-circle`) — Email capture form submitting to `/api/contact` with source "UMA Founding Circle"
7. **Governance** (`#governance`) — Clean standalone governance block
8. **Contact Form** — Dark-wrapped shared `ContactForm` component at bottom
