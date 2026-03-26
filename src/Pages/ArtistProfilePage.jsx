import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronLeft, MapPin, Globe, Calendar, Users, Mic, Send, CheckCircle, AlertCircle, Play, X, ChevronDown, Star, Plane, Wrench, Award, Handshake, Building, Clock, MessageSquare } from 'lucide-react'
import { FaInstagram, FaSpotify, FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa'
import SEO from '@/Components/SEO'

const EVENT_TYPES = [
    'Wedding', 'Corporate Event', 'Festival', 'Concert', 'Private Party',
    'Club Night', 'Cultural Event', 'Birthday Party', 'Other'
]

const BUDGET_RANGES = [
    'Under $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500 – $5,000',
    '$5,000 – $10,000', '$10,000+'
]

const AUDIENCE_SIZES = [
    'Under 50', '50 – 100', '100 – 300', '300 – 500', '500 – 1,000', '1,000+'
]

function BookingModal({ artist, slug, onClose }) {
    const [form, setForm] = useState({
        name: '', email: '', eventDate: '', eventType: '', audienceSize: '',
        cityVenue: '', budgetRange: '', message: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const res = await fetch('/api/booking-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, artistSlug: slug })
            })
            const data = await res.json()
            if (res.ok && data.success) {
                setSubmitted(true)
            } else {
                setError(data.error || 'Failed to submit request')
            }
        } catch {
            setError('Network error. Please try again.')
        }
        setSubmitting(false)
    }

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#1a0a2e] p-8" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-300 transition hover:text-white">
                    <X className="h-4 w-4" />
                </button>

                {submitted ? (
                    <div className="py-8 text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-[#D5FF00]" />
                        <h3 className="oswald-500 mt-6 text-2xl text-white">Request Sent!</h3>
                        <p className="mt-3 text-gray-300">
                            Your booking request has been submitted. The artist will review and respond to your inquiry.
                        </p>
                        <button onClick={onClose} className="mt-6 rounded-xl bg-[#D5FF00] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[#100422]">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="oswald-500 mb-1 text-2xl text-white">Book This Artist</h3>
                        <p className="mb-6 text-sm text-gray-300">Fill out the form to send a booking request</p>

                        {error && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Your Name *</label>
                                <input type="text" required value={form.name} onChange={e => updateField('name', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Email *</label>
                                <input type="email" required value={form.email} onChange={e => updateField('email', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Event Date *</label>
                                <input type="date" required value={form.eventDate} onChange={e => updateField('eventDate', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Event Type</label>
                                <select value={form.eventType} onChange={e => updateField('eventType', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50">
                                    <option value="">Select type...</option>
                                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Audience Size</label>
                                <select value={form.audienceSize} onChange={e => updateField('audienceSize', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50">
                                    <option value="">Select size...</option>
                                    {AUDIENCE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">City / Venue</label>
                                <input type="text" value={form.cityVenue} onChange={e => updateField('cityVenue', e.target.value)} placeholder="e.g. Toronto, ON" className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D5FF00]/50" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Budget Range</label>
                                <select value={form.budgetRange} onChange={e => updateField('budgetRange', e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white outline-none focus:border-[#D5FF00]/50">
                                    <option value="">Select range...</option>
                                    {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-gray-300">Message</label>
                                <textarea value={form.message} onChange={e => updateField('message', e.target.value)} rows={3} placeholder="Tell the artist about your event..." className="w-full resize-none rounded-lg border border-white/15 bg-[#100422] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D5FF00]/50" />
                            </div>
                            <button type="submit" disabled={submitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D5FF00] py-3 text-sm font-bold uppercase tracking-wider text-[#100422] transition hover:bg-[#c5ef00] disabled:opacity-60">
                                {submitting ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#100422] border-t-transparent" />
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Send Booking Request
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function ArtistProfilePage() {
    const { slug } = useParams()
    const [artist, setArtist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)
    const [showBooking, setShowBooking] = useState(false)
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 600)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const fetchArtist = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/artists/${slug}`)
                if (res.ok) {
                    const data = await res.json()
                    setArtist(data)
                } else {
                    setNotFound(true)
                }
            } catch {
                setNotFound(true)
            }
            setLoading(false)
        }
        fetchArtist()
    }, [slug])

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#070707] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D5FF00] border-t-transparent" />
                    <p className="text-gray-300">Loading artist profile...</p>
                </div>
            </main>
        )
    }

    if (notFound || !artist) {
        return (
            <>
                <SEO title="Artist Not Found" description="The artist profile you're looking for could not be found." />
                <main className="flex min-h-screen flex-col items-center justify-center bg-[#070707] px-6 text-white">
                    <h1 className="oswald-500 text-4xl">Artist Not Found</h1>
                    <p className="mt-4 text-gray-300">The artist profile you're looking for doesn't exist or hasn't been approved yet.</p>
                    <Link to="/artists" className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#D5FF00] px-6 py-3 text-sm font-medium text-[#D5FF00] transition hover:bg-[#D5FF00] hover:text-[#100422]">
                        <ChevronLeft className="h-4 w-4" />
                        Back to Artists
                    </Link>
                </main>
            </>
        )
    }

    const fullName = `${artist.first_name} ${artist.last_name}`
    const seoTitle = `${fullName} | DESIFEST Artist Network`
    const seoDescription = artist.bio
        ? artist.bio.substring(0, 160)
        : `${fullName} — artist from ${artist.city || ''}, ${artist.country || ''}. Part of the DESIFEST Artist Network.`

    const photoUrl = artist.photo_url || `/api/artists/${slug}/photo`
    const hasPhoto = artist.photo_url

    const socialLinks = [
        { url: artist.instagram, icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-400' },
        { url: artist.spotify, icon: FaSpotify, label: 'Spotify', color: 'hover:text-green-400' },
        { url: artist.youtube, icon: FaYoutube, label: 'YouTube', color: 'hover:text-red-400' },
        { url: artist.facebook, icon: FaFacebook, label: 'Facebook', color: 'hover:text-blue-400' },
        { url: artist.tiktok, icon: FaTiktok, label: 'TikTok', color: 'hover:text-pink-300' },
        { url: artist.website, icon: Globe, label: 'Website', color: 'hover:text-[#D5FF00]' },
    ].filter(s => s.url)

    const genres = artist.genre ? (Array.isArray(artist.genre) ? artist.genre : artist.genre.split(',').map(g => g.trim())) : []

    const badges = [
        artist.featured && 'Featured',
        artist.alumni && 'Alumni',
        artist.available_for_gigs && 'Available for Gigs',
    ].filter(Boolean)

    const pastLinks = Array.isArray(artist.past_links) ? artist.past_links : []
    const youtubeLinks = pastLinks.filter(link => {
        const url = typeof link === 'string' ? link : link?.url || ''
        return url.includes('youtube.com') || url.includes('youtu.be')
    })
    const otherLinks = pastLinks.filter(link => {
        const url = typeof link === 'string' ? link : link?.url || ''
        return !url.includes('youtube.com') && !url.includes('youtu.be')
    })
    const extractYouTubeId = (url) => {
        if (typeof url !== 'string') url = url?.url || ''
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : null
    }
    const hasMedia = youtubeLinks.length > 0 || otherLinks.length > 0 || artist.spotify || artist.youtube

    const languages = artist.performance_language
        ? (Array.isArray(artist.performance_language) ? artist.performance_language : artist.performance_language.split(',').map(l => l.trim()))
        : []
    const performanceType = artist.performance_type || ''
    const lookingFor = Array.isArray(artist.looking_for) ? artist.looking_for : []

    const eventTypes = Array.isArray(artist.event_types) ? artist.event_types : []
    const setupOpts = Array.isArray(artist.setup_options) ? artist.setup_options : []
    const achievementsList = Array.isArray(artist.achievements) ? artist.achievements : []
    const preferredVenues = Array.isArray(artist.preferred_venues) ? artist.preferred_venues : []
    const reviews = Array.isArray(artist.reviews) ? artist.reviews : []
    const hasDetails = eventTypes.length > 0 || artist.travel_radius || setupOpts.length > 0 || artist.equipment_notes || preferredVenues.length > 0
    const hasReviews = reviews.length > 0 || artist.avg_rating > 0

    const navItems = [
        { id: 'about', label: 'About' },
        hasDetails && { id: 'details', label: 'Details' },
        hasMedia && { id: 'media', label: 'Media' },
        hasReviews && { id: 'reviews', label: 'Reviews' },
        { id: 'book', label: 'Book' },
    ].filter(Boolean)

    return (
        <>
            <SEO title={seoTitle} description={seoDescription} />
            <main className="relative min-h-screen w-full bg-[#070707] text-white">

                {/* ── HERO ── */}
                <section className="relative w-full overflow-hidden bg-[#070707] pb-0 pt-24">
                    <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">

                        <Link to="/artists" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-300 transition hover:text-[#D5FF00]">
                            <ChevronLeft className="h-4 w-4" />
                            Back to Artists
                        </Link>

                        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#D5FF00]" style={{ minHeight: '520px' }}>
                            <div className="relative flex h-full flex-col lg:flex-row">
                                <div className="relative z-10 flex flex-1 flex-col justify-between p-8 lg:p-12">
                                    <div>
                                        {badges.length > 0 && (
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {badges.map((badge, i) => (
                                                    <span key={i} className="rounded-full bg-[#070707] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D5FF00]">
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <h1 className="oswald-500 text-6xl uppercase leading-[0.9] tracking-tight text-[#070707] md:text-7xl lg:text-[6.5rem]">
                                            {artist.first_name}<br />{artist.last_name}
                                        </h1>

                                        {(artist.city || artist.country) && (
                                            <div className="mt-4 flex items-center gap-2 text-[#070707]/70">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm font-medium uppercase tracking-wider">
                                                    {[artist.city, artist.country].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}

                                        {(artist.tagline || artist.bio || performanceType) && (
                                            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#070707]/70">
                                                {artist.tagline || (artist.bio ? artist.bio.substring(0, 120) + (artist.bio.length > 120 ? '...' : '') : performanceType)}
                                            </p>
                                        )}

                                        {genres.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {genres.map((genre, i) => (
                                                    <span key={i} className="rounded-full border border-[#070707]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#070707]">
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {artist.created_at && (
                                            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-[#070707]/50">
                                                Member since {new Date(artist.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-8 flex items-center gap-6">
                                        {socialLinks.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                {socialLinks.map(({ url, icon: Icon, label }) => (
                                                    <a
                                                        key={label}
                                                        href={url.startsWith('http') ? url : `https://${url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={label}
                                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#070707]/10 text-[#070707] transition hover:bg-[#070707]/20"
                                                    >
                                                        <Icon className="h-4 w-4" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => scrollTo('about')}
                                            className="flex items-center gap-1 text-sm font-medium text-[#070707]/60 transition hover:text-[#070707]"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                            Scroll
                                        </button>
                                    </div>
                                </div>

                                {hasPhoto && (
                                    <div className="relative flex items-end justify-center lg:w-[45%]">
                                        <img
                                            src={photoUrl}
                                            alt={fullName}
                                            className="h-full max-h-[520px] w-full object-cover object-top lg:absolute lg:bottom-0 lg:right-0 lg:h-full lg:w-full"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#D5FF00]/30 to-transparent" />
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#D5FF00] to-transparent" />
                                        <div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: 'linear-gradient(to right, #D5FF00 0%, transparent 30%)' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── WHO AM I / BIO ── */}
                <section id="about" className="w-full bg-[#070707] py-20 lg:py-28">
                    <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                        <div className="mb-12 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <h2 className="oswald-500 text-sm uppercase tracking-[0.3em] text-[#D5FF00]">Who Am I?</h2>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {artist.bio && (
                            <p className="oswald-400 mx-auto max-w-4xl text-center text-2xl leading-relaxed text-white/90 md:text-3xl lg:text-4xl">
                                {artist.bio}
                            </p>
                        )}

                        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {performanceType && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                    <Mic className="mb-3 h-5 w-5 text-[#D5FF00]" />
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-300">Performance Type</p>
                                    <p className="text-lg text-white">{performanceType}</p>
                                </div>
                            )}
                            {languages.length > 0 && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                    <Globe className="mb-3 h-5 w-5 text-[#D5FF00]" />
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-300">Languages</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {languages.map((lang, i) => (
                                            <span key={i} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">{lang}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {artist.is_band !== null && artist.is_band !== undefined && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                    <Users className="mb-3 h-5 w-5 text-[#D5FF00]" />
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-300">Artist Type</p>
                                    <p className="text-lg text-white">{artist.is_band ? 'Band / Group' : 'Solo Artist'}</p>
                                </div>
                            )}
                            {artist.set_length && (
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                    <Calendar className="mb-3 h-5 w-5 text-[#D5FF00]" />
                                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-300">Set Length</p>
                                    <p className="text-lg text-white">{artist.set_length}</p>
                                </div>
                            )}
                        </div>

                        {lookingFor.length > 0 && (
                            <div className="mt-12">
                                <h3 className="oswald-500 mb-4 text-center text-sm uppercase tracking-[0.2em] text-gray-300">Looking For</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {lookingFor.map((item, i) => (
                                        <span key={i} className="rounded-full border border-[#D5FF00]/30 bg-[#D5FF00]/10 px-5 py-2.5 text-sm font-medium text-[#D5FF00]">{item}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ── DETAILS: Events, Travel, Setup, Equipment ── */}
                {hasDetails && (
                    <section id="details" className="w-full bg-[#0e0e0e] py-20 lg:py-28">
                        <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <h2 className="oswald-500 text-sm uppercase tracking-[0.3em] text-[#D5FF00]">Performance Details</h2>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="grid gap-8 lg:grid-cols-2">
                                {eventTypes.length > 0 && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Event Types</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {eventTypes.map((et, i) => (
                                                <span key={i} className="rounded-full border border-[#D5FF00]/20 bg-[#D5FF00]/5 px-4 py-1.5 text-sm text-[#D5FF00]">{et}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {artist.travel_radius && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Plane className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Travel</h3>
                                        </div>
                                        <p className="mb-2 text-sm font-medium capitalize text-white">
                                            {artist.travel_radius === 'local' && 'Local Area'}
                                            {artist.travel_radius === 'regional' && 'Regional (Province/State)'}
                                            {artist.travel_radius === 'national' && 'National (Across Canada)'}
                                            {artist.travel_radius === 'international' && 'International'}
                                        </p>
                                        {artist.travel_notes && (
                                            <p className="text-sm leading-relaxed text-gray-300">{artist.travel_notes}</p>
                                        )}
                                    </div>
                                )}

                                {setupOpts.length > 0 && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Mic className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Setup Options</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {setupOpts.map((opt, i) => (
                                                <span key={i} className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white">{opt}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {artist.equipment_notes && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Wrench className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Equipment & Tech</h3>
                                        </div>
                                        <p className="text-sm leading-relaxed text-gray-300">{artist.equipment_notes}</p>
                                        {artist.technical_requirements && (
                                            <p className="mt-3 text-sm leading-relaxed text-gray-300">{artist.technical_requirements}</p>
                                        )}
                                    </div>
                                )}

                                {preferredVenues.length > 0 && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Building className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Preferred Venues</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {preferredVenues.map((v, i) => (
                                                <span key={i} className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white">{v}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(artist.avg_response_time || artist.collaboration_open) && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-[#D5FF00]" />
                                            <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Quick Info</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {artist.avg_response_time && (
                                                <div className="flex items-center gap-2">
                                                    <MessageSquare className="h-4 w-4 text-gray-300" />
                                                    <span className="text-sm text-gray-300">Avg. response time: <span className="text-white">{artist.avg_response_time}</span></span>
                                                </div>
                                            )}
                                            {artist.collaboration_open && (
                                                <div className="flex items-center gap-2">
                                                    <Handshake className="h-4 w-4 text-green-400" />
                                                    <span className="text-sm text-green-400">Open to collaborations</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {achievementsList.length > 0 && (
                                <div className="mt-12">
                                    <div className="mb-6 flex items-center gap-3">
                                        <Award className="h-5 w-5 text-[#D5FF00]" />
                                        <h3 className="oswald-500 text-lg uppercase tracking-wider text-white">Achievements & Press</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {achievementsList.map((item, i) => (
                                            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-3">
                                                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D5FF00]" />
                                                <span className="text-sm text-gray-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── MEDIA / DISCOGRAPHY ── */}
                {hasMedia && (
                    <section id="media" className="w-full bg-[#0e0e0e] py-20 lg:py-28">
                        <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <h2 className="oswald-500 text-sm uppercase tracking-[0.3em] text-[#D5FF00]">Discography & Media</h2>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            {youtubeLinks.length > 0 && (
                                <div className="mb-12">
                                    <div className={`grid gap-6 ${youtubeLinks.length === 1 ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'}`}>
                                        {youtubeLinks.map((link, i) => {
                                            const videoId = extractYouTubeId(link)
                                            if (!videoId) return null
                                            return (
                                                <div key={i} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/20">
                                                    <div className="relative aspect-video">
                                                        <iframe
                                                            src={`https://www.youtube.com/embed/${videoId}`}
                                                            title={`Video ${i + 1}`}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                            className="h-full w-full"
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {(artist.spotify || artist.youtube) && (
                                <div className="mb-12 grid gap-4 md:grid-cols-2">
                                    {artist.spotify && (
                                        <a
                                            href={artist.spotify.startsWith('http') ? artist.spotify : `https://${artist.spotify}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-green-500/30 hover:bg-green-500/5"
                                        >
                                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                                                <FaSpotify className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Listen on Spotify</p>
                                                <p className="text-sm text-gray-300">Stream music and playlists</p>
                                            </div>
                                        </a>
                                    )}
                                    {artist.youtube && (
                                        <a
                                            href={artist.youtube.startsWith('http') ? artist.youtube : `https://${artist.youtube}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-red-500/30 hover:bg-red-500/5"
                                        >
                                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                                <FaYoutube className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Watch on YouTube</p>
                                                <p className="text-sm text-gray-300">Videos and performances</p>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            )}

                            {otherLinks.length > 0 && (
                                <div className="space-y-3">
                                    {otherLinks.map((link, i) => {
                                        const url = typeof link === 'string' ? link : link?.url || ''
                                        if (!url) return null
                                        return (
                                            <a
                                                key={i}
                                                href={url.startsWith('http') ? url : `https://${url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-gray-300 transition hover:border-[#D5FF00]/30 hover:text-white"
                                            >
                                                <Play className="h-4 w-4 text-[#D5FF00]" />
                                                {url}
                                            </a>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── REVIEWS ── */}
                {hasReviews && (
                    <section id="reviews" className="w-full bg-[#070707] py-20 lg:py-28">
                        <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                            <div className="mb-12 flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/10" />
                                <h2 className="oswald-500 text-sm uppercase tracking-[0.3em] text-[#D5FF00]">Reviews</h2>
                                <div className="h-px flex-1 bg-white/10" />
                            </div>

                            {artist.avg_rating > 0 && (
                                <div className="mb-10 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} className={`h-6 w-6 ${s <= Math.round(artist.avg_rating) ? 'fill-[#D5FF00] text-[#D5FF00]' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <p className="text-lg text-white">
                                        <span className="font-bold">{artist.avg_rating}</span>
                                        <span className="text-gray-300"> / 5</span>
                                        <span className="ml-2 text-sm text-gray-300">({artist.review_count} {artist.review_count === 1 ? 'review' : 'reviews'})</span>
                                    </p>
                                </div>
                            )}

                            {reviews.length > 0 && (
                                <div className="space-y-6">
                                    {reviews.map((r, i) => (
                                        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                            <div className="mb-3 flex flex-wrap items-center gap-4">
                                                <span className="font-medium text-white">{r.reviewer_name}</span>
                                                {r.event_type && (
                                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">{r.event_type}</span>
                                                )}
                                                {r.event_date && (
                                                    <span className="text-xs text-gray-300">{new Date(r.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                                )}
                                                <div className="flex items-center gap-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? 'fill-[#D5FF00] text-[#D5FF00]' : 'text-gray-600'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm leading-relaxed text-gray-300">{r.review_text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* ── BOOKING CTA ── */}
                <section id="book" className="w-full bg-[#070707] py-12 lg:py-16">
                    <div className="mx-auto w-full max-w-3xl px-4 pl-20 text-center md:pl-28 lg:pl-12">
                        <h2 className="oswald-500 text-4xl uppercase text-white md:text-5xl lg:text-6xl">
                            Ready to<br />
                            <span className="text-[#D5FF00]">Book {artist.first_name}?</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-lg text-gray-300">
                            Send a booking request and {artist.first_name} will get back to you with availability and details.
                        </p>

                        {artist.starting_price && (
                            <p className="mt-4 text-sm text-gray-300">
                                Starting from <span className="font-semibold text-[#D5FF00]">${artist.starting_price}</span>
                                {artist.price_type && <span> / {artist.price_type}</span>}
                            </p>
                        )}

                        <button
                            onClick={() => setShowBooking(true)}
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#D5FF00] px-10 py-4 text-base font-bold uppercase tracking-wider text-[#070707] transition hover:bg-[#c5ef00]"
                        >
                            <Send className="h-5 w-5" />
                            Send Booking Request
                        </button>

                        {artist.available_for_gigs && (
                            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-green-400">
                                <span className="h-2 w-2 rounded-full bg-green-400" />
                                Currently available for bookings
                            </p>
                        )}
                        {artist.avg_response_time && (
                            <p className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-300">
                                <Clock className="h-3.5 w-3.5" />
                                Avg. response time: {artist.avg_response_time}
                            </p>
                        )}
                    </div>
                </section>

                {/* ── FOOTER SPACER ── */}
                <div className="h-2 bg-[#070707]" />

                {/* ── SCROLL TO TOP ── */}
                {showScrollTop && (
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#D5FF00] text-[#070707] shadow-lg transition-all hover:scale-110 hover:bg-[#c5ef00]"
                        aria-label="Scroll to top"
                    >
                        <ChevronDown className="h-5 w-5 rotate-180" />
                    </button>
                )}

                {/* ── BOOKING MODAL ── */}
                {showBooking && (
                    <BookingModal artist={artist} slug={slug} onClose={() => setShowBooking(false)} />
                )}
            </main>
        </>
    )
}
