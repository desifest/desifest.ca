import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music, Users, Calendar, Star, Shield, MapPin, ArrowRight, Mic2, Search, UserPlus, Send, CheckCircle, ClipboardList, LogOut } from 'lucide-react'
import SEO from '@/Components/SEO'
import { useAuth } from '@/context/AuthContext'
import ArtistCard from '@/Components/Artist/ArtistCard'
import ContactForm from '@/Components/Home/ContactForm'

const BookingPage = () => {
    const { user, loading: authLoading, logout } = useAuth()
    const navigate = useNavigate()
    const [artists, setArtists] = useState([])
    const [stats, setStats] = useState({ total: 0, genres: 0, cities: 0 })
    const [loadingArtists, setLoadingArtists] = useState(true)

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await fetch('/api/artists?sort_by=featured&limit=6')
                if (res.ok) {
                    const data = await res.json()
                    const list = Array.isArray(data) ? data : (data.artists || [])
                    setArtists(list)
                    const genreSet = new Set()
                    const citySet = new Set()
                    list.forEach(a => {
                        if (a.genre) {
                            const g = Array.isArray(a.genre) ? a.genre : a.genre.split(',').map(s => s.trim())
                            g.forEach(genre => genre && genreSet.add(genre))
                        }
                        if (a.city) citySet.add(a.city)
                    })
                    const total = data.total || list.length
                    setStats({ total, genres: genreSet.size || 8, cities: citySet.size || 7 })
                }
            } catch (e) {
                console.error('Failed to fetch artists:', e)
            }
            setLoadingArtists(false)
        }
        fetchArtists()
    }, [])

    return (
        <div className="relative min-h-screen w-full overflow-clip bg-[#100422]">
            <SEO
                title="Community — Artist Network"
                description="Join the DESIFEST Artist Network. South Asian artists: build your profile and get booked. Event organizers: discover and book verified talent across Canada."
            />

            <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-24 md:pt-28">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#100422] to-[#0a0118]" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-[#D5FF00]/10 blur-3xl" />
                    <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    {!authLoading && !user && (
                        <div className="mb-8 flex items-center justify-end gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                            <Link
                                to="/login"
                                className="rounded-lg border border-white/20 px-5 py-2 text-sm font-medium text-gray-200 transition hover:border-white/40 hover:text-white"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-lg bg-[#D5FF00] px-5 py-2 text-sm font-bold text-[#100422] transition hover:bg-[#c5ef00]"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}

                    {!authLoading && user && (
                        <div className="mb-8 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D5FF00] text-sm font-bold text-[#100422]">
                                    {(user.firstName || user.email || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                                    </p>
                                    <p className="text-xs capitalize text-gray-400">{user.role} account</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="rounded-lg bg-[#D5FF00] px-4 py-2 text-sm font-bold text-[#100422] transition hover:bg-[#c5ef00]"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-sm text-gray-300 transition hover:border-white/40 hover:text-white"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-block rounded-full border border-[#D5FF00]/30 bg-[#D5FF00]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D5FF00]">
                                New Platform
                            </div>
                            <h1 className="oswald-500 text-4xl leading-tight text-white uppercase md:text-6xl lg:text-7xl">
                                Join the <span className="text-[#D5FF00]">DESIFEST</span><br />
                                Artist Network
                            </h1>
                            <p className="dm-sans-400 mt-6 max-w-lg text-base leading-relaxed text-gray-300 md:text-lg">
                                Canada's first booking platform for South Asian artists.
                                Build your profile, get discovered, and book verified talent for any event.
                            </p>

                            {!authLoading && !user && (
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        Join as Artist
                                    </button>
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg border-2 border-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#D5FF00] transition hover:bg-[#D5FF00]/10"
                                    >
                                        Book an Artist
                                    </button>
                                </div>
                            )}

                            {!authLoading && user && user.role === 'artist' && (
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        My Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg border-2 border-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#D5FF00] transition hover:bg-[#D5FF00]/10"
                                    >
                                        Browse Artists
                                    </button>
                                </div>
                            )}

                            {!authLoading && user && user.role === 'client' && (
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        Browse Artists
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="oswald-500 rounded-lg border-2 border-[#D5FF00] px-8 py-3.5 text-lg uppercase tracking-wide text-[#D5FF00] transition hover:bg-[#D5FF00]/10"
                                    >
                                        My Bookings
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Mic2, label: 'Musicians', count: '50+' },
                                        { icon: Users, label: 'DJs & Bands', count: '20+' },
                                        { icon: MapPin, label: 'Cities', count: '7+' },
                                        { icon: Star, label: 'Genres', count: '8+' },
                                    ].map(({ icon: Icon, label, count }) => (
                                        <div key={label} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:border-[#D5FF00]/30">
                                            <Icon className="mb-3 h-8 w-8 text-[#D5FF00]" />
                                            <span className="oswald-500 text-2xl text-white">{count}</span>
                                            <span className="dm-sans-400 mt-1 text-xs text-gray-400">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-20 md:py-28">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="mb-16 text-center">
                        <h2 className="oswald-500 text-3xl uppercase text-white md:text-5xl">
                            How It <span className="text-[#D5FF00]">Works</span>
                        </h2>
                        <p className="dm-sans-400 mx-auto mt-4 max-w-xl text-gray-400">
                            Whether you're an artist looking for gigs or an event organizer booking talent, we've got you covered.
                        </p>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent p-8">
                            <div className="mb-6 inline-block rounded-full bg-[#D5FF00]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D5FF00]">
                                For Artists
                            </div>
                            <div className="space-y-8">
                                {[
                                    { icon: UserPlus, step: '01', title: 'Create Your Profile', desc: 'Sign up, add your bio, press photos, music links, and set your pricing.' },
                                    { icon: Shield, step: '02', title: 'Get Verified', desc: 'Desifest reviews and approves your profile with a verified badge.' },
                                    { icon: Calendar, step: '03', title: 'Get Booked', desc: 'Receive booking requests directly from event organizers across Canada.' },
                                ].map(({ icon: Icon, step, title, desc }) => (
                                    <div key={step} className="flex gap-5">
                                        <div className="flex flex-shrink-0 flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D5FF00]/10 text-[#D5FF00]">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {step !== '03' && <div className="mt-2 h-full w-px bg-white/10" />}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-[#D5FF00]/60">STEP {step}</span>
                                            <h3 className="oswald-500 mt-1 text-lg text-white">{title}</h3>
                                            <p className="dm-sans-400 mt-1 text-sm leading-relaxed text-gray-400">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#D5FF00]/5 to-transparent p-8">
                            <div className="mb-6 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                                For Event Organizers
                            </div>
                            <div className="space-y-8">
                                {[
                                    { icon: Search, step: '01', title: 'Browse & Discover', desc: 'Search artists by genre, city, availability, and price range.' },
                                    { icon: Send, step: '02', title: 'Send a Request', desc: 'Pick your date, event type, budget, and send a booking request.' },
                                    { icon: CheckCircle, step: '03', title: 'Confirm & Book', desc: 'Artist responds with availability. Confirm and you\'re all set.' },
                                ].map(({ icon: Icon, step, title, desc }) => (
                                    <div key={step} className="flex gap-5">
                                        <div className="flex flex-shrink-0 flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {step !== '03' && <div className="mt-2 h-full w-px bg-white/10" />}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-white/40">STEP {step}</span>
                                            <h3 className="oswald-500 mt-1 text-lg text-white">{title}</h3>
                                            <p className="dm-sans-400 mt-1 text-sm leading-relaxed text-gray-400">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {artists.length > 0 && (
                <section className="relative py-20 md:py-28">
                    <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <h2 className="oswald-500 text-3xl uppercase text-white md:text-5xl">
                                    Featured <span className="text-[#D5FF00]">Artists</span>
                                </h2>
                                <p className="dm-sans-400 mt-3 text-gray-400">
                                    Discover verified South Asian talent from across Canada.
                                </p>
                            </div>
                            <Link
                                to="/artists"
                                className="dm-sans-400 hidden items-center gap-2 rounded-full border border-[#D5FF00] px-6 py-2.5 text-sm text-[#D5FF00] transition hover:bg-[#D5FF00] hover:text-[#100422] md:flex"
                            >
                                View All Artists <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {artists.slice(0, 6).map(artist => (
                                <ArtistCard key={artist.slug} artist={artist} />
                            ))}
                        </div>

                        <div className="mt-8 text-center md:hidden">
                            <Link
                                to="/artists"
                                className="dm-sans-400 inline-flex items-center gap-2 rounded-full border border-[#D5FF00] px-6 py-2.5 text-sm text-[#D5FF00] transition hover:bg-[#D5FF00] hover:text-[#100422]"
                            >
                                View All Artists <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="relative py-20 md:py-28">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="mb-16 text-center">
                        <h2 className="oswald-500 text-3xl uppercase text-white md:text-5xl">
                            Why <span className="text-[#D5FF00]">DESIFEST</span>
                        </h2>
                    </div>

                    <div className="grid gap-12 lg:grid-cols-2">
                        <div>
                            <h3 className="oswald-500 mb-8 text-2xl uppercase text-[#D5FF00]">For Artists</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Star, title: 'Professional Profile', desc: 'A polished public profile on Canada\'s biggest South Asian music platform.' },
                                    { icon: Users, title: 'Real Visibility', desc: 'Get discovered by event organizers, corporate planners, and wedding coordinators.' },
                                    { icon: ClipboardList, title: 'Booking Management', desc: 'Accept, decline, or counter-offer — manage every request from your dashboard.' },
                                    { icon: Shield, title: 'Desifest Credibility', desc: '20 years of cultural leadership. A verified badge that carries weight.' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-4 rounded-xl border border-white/5 bg-white/3 p-5 transition hover:border-white/15">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#D5FF00]/10">
                                            <Icon className="h-5 w-5 text-[#D5FF00]" />
                                        </div>
                                        <div>
                                            <h4 className="oswald-500 text-base text-white">{title}</h4>
                                            <p className="dm-sans-400 mt-1 text-sm text-gray-400">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="oswald-500 mb-8 text-2xl uppercase text-white">For Event Organizers</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, title: 'Verified Talent', desc: 'Every artist is reviewed and approved by the Desifest team before going live.' },
                                    { icon: Music, title: 'Every Genre Covered', desc: 'Bhangra, Bollywood, Hip Hop, Classical, Folk, DJ, Spoken Word, Dance — all in one place.' },
                                    { icon: MapPin, title: 'Artists Across Canada', desc: 'Toronto, Vancouver, Montreal, Calgary, Ottawa, Hamilton, Durham — and growing.' },
                                    { icon: Calendar, title: 'Simple Booking', desc: 'Pick a date, send a request, get a response. No agencies, no middlemen.' },
                                ].map(({ icon: Icon, title, desc }) => (
                                    <div key={title} className="flex gap-4 rounded-xl border border-white/5 bg-white/3 p-5 transition hover:border-white/15">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                                            <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="oswald-500 text-base text-white">{title}</h4>
                                            <p className="dm-sans-400 mt-1 text-sm text-gray-400">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-16">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                        {[
                            { value: stats.total > 0 ? `${stats.total}+` : '50+', label: 'Registered Artists' },
                            { value: stats.cities > 0 ? `${stats.cities}+` : '7+', label: 'Cities Across Canada' },
                            { value: stats.genres > 0 ? `${stats.genres}+` : '8+', label: 'Music Genres' },
                            { value: '20', label: 'Years of Desifest' },
                        ].map(({ value, label }) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center md:p-8">
                                <div className="oswald-500 text-3xl text-[#D5FF00] md:text-5xl">{value}</div>
                                <div className="dm-sans-400 mt-2 text-xs uppercase tracking-wider text-gray-400 md:text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-20 md:py-28">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#1a0a2e] to-[#2C223C] p-8 text-center md:p-16">
                        <h2 className="oswald-500 text-3xl uppercase text-white md:text-5xl">
                            Ready to <span className="text-[#D5FF00]">Get Started?</span>
                        </h2>
                        <p className="dm-sans-400 mx-auto mt-4 max-w-lg text-gray-400">
                            Join the only booking platform built for South Asian artists in Canada. Free to sign up.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                            {!authLoading && !user && (
                                <>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-10 py-4 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        Create Your Account
                                    </button>
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg border-2 border-white/30 px-10 py-4 text-lg uppercase tracking-wide text-white transition hover:border-white hover:bg-white/5"
                                    >
                                        Browse Artists
                                    </button>
                                </>
                            )}
                            {!authLoading && user && user.role === 'artist' && (
                                <>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-10 py-4 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        Go to Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg border-2 border-white/30 px-10 py-4 text-lg uppercase tracking-wide text-white transition hover:border-white hover:bg-white/5"
                                    >
                                        Browse Artists
                                    </button>
                                </>
                            )}
                            {!authLoading && user && user.role === 'client' && (
                                <>
                                    <button
                                        onClick={() => navigate('/artists')}
                                        className="oswald-500 rounded-lg bg-[#D5FF00] px-10 py-4 text-lg uppercase tracking-wide text-[#100422] transition hover:bg-[#c5ef00]"
                                    >
                                        Browse Artists
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="oswald-500 rounded-lg border-2 border-white/30 px-10 py-4 text-lg uppercase tracking-wide text-white transition hover:border-white hover:bg-white/5"
                                    >
                                        My Bookings
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative border-t border-white/10 py-16">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="mb-8 text-center">
                        <h2 className="oswald-500 text-2xl uppercase text-white md:text-3xl">
                            More from Our <span className="text-[#D5FF00]">Community</span>
                        </h2>
                        <p className="dm-sans-400 mt-2 text-gray-400">
                            Explore our year-round programs for emerging artists.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Link
                            to="/open-mic"
                            className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#D5FF00]/30 hover:bg-white/8"
                        >
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#022195] text-white">
                                <Mic2 className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="oswald-500 text-lg text-white group-hover:text-[#D5FF00]">Open Mic</h3>
                                <p className="dm-sans-400 mt-1 text-sm text-gray-400">A stage for emerging voices. Perform, connect, and grow.</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-500 transition group-hover:translate-x-1 group-hover:text-[#D5FF00]" />
                        </Link>

                        <Link
                            to="/sofa-session"
                            className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-[#D5FF00]/30 hover:bg-white/8"
                        >
                            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#6108AA] text-white">
                                <Music className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="oswald-500 text-lg text-white group-hover:text-[#D5FF00]">Sofa Sessions</h3>
                                <p className="dm-sans-400 mt-1 text-sm text-gray-400">Intimate live performances. Up close and personal.</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-500 transition group-hover:translate-x-1 group-hover:text-[#D5FF00]" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="relative">
                <div className="mx-auto w-full max-w-7xl pl-14 md:pl-20">
                    <ContactForm />
                </div>
            </section>

            <style>{`
@keyframes marquee-ltr {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-rtl {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
            `}</style>
        </div>
    )
}

export default BookingPage
