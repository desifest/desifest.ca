import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Edit3, Plus, ChevronLeft, ChevronUp, ChevronDown, Save, Upload, Eye, EyeOff, X, FileText, Layout, Inbox, Film, Download, Star, Sparkles, Wand2, ImagePlus, ArrowRight, RotateCcw, Check, Bold, Italic, Link2, Heading, ListOrdered, Play, Clock, CheckCircle, AlertCircle, Calendar, Shield, Award, Music, Globe, Tag, ExternalLink, User, DollarSign, BarChart3, MessageSquare, BookOpen, Send, ThumbsUp, ThumbsDown, Hash, TrendingUp, Users, Mail } from 'lucide-react'

const assetModules = import.meta.glob('/src/Assets/**/*.{png,jpg,jpeg,svg,webp}', { eager: true })
const assetMap = {}
for (const [path, mod] of Object.entries(assetModules)) {
    assetMap[path] = mod.default
}
function asset(path) {
    return assetMap[`/src/Assets/${path}`] || ''
}

const API_BASE = ''

function useAdminFetch(url, token, deps = []) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const refetch = useCallback(() => {
        if (!token) return
        setLoading(true)
        setError('')
        fetch(`${API_BASE}${url}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => {
                if (r.status === 401) throw new Error('Unauthorized')
                return r.json()
            })
            .then(d => { setData(d); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [url, token])

    useEffect(() => { refetch() }, [refetch, ...deps])
    return { data, loading, error, refetch }
}

export default function AdminPage() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [authError, setAuthError] = useState('')
    const [activeSection, setActiveSection] = useState('analytics')
    const [activeSubmissionTab, setActiveSubmissionTab] = useState('contacts')

    const token = authenticated ? sessionStorage.getItem('adminToken') : null

    const handleLogin = (e) => {
        e.preventDefault()
        sessionStorage.setItem('adminToken', password)
        setAuthenticated(true)
        setAuthError('')
    }

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken')
        setAuthenticated(false)
        setPassword('')
        navigate('/')
    }

    const handleUnauthorized = () => {
        setAuthenticated(false)
        sessionStorage.removeItem('adminToken')
        setAuthError('Session expired. Please login again.')
    }

    if (!authenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#100422] px-4">
                <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                    <h1 className="oswald-500 text-center text-3xl uppercase text-white">Admin Login</h1>
                    {authError && <p className="text-center text-sm text-red-400">{authError}</p>}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        className="w-full border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-[#D5FF00] focus:outline-none"
                        required
                    />
                    <button type="submit" className="w-full bg-[#D5FF00] py-3 font-semibold uppercase text-black transition hover:opacity-90">
                        Login
                    </button>
                </form>
            </div>
        )
    }

    const sidebarItems = [
        { key: 'analytics', label: 'Analytics', icon: BarChart3 },
        { key: 'submissions', label: 'Submissions', icon: Inbox },
        { key: 'bookings', label: 'Bookings', icon: BookOpen },
        { key: 'commissions', label: 'Commissions', icon: DollarSign },
        { key: 'featured', label: 'Featured Artists', icon: Star },
        { key: 'reviews', label: 'Reviews', icon: MessageSquare },
        { key: 'blogs', label: 'Blogs', icon: FileText },
        { key: 'queue', label: 'Content Queue', icon: ListOrdered },
        { key: 'pages', label: 'Pages', icon: Layout },
    ]

    return (
        <div className="flex h-screen bg-[#100422]">
            <aside className="sticky top-0 flex h-screen w-56 flex-shrink-0 flex-col border-r border-white/10 bg-[#0a0118]">
                <div className="p-4">
                    <h2 className="oswald-500 text-xl uppercase text-white">Admin</h2>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-2">
                    {sidebarItems.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveSection(key)}
                            className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium transition ${
                                activeSection === key
                                    ? 'bg-[#D5FF00]/10 text-[#D5FF00]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="border-t border-white/10 p-3">
                    <button onClick={handleLogout} className="w-full rounded px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-auto p-6 text-white md:p-10">
                {activeSection === 'analytics' && (
                    <AnalyticsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'submissions' && (
                    <SubmissionsSection token={token} activeTab={activeSubmissionTab} setActiveTab={setActiveSubmissionTab} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'bookings' && (
                    <BookingsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'commissions' && (
                    <CommissionsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'featured' && (
                    <FeaturedArtistsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'reviews' && (
                    <ReviewsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'blogs' && (
                    <BlogsSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'queue' && (
                    <QueueSection token={token} onUnauthorized={handleUnauthorized} />
                )}
                {activeSection === 'pages' && (
                    <PagesSection token={token} onUnauthorized={handleUnauthorized} />
                )}
            </main>
        </div>
    )
}

const submissionTabs = [
    { key: 'contacts', label: 'Contact Messages', endpoint: '/api/admin/contacts' },
    { key: 'artists', label: 'Festival Submissions', endpoint: '/api/admin/artists?source=festival' },
    { key: 'booking_artists', label: 'Booking Artists', endpoint: '/api/admin/artists?source=booking' },
    { key: 'volunteers', label: 'Volunteer Signups', endpoint: '/api/admin/volunteers' },
    { key: 'newsletter', label: 'Newsletter Subs', endpoint: '/api/admin/newsletter' },
]

function exportToCSV(data, columns, filename) {
    if (!data || data.length === 0) return
    const allKeys = Object.keys(data[0])
    const header = allKeys.join(',')
    const rows = data.map(row =>
        allKeys.map(k => {
            let val = row[k]
            if (val === null || val === undefined) val = ''
            if (Array.isArray(val)) val = val.join('; ')
            if (typeof val === 'boolean') val = val ? 'Yes' : 'No'
            val = String(val).replace(/"/g, '""')
            return `"${val}"`
        }).join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
}

function getDetailFields(tab) {
    switch (tab) {
        case 'contacts':
            return [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'message', label: 'Message' },
                { key: 'consent', label: 'Consent' },
                { key: 'created_at', label: 'Submitted' },
            ]
        case 'artists':
        case 'booking_artists':
            return [
                { key: 'event', label: 'Event' },
                { key: 'first_name', label: 'First Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone_code', label: 'Phone Code' },
                { key: 'phone', label: 'Phone' },
                { key: 'address', label: 'Address' },
                { key: 'city', label: 'City' },
                { key: 'province', label: 'Province' },
                { key: 'postal_code', label: 'Postal Code' },
                { key: 'country', label: 'Country' },
                { key: 'facebook', label: 'Facebook' },
                { key: 'youtube', label: 'YouTube' },
                { key: 'instagram', label: 'Instagram' },
                { key: 'tiktok', label: 'TikTok' },
                { key: 'spotify', label: 'Spotify' },
                { key: 'website', label: 'Website' },
                { key: 'genre', label: 'Genre' },
                { key: 'other_genre', label: 'Other Genre' },
                { key: 'performance_language', label: 'Performance Language' },
                { key: 'is_band', label: 'Band/Group' },
                { key: 'performed_before', label: 'Performed Before' },
                { key: 'performance_type', label: 'Performance Type' },
                { key: 'socan_registered', label: 'SOCAN Registered' },
                { key: 'manager_first_name', label: 'Manager First Name' },
                { key: 'manager_last_name', label: 'Manager Last Name' },
                { key: 'manager_email', label: 'Manager Email' },
                { key: 'manager_phone_code', label: 'Manager Phone Code' },
                { key: 'manager_phone', label: 'Manager Phone' },
                { key: 'past_links', label: 'Past Performance Links' },
                { key: 'ideas', label: 'Ideas / Additional Info' },
                { key: 'consent', label: 'Consent' },
                { key: 'created_at', label: 'Submitted' },
            ]
        case 'volunteers':
            return [
                { key: 'first_name', label: 'First Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone_code', label: 'Phone Code' },
                { key: 'phone', label: 'Phone' },
                { key: 'address', label: 'Address' },
                { key: 'city', label: 'City' },
                { key: 'province', label: 'Province' },
                { key: 'postal_code', label: 'Postal Code' },
                { key: 'country', label: 'Country' },
                { key: 'genre', label: 'Availability' },
                { key: 'how_can_you_help', label: 'How Can You Help' },
                { key: 'how_can_we_help_you', label: 'How Can We Help You' },
                { key: 'consent', label: 'Consent' },
                { key: 'created_at', label: 'Submitted' },
            ]
        case 'newsletter':
            return [
                { key: 'first_name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'created_at', label: 'Subscribed' },
            ]
        default:
            return []
    }
}

const LOOKING_FOR_OPTIONS = ['Producer', 'Vocalist', 'DJ', 'Live Band', 'Videographer', 'Songwriter', 'Mixing Engineer', 'Photographer', 'Manager', 'Collaborator']

function ArtistProfilePanel({ row, token, onUpdate, onDelete }) {
    const [profileApproved, setProfileApproved] = useState(!!row.profile_approved)
    const [featured, setFeatured] = useState(!!row.featured)
    const [alumni, setAlumni] = useState(!!row.alumni)
    const [bio, setBio] = useState(row.bio || '')
    const [lookingFor, setLookingFor] = useState(Array.isArray(row.looking_for) ? row.looking_for : [])
    const [availableForGigs, setAvailableForGigs] = useState(!!row.available_for_gigs)
    const [slug, setSlug] = useState(row.slug || '')
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')
    const [pressPhotoPreview, setPressPhotoPreview] = useState(row.has_press_photo && row.slug ? `/api/artists/${row.slug}/photo` : null)
    const [showRequestInfo, setShowRequestInfo] = useState(false)
    const [requestInfoMsg, setRequestInfoMsg] = useState('')
    const [sendingInfo, setSendingInfo] = useState(false)
    const [requestInfoStatus, setRequestInfoStatus] = useState('')
    const [deleting, setDeleting] = useState(false)

    const toggleLookingFor = (tag) => {
        setLookingFor(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    const handlePressPhotoUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setPressPhotoPreview(ev.target.result)
        }
        reader.readAsDataURL(file)
    }

    const handleRequestInfo = async () => {
        if (!requestInfoMsg.trim()) return
        setSendingInfo(true)
        setRequestInfoStatus('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/artists/${row.id}/request-info`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: requestInfoMsg.trim() }),
            })
            const data = await res.json()
            if (res.ok) {
                setRequestInfoStatus('Email sent successfully!')
                setRequestInfoMsg('')
                setShowRequestInfo(false)
            } else {
                setRequestInfoStatus(data.error || 'Failed to send email')
            }
        } catch (e) {
            setRequestInfoStatus('Failed to send email')
        }
        setSendingInfo(false)
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        setSaveMsg('')
        try {
            const body = {
                profile_approved: profileApproved,
                featured,
                alumni,
                bio,
                looking_for: lookingFor,
                available_for_gigs: availableForGigs,
                slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, ''),
            }
            if (pressPhotoPreview && pressPhotoPreview.startsWith('data:')) {
                body.press_photo = pressPhotoPreview
            }
            const res = await fetch(`${API_BASE}/api/admin/artists/${row.id}/profile`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            const data = await res.json()
            if (res.ok) {
                setSaveMsg('Profile saved!')
                if (onUpdate) onUpdate(data)
            } else {
                setSaveMsg(data.error || 'Failed to save')
            }
        } catch (e) {
            setSaveMsg('Failed to save profile')
        }
        setSaving(false)
    }

    return (
        <div className="space-y-4 border-t border-white/10 pt-4 mt-4">
            <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#D5FF00]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">Artist Profile Management</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                    type="button"
                    onClick={() => setProfileApproved(!profileApproved)}
                    className={`flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition ${
                        profileApproved
                            ? 'border-green-500/40 bg-green-500/10 text-green-400'
                            : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Shield className="h-4 w-4" />
                    {profileApproved ? 'Approved' : 'Not Approved'}
                </button>
                <button
                    type="button"
                    onClick={() => setFeatured(!featured)}
                    className={`flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition ${
                        featured
                            ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                            : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Star className={`h-4 w-4 ${featured ? 'fill-yellow-400' : ''}`} />
                    {featured ? 'Featured' : 'Not Featured'}
                </button>
                <button
                    type="button"
                    onClick={() => setAlumni(!alumni)}
                    className={`flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition ${
                        alumni
                            ? 'border-purple-500/40 bg-purple-500/10 text-purple-400'
                            : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Award className="h-4 w-4" />
                    {alumni ? 'Alumni' : 'Not Alumni'}
                </button>
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Bio</label>
                <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    placeholder="Artist bio for public profile..."
                    className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                />
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Press Photo</label>
                <div className="flex items-center gap-3">
                    {pressPhotoPreview && (
                        <img src={pressPhotoPreview} alt="Press photo" className="h-16 w-16 rounded-full border border-white/10 object-cover" />
                    )}
                    <label className="flex cursor-pointer items-center gap-2 rounded border border-white/20 px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                        <Upload className="h-4 w-4" />
                        {pressPhotoPreview ? 'Replace Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" onChange={handlePressPhotoUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Looking For</label>
                <div className="flex flex-wrap gap-2">
                    {LOOKING_FOR_OPTIONS.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleLookingFor(tag)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                lookingFor.includes(tag)
                                    ? 'border-[#D5FF00]/40 bg-[#D5FF00]/10 text-[#D5FF00]'
                                    : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => setAvailableForGigs(!availableForGigs)}
                    className={`flex items-center gap-2 rounded border px-3 py-2 text-sm font-medium transition ${
                        availableForGigs
                            ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                            : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                    <Music className="h-4 w-4" />
                    {availableForGigs ? 'Available for Gigs' : 'Not Available for Gigs'}
                </button>
            </div>

            <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">Profile URL Slug</label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">/artists/</span>
                    <input
                        type="text"
                        value={slug}
                        onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="artist-name"
                        className="flex-1 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                    />
                    {slug && profileApproved && (
                        <a href={`/artists/${slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:underline">
                            View <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
                {slug && !profileApproved && (
                    <p className="mt-1 text-xs text-gray-500">Profile not visible until approved</p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#D5FF00] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                    onClick={() => setShowRequestInfo(!showRequestInfo)}
                    className="flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10"
                >
                    <Send className="h-4 w-4" />
                    Request More Info
                </button>
                <button
                    onClick={async () => {
                        if (!confirm(`Are you sure you want to permanently delete ${row.first_name} ${row.last_name}? This will also remove their user account, bookings, and reviews.`)) return
                        setDeleting(true)
                        try {
                            const res = await fetch(`${API_BASE}/api/admin/artists/${row.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                            })
                            if (res.ok) {
                                if (onDelete) onDelete(row.id)
                            } else {
                                const data = await res.json()
                                setSaveMsg(data.error || 'Failed to delete')
                            }
                        } catch (e) {
                            setSaveMsg('Failed to delete artist')
                        }
                        setDeleting(false)
                    }}
                    disabled={deleting}
                    className="flex items-center gap-2 rounded border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {deleting ? 'Deleting...' : 'Delete Artist'}
                </button>
                {saveMsg && <span className={`text-sm ${saveMsg.includes('saved') ? 'text-green-400' : 'text-red-400'}`}>{saveMsg}</span>}
                {requestInfoStatus && <span className={`text-sm ${requestInfoStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{requestInfoStatus}</span>}
            </div>

            {showRequestInfo && (
                <div className="mt-3 rounded border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Request More Information via Email</p>
                    <p className="text-xs text-gray-500">This will send an email to {row.email} asking for additional information.</p>
                    <textarea
                        value={requestInfoMsg}
                        onChange={e => setRequestInfoMsg(e.target.value)}
                        rows={3}
                        placeholder="What additional information do you need from this artist?"
                        className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleRequestInfo} disabled={sendingInfo || !requestInfoMsg.trim()}
                            className="flex items-center gap-2 bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50">
                            <Send className="h-4 w-4" />
                            {sendingInfo ? 'Sending...' : 'Send Email'}
                        </button>
                        <button onClick={() => setShowRequestInfo(false)} className="border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

function SubmissionDetailModal({ row, tab, onClose, token, onProfileUpdate, onDelete }) {
    if (!row) return null
    const fields = getDetailFields(tab)
    const title = tab === 'contacts' ? row.name
        : tab === 'newsletter' ? (row.first_name || row.email)
        : [row.first_name, row.last_name].filter(Boolean).join(' ')
    const isArtist = tab === 'artists' || tab === 'booking_artists'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
            <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-[#1a0e2e] border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 z-10 flex items-center justify-between bg-[#1a0e2e] border-b border-white/10 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <h2 className="oswald-500 text-xl uppercase text-white">{title}</h2>
                        {isArtist && row.profile_approved && (
                            <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">Approved</span>
                        )}
                        {isArtist && row.featured && (
                            <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">Featured</span>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                </div>
                <div className="px-6 py-4 space-y-1">
                    {fields.map(f => {
                        const val = row[f.key]
                        if (val === null || val === undefined || val === '') return null
                        const formatted = formatValue(val)
                        const isLong = typeof val === 'string' && val.length > 80
                        const isLink = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))
                        const isEmail = typeof val === 'string' && val.includes('@') && !val.startsWith('http')

                        return (
                            <div key={f.key} className={`py-3 ${isLong ? '' : 'flex items-start justify-between gap-4'} border-b border-white/5`}>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#D5FF00] shrink-0">{f.label}</span>
                                {isLong ? (
                                    <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{formatted}</p>
                                ) : isLink ? (
                                    <a href={val} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline break-all">{val}</a>
                                ) : isEmail ? (
                                    <a href={`mailto:${val}`} className="text-sm text-blue-400 hover:underline">{val}</a>
                                ) : (
                                    <span className="text-sm text-gray-300">{formatted}</span>
                                )}
                            </div>
                        )
                    })}

                    {isArtist && token && (
                        <ArtistProfilePanel row={row} token={token} onUpdate={onProfileUpdate} onDelete={(id) => { if (onDelete) onDelete(id); onClose(); }} />
                    )}
                </div>
            </div>
        </div>
    )
}

function SubmissionsSection({ token, activeTab, setActiveTab, onUnauthorized }) {
    const tab = submissionTabs.find(t => t.key === activeTab)
    const { data, loading, error, refetch } = useAdminFetch(tab.endpoint, token, [activeTab])
    const [selectedRow, setSelectedRow] = useState(null)
    const [showShortlistedOnly, setShowShortlistedOnly] = useState(false)
    const [shortlistMap, setShortlistMap] = useState({})

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    useEffect(() => {
        setSelectedRow(null)
        setShowShortlistedOnly(false)
        setShortlistMap({})
    }, [activeTab])

    useEffect(() => {
        if (data && (activeTab === 'artists' || activeTab === 'booking_artists')) {
            const map = {}
            data.forEach(row => { map[row.id] = !!row.shortlisted })
            setShortlistMap(map)
        }
    }, [data, activeTab])

    const toggleShortlist = async (e, id) => {
        e.stopPropagation()
        setShortlistMap(prev => ({ ...prev, [id]: !prev[id] }))
        try {
            await fetch(`${API_BASE}/api/admin/artists/${id}/shortlist`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            })
        } catch {
            setShortlistMap(prev => ({ ...prev, [id]: !prev[id] }))
        }
    }

    const columns = getColumns(activeTab)
    const isArtists = activeTab === 'artists' || activeTab === 'booking_artists'
    const displayData = data && isArtists && showShortlistedOnly
        ? data.filter(row => shortlistMap[row.id])
        : data
    const shortlistedCount = isArtists ? Object.values(shortlistMap).filter(Boolean).length : 0

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="oswald-500 text-3xl uppercase">Submissions</h1>
                {!loading && data?.length > 0 && (
                    <button
                        onClick={() => exportToCSV(data, columns, tab.label.replace(/\s+/g, '_').toLowerCase())}
                        className="flex items-center gap-2 border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                )}
            </div>
            <div className="mb-6 flex flex-wrap items-center gap-2">
                {submissionTabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 py-2 text-sm font-medium uppercase transition ${
                            activeTab === t.key ? 'bg-[#D5FF00] text-black' : 'border border-white/20 text-white hover:bg-white/10'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
                {isArtists && !loading && data?.length > 0 && (
                    <button
                        onClick={() => setShowShortlistedOnly(prev => !prev)}
                        className={`ml-4 flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition ${
                            showShortlistedOnly
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                                : 'border border-white/20 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Star className={`h-3.5 w-3.5 ${showShortlistedOnly ? 'fill-yellow-400' : ''}`} />
                        Shortlisted ({shortlistedCount})
                    </button>
                )}
            </div>

            {loading && <p className="text-gray-400">Loading...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}
            {!loading && !error && data?.length === 0 && <p className="text-gray-400">No submissions yet.</p>}
            {!loading && !error && displayData?.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                {isArtists && (
                                    <th className="w-10 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">
                                        <Star className="mx-auto h-3.5 w-3.5" />
                                    </th>
                                )}
                                {columns.map(col => (
                                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {displayData.map((row, i) => {
                                const isShortlisted = isArtists && shortlistMap[row.id]
                                return (
                                    <tr
                                        key={row.id || i}
                                        className={`cursor-pointer border-b border-white/10 hover:bg-white/5 ${isShortlisted ? 'bg-yellow-500/5 border-l-2 border-l-yellow-500/60' : ''}`}
                                        onClick={() => setSelectedRow(row)}
                                    >
                                        {isArtists && (
                                            <td className="w-10 px-2 py-3 text-center">
                                                <button
                                                    onClick={(e) => toggleShortlist(e, row.id)}
                                                    className="transition hover:scale-110"
                                                >
                                                    <Star className={`h-4 w-4 ${isShortlisted ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 hover:text-yellow-400/60'}`} />
                                                </button>
                                            </td>
                                        )}
                                        {columns.map(col => (
                                            <td key={col.key} className="max-w-xs truncate px-4 py-3 text-gray-300">
                                                {formatValue(row[col.key])}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <p className="mt-4 text-sm text-gray-500">
                        {showShortlistedOnly ? `Showing ${displayData.length} shortlisted` : `Total: ${data.length} ${data.length === 1 ? 'entry' : 'entries'}`}
                        {isArtists && !showShortlistedOnly && shortlistedCount > 0 ? ` (${shortlistedCount} shortlisted)` : ''}
                    </p>
                </div>
            )}
            {!loading && !error && showShortlistedOnly && displayData?.length === 0 && (
                <p className="text-gray-400">No shortlisted artists yet. Click the star icon next to an artist to shortlist them.</p>
            )}

            {selectedRow && <SubmissionDetailModal row={selectedRow} tab={activeTab} onClose={() => setSelectedRow(null)} token={token} onProfileUpdate={(updatedData) => {
                setSelectedRow(prev => prev ? { ...prev, ...updatedData } : null)
                refetch()
            }} onDelete={() => {
                setSelectedRow(null)
                refetch()
            }} />}
        </>
    )
}

function QueueSection({ token, onUnauthorized }) {
    const { data: queue, loading, error, refetch } = useAdminFetch('/api/admin/queue', token)
    const [topic, setTopic] = useState('')
    const [ideas, setIdeas] = useState([])
    const [selected, setSelected] = useState(new Set())
    const [brainstorming, setBrainstorming] = useState(false)
    const [adding, setAdding] = useState(false)
    const [processing, setProcessing] = useState(null)
    const [aiError, setAiError] = useState('')
    const [showCustom, setShowCustom] = useState(false)
    const [customText, setCustomText] = useState('')
    const [addingCustom, setAddingCustom] = useState(false)
    const [expandedId, setExpandedId] = useState(null)
    const [editFields, setEditFields] = useState({})
    const [previewContent, setPreviewContent] = useState({})
    const [generating, setGenerating] = useState(null)
    const [saving, setSaving] = useState(null)
    const [editingContent, setEditingContent] = useState({})

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const handleBrainstorm = async () => {
        if (!topic.trim()) return
        setBrainstorming(true)
        setAiError('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/ai/brainstorm`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic.trim() }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setIdeas(data.ideas)
            setSelected(new Set())
        } catch (e) {
            setAiError(e.message || 'Failed to brainstorm')
        }
        setBrainstorming(false)
    }

    const toggleSelect = (i) => {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(i)) next.delete(i)
            else next.add(i)
            return next
        })
    }

    const handleAddToQueue = async () => {
        const selectedIdeas = ideas.filter((_, i) => selected.has(i))
        if (selectedIdeas.length === 0) return
        setAdding(true)
        try {
            const res = await fetch(`${API_BASE}/api/admin/queue`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ideas: selectedIdeas }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setIdeas([])
            setSelected(new Set())
            setTopic('')
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to add to queue')
        }
        setAdding(false)
    }

    const handleAddCustom = async () => {
        if (!customText.trim()) return
        setAddingCustom(true)
        setAiError('')
        try {
            const lines = customText.trim().split('\n')
            const title = lines[0].trim()
            const angle = lines.slice(1).join('\n').trim()
            const res = await fetch(`${API_BASE}/api/admin/queue`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ideas: [{ title, angle }] }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setCustomText('')
            setShowCustom(false)
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to add custom idea')
        }
        setAddingCustom(false)
    }

    const handleReorder = async (id, direction) => {
        if (!queue) return
        const queuedItems = queue.filter(q => q.status === 'queued' || q.status === 'failed')
        const idx = queuedItems.findIndex(q => q.id === id)
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1
        if (swapIdx < 0 || swapIdx >= queuedItems.length) return
        try {
            await fetch(`${API_BASE}/api/admin/queue/reorder`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ id1: queuedItems[idx].id, id2: queuedItems[swapIdx].id }),
            })
            refetch()
        } catch (e) { console.error(e) }
    }

    const handleDelete = async (id) => {
        if (!confirm('Remove this item from the queue?')) return
        try {
            await fetch(`${API_BASE}/api/admin/queue/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (expandedId === id) setExpandedId(null)
            refetch()
        } catch (e) { console.error(e) }
    }

    const handleProcessNow = async (id) => {
        setProcessing(id)
        try {
            const res = await fetch(`${API_BASE}/api/admin/queue/${id}/process`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.error) setAiError(data.error)
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to process')
        }
        setProcessing(null)
    }

    const openModal = (item) => {
        setExpandedId(item.id)
        setEditFields({ title: item.title, description: item.description || '', keyword: item.keyword || '' })
        const content = typeof item.generated_content === 'string' ? JSON.parse(item.generated_content) : item.generated_content
        if (content) {
            setPreviewContent(prev => ({ ...prev, [item.id]: content }))
            setEditingContent(prev => ({ ...prev, [item.id]: content.article || '' }))
        }
    }

    const closeModal = () => setExpandedId(null)

    const handleSaveFields = async (id) => {
        setSaving(id)
        try {
            const res = await fetch(`${API_BASE}/api/admin/queue/${id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(editFields),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to save')
        }
        setSaving(null)
    }

    const handleGeneratePreview = async (id) => {
        setGenerating(id)
        setAiError('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/queue/${id}/preview`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setPreviewContent(prev => ({ ...prev, [id]: data.content }))
            setEditingContent(prev => ({ ...prev, [id]: data.content.article || '' }))
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to generate preview')
        }
        setGenerating(null)
    }

    const handleSaveContent = async (id) => {
        setSaving(id)
        try {
            const content = { ...previewContent[id], article: editingContent[id] }
            const res = await fetch(`${API_BASE}/api/admin/queue/${id}/content`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setPreviewContent(prev => ({ ...prev, [id]: content }))
            refetch()
        } catch (e) {
            setAiError(e.message || 'Failed to save content')
        }
        setSaving(null)
    }

    const statusBadge = (status) => {
        const styles = {
            queued: 'bg-gray-500/20 text-gray-400',
            writing: 'bg-yellow-500/20 text-yellow-400',
            published: 'bg-green-500/20 text-green-400',
            failed: 'bg-red-500/20 text-red-400',
        }
        const icons = {
            queued: Clock,
            writing: Sparkles,
            published: CheckCircle,
            failed: AlertCircle,
        }
        const Icon = icons[status] || Clock
        return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.queued}`}>
                <Icon className="h-3 w-3" /> {status}
            </span>
        )
    }

    const queuedCount = queue?.filter(q => q.status === 'queued').length || 0
    const nextScheduled = queue?.filter(q => q.status === 'queued').sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))[0]

    return (
        <>
            <div className="mb-6">
                <h1 className="oswald-500 text-3xl uppercase">Content Queue</h1>
                <p className="mt-1 text-sm text-gray-400">Brainstorm ideas, add them to the queue, and they'll be auto-written, imaged, and published daily.</p>
            </div>

            {queuedCount > 0 && (
                <div className="mb-6 flex items-center gap-4 rounded border border-[#D5FF00]/20 bg-[#D5FF00]/5 px-4 py-3">
                    <Calendar className="h-5 w-5 text-[#D5FF00]" />
                    <div className="text-sm">
                        <span className="font-medium text-[#D5FF00]">{queuedCount} article{queuedCount !== 1 ? 's' : ''}</span>
                        <span className="text-gray-400"> in queue</span>
                        {nextScheduled && (
                            <span className="text-gray-400"> · Next publish: <span className="text-white">{new Date(nextScheduled.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></span>
                        )}
                    </div>
                </div>
            )}

            <div className="mb-8 rounded border border-white/10 bg-white/[0.02] p-5">
                <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">
                    <Sparkles className="h-4 w-4" /> Quick Brainstorm
                </h2>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleBrainstorm()}
                        placeholder="Enter a topic to brainstorm ideas..."
                        className="flex-1 border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                    />
                    <button
                        onClick={handleBrainstorm}
                        disabled={brainstorming || !topic.trim()}
                        className="flex items-center gap-2 bg-[#D5FF00] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                    >
                        <Sparkles className="h-4 w-4" />
                        {brainstorming ? 'Thinking...' : 'Brainstorm'}
                    </button>
                </div>

                <button
                    onClick={() => setShowCustom(!showCustom)}
                    className="mt-3 flex items-center gap-2 text-xs text-gray-400 hover:text-[#D5FF00] transition"
                >
                    <Plus className="h-3 w-3" />
                    {showCustom ? 'Hide custom idea form' : 'Or add your own idea directly'}
                </button>

                {showCustom && (
                    <div className="mt-3 space-y-3 rounded border border-white/10 bg-white/[0.02] p-4">
                        <textarea
                            value={customText}
                            onChange={e => setCustomText(e.target.value)}
                            placeholder={"First line = title, rest = description\n\nExample:\nBeyond the \"Brown\" Box: How to Market Your Sound\nActionable tips on pitching to Spotify editors and curators..."}
                            rows={5}
                            className="w-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                        />
                        <button
                            onClick={handleAddCustom}
                            disabled={addingCustom || !customText.trim()}
                            className="flex items-center gap-2 bg-[#D5FF00] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            {addingCustom ? 'Adding...' : 'Add to Queue'}
                        </button>
                    </div>
                )}

                {aiError && <p className="mt-3 text-sm text-red-400">{aiError}</p>}

                {ideas.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">Select ideas to add to the queue:</p>
                        {ideas.map((idea, i) => (
                            <button
                                key={i}
                                onClick={() => toggleSelect(i)}
                                className={`w-full rounded border p-3 text-left transition ${
                                    selected.has(i) ? 'border-[#D5FF00] bg-[#D5FF00]/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                                        selected.has(i) ? 'border-[#D5FF00] bg-[#D5FF00] text-black' : 'border-white/30'
                                    }`}>
                                        {selected.has(i) && <Check className="h-3 w-3" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white">{idea.title}</h3>
                                        <p className="mt-0.5 text-xs text-gray-400">{idea.angle}</p>
                                        {idea.keyword && <span className="mt-1 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-gray-500">{idea.keyword}</span>}
                                    </div>
                                </div>
                            </button>
                        ))}
                        <button
                            onClick={handleAddToQueue}
                            disabled={adding || selected.size === 0}
                            className="mt-3 flex items-center gap-2 bg-[#D5FF00] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            {adding ? 'Adding...' : `Add ${selected.size} to Queue`}
                        </button>
                    </div>
                )}
            </div>

            {loading && <p className="text-gray-400">Loading queue...</p>}
            {!loading && !error && queue?.length === 0 && (
                <p className="text-gray-500">Queue is empty. Brainstorm some ideas above to get started.</p>
            )}

            {!loading && !error && queue?.length > 0 && (
                <div className="space-y-2">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Pipeline</h2>
                    {queue.map(item => (
                        <div key={item.id} className={`flex cursor-pointer items-center justify-between rounded border p-4 transition hover:border-white/20 ${
                            item.status === 'published' ? 'border-green-500/20 bg-green-500/5' :
                            item.status === 'failed' ? 'border-red-500/20 bg-red-500/5' :
                            item.status === 'writing' ? 'border-yellow-500/20 bg-yellow-500/5' :
                            'border-white/10 bg-white/5'
                        }`} onClick={() => openModal(item)}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                                    {statusBadge(item.status)}
                                </div>
                                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                    <span>{new Date(item.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    {item.keyword && <span className="rounded bg-white/10 px-1.5 py-0.5">{item.keyword}</span>}
                                    {item.generated_content && <span className="text-blue-400">Has preview</span>}
                                    {item.error && <span className="text-red-400">{item.error}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                {(item.status === 'queued' || item.status === 'failed') && (
                                    <>
                                        <div className="flex flex-col">
                                            <button
                                                onClick={() => handleReorder(item.id, 'up')}
                                                className="rounded p-0.5 text-gray-500 hover:bg-white/10 hover:text-white"
                                                title="Move up"
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleReorder(item.id, 'down')}
                                                className="rounded p-0.5 text-gray-500 hover:bg-white/10 hover:text-white"
                                                title="Move down"
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleProcessNow(item.id)}
                                            disabled={processing === item.id}
                                            className="flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium text-[#D5FF00] hover:bg-[#D5FF00]/10 disabled:opacity-50"
                                        >
                                            <Play className="h-3 w-3" />
                                            {processing === item.id ? 'Processing...' : 'Process Now'}
                                        </button>
                                    </>
                                )}
                                {item.status !== 'writing' && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {expandedId && (() => {
                const modalItem = queue?.find(q => q.id === expandedId)
                if (!modalItem) return null
                const content = previewContent[expandedId]
                const isEditable = modalItem.status === 'queued' || modalItem.status === 'failed'
                return (
                    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeModal}>
                        <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0118] shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0118] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-semibold text-white">{modalItem.title}</h2>
                                    {statusBadge(modalItem.status)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {isEditable && (
                                        <button
                                            onClick={() => { handleProcessNow(modalItem.id); closeModal() }}
                                            disabled={processing === modalItem.id}
                                            className="flex items-center gap-1 rounded bg-[#D5FF00] px-4 py-2 text-xs font-semibold text-black hover:opacity-90 disabled:opacity-50"
                                        >
                                            <Play className="h-3 w-3" />
                                            {processing === modalItem.id ? 'Publishing...' : 'Publish Now'}
                                        </button>
                                    )}
                                    {modalItem.status === 'published' && modalItem.blog_post_id && (
                                        <a
                                            href={`/blog/${modalItem.blog_post_id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 rounded bg-green-500/20 px-4 py-2 text-xs font-medium text-green-400 hover:bg-green-500/30"
                                        >
                                            <Eye className="h-3 w-3" /> View Post
                                        </a>
                                    )}
                                    <button onClick={closeModal} className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                                {isEditable && (
                                    <div className="space-y-4 rounded border border-white/10 bg-white/[0.02] p-5">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Article Setup</h3>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Title</label>
                                            <input
                                                type="text"
                                                value={editFields.title}
                                                onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
                                                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Description / Angle</label>
                                            <textarea
                                                value={editFields.description}
                                                onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                                                rows={3}
                                                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs text-gray-500">Primary Keyword</label>
                                            <input
                                                type="text"
                                                value={editFields.keyword}
                                                onChange={e => setEditFields(f => ({ ...f, keyword: e.target.value }))}
                                                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                            <button
                                                onClick={() => handleSaveFields(modalItem.id)}
                                                disabled={saving === modalItem.id}
                                                className="flex items-center gap-1.5 rounded bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-50"
                                            >
                                                <Save className="h-3 w-3" />
                                                {saving === modalItem.id ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                onClick={() => handleGeneratePreview(modalItem.id)}
                                                disabled={generating === modalItem.id}
                                                className="flex items-center gap-1.5 rounded bg-[#D5FF00] px-4 py-2 text-xs font-semibold text-black hover:opacity-90 disabled:opacity-50"
                                            >
                                                <Sparkles className="h-3 w-3" />
                                                {generating === modalItem.id ? 'Generating...' : (content ? 'Regenerate Article' : 'Generate Preview')}
                                            </button>
                                            <span className="text-xs text-gray-600">
                                                Scheduled: {new Date(modalItem.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {aiError && <p className="text-sm text-red-400">{aiError}</p>}

                                {content && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Article Preview</h3>
                                            {content.primary_keyword && <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-500">{content.primary_keyword}</span>}
                                            {content.secondary_keywords?.map((kw, i) => (
                                                <span key={i} className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-500">{kw}</span>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 rounded border border-white/10 bg-white/[0.02] p-4">
                                            <div>
                                                <p className="text-xs text-gray-500">SEO Title</p>
                                                <p className="mt-1 text-sm font-medium text-white">{content.seo_title}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Meta Description</p>
                                                <p className="mt-1 text-sm text-gray-300">{content.meta_description}</p>
                                            </div>
                                        </div>

                                        {isEditable ? (
                                            <div className="flex flex-1 flex-col">
                                                <label className="mb-2 block text-xs text-gray-500">Article Content</label>
                                                <textarea
                                                    value={editingContent[modalItem.id] || ''}
                                                    onChange={e => setEditingContent(prev => ({ ...prev, [modalItem.id]: e.target.value }))}
                                                    className="min-h-[400px] w-full flex-1 rounded border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white focus:border-[#D5FF00] focus:outline-none"
                                                />
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => handleSaveContent(modalItem.id)}
                                                        disabled={saving === modalItem.id}
                                                        className="flex items-center gap-1.5 rounded bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-50"
                                                    >
                                                        <Save className="h-3 w-3" />
                                                        {saving === modalItem.id ? 'Saving...' : 'Save Content'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-gray-300">
                                                {content.article}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {modalItem.status === 'published' && !content && (
                                    <p className="text-sm text-gray-500">This article has been published. View it on the blog or edit it in the Blogs section.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })()}
        </>
    )
}

function AIWriter({ token, onUseContent }) {
    const [step, setStep] = useState('topic')
    const [topic, setTopic] = useState('')
    const [ideas, setIdeas] = useState([])
    const [selectedIdea, setSelectedIdea] = useState(null)
    const [aiResult, setAiResult] = useState(null)
    const [editableArticle, setEditableArticle] = useState('')
    const [editableSeo, setEditableSeo] = useState({ seo_title: '', meta_description: '', primary_keyword: '', secondary_keywords: [] })
    const [suggestedLinks, setSuggestedLinks] = useState([])
    const [generatedImageUrl, setGeneratedImageUrl] = useState('')
    const [generatedImageData, setGeneratedImageData] = useState(null)
    const [generatedImageMime, setGeneratedImageMime] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleBrainstorm = async () => {
        if (!topic.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/ai/brainstorm`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic.trim() }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setIdeas(data.ideas)
            setStep('pick')
        } catch (e) {
            setError(e.message || 'Failed to brainstorm. Try again.')
        }
        setLoading(false)
    }

    const handleWrite = async (idea) => {
        setSelectedIdea(idea)
        setLoading(true)
        setError('')
        setStep('writing')
        try {
            const res = await fetch(`${API_BASE}/api/admin/ai/write`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: idea.title, description: idea.description }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            const result = data.content
            setAiResult(result)
            setEditableArticle(result.article || '')
            setEditableSeo({
                seo_title: result.seo_title || idea.title,
                meta_description: result.meta_description || '',
                primary_keyword: result.primary_keyword || '',
                secondary_keywords: result.secondary_keywords || [],
            })
            setSuggestedLinks(result.suggested_links || [])
            setStep('review')
        } catch (e) {
            setError(e.message || 'Failed to write. Try again.')
            setStep('pick')
        }
        setLoading(false)
    }

    const handleGenerateImage = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/ai/image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: selectedIdea?.title || '', description: selectedIdea?.description || '' }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setGeneratedImageData(data.imageData)
            setGeneratedImageMime(data.imageMime)
            setGeneratedImageUrl(`data:${data.imageMime};base64,${data.imageData}`)
        } catch (e) {
            setError(e.message || 'Failed to generate image. Try again.')
        }
        setLoading(false)
    }

    const handleUseContent = () => {
        const fullContent = editableSeo.seo_title + '\n\n' + editableArticle
        onUseContent(fullContent, generatedImageUrl, {
            seo_title: editableSeo.seo_title,
            meta_description: editableSeo.meta_description,
            primary_keyword: editableSeo.primary_keyword,
            secondary_keywords: editableSeo.secondary_keywords,
            suggested_links: suggestedLinks,
            imageData: generatedImageData,
            imageMime: generatedImageMime,
        })
    }

    const handleReset = () => {
        setStep('topic')
        setTopic('')
        setIdeas([])
        setSelectedIdea(null)
        setAiResult(null)
        setEditableArticle('')
        setEditableSeo({ seo_title: '', meta_description: '', primary_keyword: '', secondary_keywords: [] })
        setSuggestedLinks([])
        setGeneratedImageUrl('')
        setError('')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-[#D5FF00]" />
                    <h2 className="oswald-500 text-2xl uppercase text-white">AI Blog Writer</h2>
                </div>
                {step !== 'topic' && (
                    <button onClick={handleReset} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                        <RotateCcw className="h-4 w-4" /> Start Over
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={step === 'topic' ? 'text-[#D5FF00]' : 'text-gray-400'}>1. Topic</span>
                <ArrowRight className="h-3 w-3" />
                <span className={step === 'pick' ? 'text-[#D5FF00]' : 'text-gray-400'}>2. Pick Idea</span>
                <ArrowRight className="h-3 w-3" />
                <span className={step === 'writing' || step === 'review' ? 'text-[#D5FF00]' : 'text-gray-400'}>3. Write</span>
                <ArrowRight className="h-3 w-3" />
                <span className={step === 'review' && generatedImageUrl ? 'text-[#D5FF00]' : 'text-gray-400'}>4. Image</span>
            </div>

            {error && <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>}

            {step === 'topic' && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Enter a topic or theme and AI will brainstorm 5 editorial article ideas for you.</p>
                    <input
                        type="text"
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleBrainstorm()}
                        placeholder="e.g. diaspora music shaping global culture, Punjabi hip-hop crossover, South Asian arts in Toronto..."
                        className="w-full border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                    />
                    <button
                        onClick={handleBrainstorm}
                        disabled={loading || !topic.trim()}
                        className="flex items-center gap-2 bg-[#D5FF00] px-6 py-2.5 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                    >
                        <Sparkles className="h-4 w-4" />
                        {loading ? 'Brainstorming...' : 'Generate Ideas'}
                    </button>
                </div>
            )}

            {step === 'pick' && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-400">Pick an idea to develop into a full editorial article:</p>
                    <div className="space-y-3">
                        {ideas.map((idea, i) => (
                            <button
                                key={i}
                                onClick={() => handleWrite(idea)}
                                disabled={loading}
                                className="group w-full rounded border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#D5FF00]/50 hover:bg-white/10 disabled:opacity-50"
                            >
                                <h3 className="font-medium text-white group-hover:text-[#D5FF00]">{idea.title}</h3>
                                <p className="mt-1 text-sm italic text-[#D5FF00]/70">{idea.angle}</p>
                                <p className="mt-2 text-sm leading-relaxed text-gray-400">{idea.description}</p>
                                {idea.keyword && (
                                    <span className="mt-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs text-gray-500">
                                        Keyword: {idea.keyword}
                                    </span>
                                )}
                                <span className="mt-3 inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-[#D5FF00]">
                                    <Wand2 className="h-3 w-3" /> Click to write this article
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'writing' && (
                <div className="flex items-center gap-3 py-12 text-gray-400">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D5FF00] border-t-transparent" />
                    <span>AI is writing your editorial article...</span>
                </div>
            )}

            {step === 'review' && (
                <div className="space-y-6">
                    <div className="rounded border border-white/10 bg-white/5 p-4 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">SEO Metadata</h3>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">SEO Title</label>
                                <input
                                    type="text"
                                    value={editableSeo.seo_title}
                                    onChange={e => setEditableSeo(s => ({ ...s, seo_title: e.target.value }))}
                                    className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                                />
                                <p className="mt-1 text-xs text-gray-600">{editableSeo.seo_title.length}/60 characters</p>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-500">Primary Keyword</label>
                                <input
                                    type="text"
                                    value={editableSeo.primary_keyword}
                                    onChange={e => setEditableSeo(s => ({ ...s, primary_keyword: e.target.value }))}
                                    className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500">Meta Description</label>
                            <input
                                type="text"
                                value={editableSeo.meta_description}
                                onChange={e => setEditableSeo(s => ({ ...s, meta_description: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#D5FF00] focus:outline-none"
                            />
                            <p className="mt-1 text-xs text-gray-600">{editableSeo.meta_description.length}/160 characters</p>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs text-gray-500">Secondary Keywords</label>
                            <div className="flex flex-wrap gap-2">
                                {editableSeo.secondary_keywords.map((kw, i) => (
                                    <span key={i} className="rounded bg-white/10 px-2 py-1 text-xs text-gray-300">{kw}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">Article Content</label>
                        <textarea
                            value={editableArticle}
                            onChange={e => setEditableArticle(e.target.value)}
                            rows={20}
                            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white focus:border-[#D5FF00] focus:outline-none"
                        />
                    </div>

                    {suggestedLinks.length > 0 && (
                        <div className="rounded border border-white/10 bg-white/5 p-4">
                            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">Suggested Internal Links</h3>
                            <div className="space-y-1">
                                {suggestedLinks.map((link, i) => (
                                    <p key={i} className="text-sm text-gray-400">{i + 1}. {link}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">Cover Image</label>
                        {generatedImageUrl ? (
                            <div className="space-y-3">
                                <img src={generatedImageUrl} alt="Generated cover" className="h-[200px] w-full rounded border border-white/10 object-cover" />
                                <button
                                    onClick={handleGenerateImage}
                                    disabled={loading}
                                    className="flex items-center gap-2 border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    {loading ? 'Regenerating...' : 'Regenerate Image'}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleGenerateImage}
                                disabled={loading}
                                className="flex items-center gap-2 border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/10 disabled:opacity-50"
                            >
                                <ImagePlus className="h-4 w-4" />
                                {loading ? 'Generating Image...' : 'Generate Cover Image'}
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3 border-t border-white/10 pt-4">
                        <button
                            onClick={handleUseContent}
                            className="flex items-center gap-2 bg-[#D5FF00] px-6 py-2.5 font-semibold text-black transition hover:opacity-90"
                        >
                            <Check className="h-4 w-4" />
                            Use This Content
                        </button>
                        <button onClick={handleReset} className="border border-white/20 px-6 py-2.5 text-white hover:bg-white/10">
                            Discard
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function BlogsSection({ token, onUnauthorized }) {
    const [view, setView] = useState('list')
    const [editingBlog, setEditingBlog] = useState(null)
    const [aiPrefill, setAiPrefill] = useState(null)
    const { data: blogs, loading, error, refetch } = useAdminFetch('/api/admin/blogs', token)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return
        try {
            const res = await fetch(`${API_BASE}/api/admin/blogs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) refetch()
        } catch (e) {
            console.error(e)
        }
    }

    const handleSave = async (blogData) => {
        setSaving(true)
        try {
            const url = editingBlog?.id
                ? `${API_BASE}/api/admin/blogs/${editingBlog.id}`
                : `${API_BASE}/api/admin/blogs`
            const method = editingBlog?.id ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData),
            })
            if (res.ok) {
                refetch()
                setView('list')
                setEditingBlog(null)
                setAiPrefill(null)
            }
        } catch (e) {
            console.error(e)
        }
        setSaving(false)
    }

    const handleAIContent = (content, imageUrl, seoMeta) => {
        setAiPrefill({ content, imageUrl, seoMeta, imageData: seoMeta?.imageData, imageMime: seoMeta?.imageMime })
        setEditingBlog(null)
        setView('edit')
    }

    if (view === 'ai') {
        return (
            <>
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={() => setView('list')} className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="oswald-500 text-3xl uppercase">AI Writer</h1>
                </div>
                <AIWriter token={token} onUseContent={handleAIContent} />
            </>
        )
    }

    if (view === 'edit') {
        return <BlogEditor blog={editingBlog} onSave={handleSave} onCancel={() => { setView('list'); setEditingBlog(null); setAiPrefill(null) }} saving={saving} token={token} aiPrefill={aiPrefill} />
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="oswald-500 text-3xl uppercase">Blog Posts</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView('ai')}
                        className="flex items-center gap-2 border border-[#D5FF00]/50 px-4 py-2 text-sm font-semibold text-[#D5FF00] transition hover:bg-[#D5FF00]/10"
                    >
                        <Sparkles className="h-4 w-4" /> AI Writer
                    </button>
                    <button
                        onClick={() => { setEditingBlog(null); setAiPrefill(null); setView('edit') }}
                        className="flex items-center gap-2 bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" /> New Post
                    </button>
                </div>
            </div>

            {loading && <p className="text-gray-400">Loading...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}
            {!loading && !error && blogs?.length === 0 && <p className="text-gray-400">No blog posts yet. Create your first one!</p>}

            {!loading && !error && blogs?.length > 0 && (
                <div className="space-y-3">
                    {blogs.map(blog => (
                        <div key={blog.id} className="flex items-center justify-between rounded border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center gap-4">
                                {blog.image_url && (
                                    <img src={blog.image_url} alt="" className="h-14 w-20 rounded object-cover" />
                                )}
                                <div>
                                    <h3 className="font-medium text-white">{blog.title}</h3>
                                    <p className="text-sm text-gray-400">
                                        {blog.category} · {blog.date} · {blog.published ? 'Published' : 'Draft'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setEditingBlog(blog); setView('edit') }}
                                    className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                                >
                                    <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(blog.id)}
                                    className="rounded p-2 text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

function parseCopyToPost(rawCopy) {
    const allLines = rawCopy.split('\n').map(l => l.trim())
    const nonEmpty = allLines.filter(Boolean)
    if (nonEmpty.length === 0) return { title: '', full_title: '', slug: '', description: '', sections: [] }

    const title = nonEmpty[0].length > 60 ? nonEmpty[0].substring(0, 60) : nonEmpty[0]
    const full_title = nonEmpty[0]
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const description = nonEmpty.length > 1 ? nonEmpty[1] : nonEmpty[0]

    const sections = []
    const contentLines = nonEmpty.slice(1)
    if (contentLines.length > 0) {
        sections.push({ type: 'intro', text: contentLines[0] })
    }

    const isKeyValueLine = (l) => /^(name|role|email|phone|website|location|date|venue|time):/i.test(l)

    let i = 1
    while (i < contentLines.length) {
        const line = contentLines[i]

        if (/^\[CONTACT\]/i.test(line)) {
            const card = { type: 'contact-card' }
            i++
            while (i < contentLines.length && isKeyValueLine(contentLines[i])) {
                const cl = contentLines[i]
                if (/^name:/i.test(cl)) card.name = cl.replace(/^name:\s*/i, '')
                else if (/^role:/i.test(cl)) card.role = cl.replace(/^role:\s*/i, '')
                else if (/^email:/i.test(cl)) card.email = cl.replace(/^email:\s*/i, '')
                else if (/^phone:/i.test(cl)) card.phone = cl.replace(/^phone:\s*/i, '')
                else if (/^website:/i.test(cl)) card.website = cl.replace(/^website:\s*/i, '')
                else if (/^location:/i.test(cl)) card.location = cl.replace(/^location:\s*/i, '')
                i++
            }
            sections.push(card)
            continue
        }

        if (/^\[EVENT\]/i.test(line)) {
            const evt = { type: 'event-details' }
            i++
            while (i < contentLines.length && isKeyValueLine(contentLines[i])) {
                const cl = contentLines[i]
                if (/^date:/i.test(cl)) evt.date = cl.replace(/^date:\s*/i, '')
                else if (/^venue:/i.test(cl)) evt.venue = cl.replace(/^venue:\s*/i, '')
                else if (/^time:/i.test(cl)) evt.time = cl.replace(/^time:\s*/i, '')
                i++
            }
            sections.push(evt)
            continue
        }

        if ((line.startsWith('"') || line.startsWith('\u201C')) && (line.endsWith('"') || line.endsWith('\u201D') || line.endsWith('."') || line.endsWith('.\u201D'))) {
            const text = line.replace(/^[\u201C"]+/, '').replace(/[\u201D"]+$/, '')
            let attr
            if (i + 1 < contentLines.length && /^\s*[-\u2014\u2013]\s*/.test(contentLines[i + 1])) {
                i++
                attr = contentLines[i].replace(/^\s*[-\u2014\u2013]\s*/, '')
            }
            sections.push({ type: 'quote', text, ...(attr ? { attribution: attr } : {}) })
            i++
            continue
        }

        if (/^[\u2022\-\*]\s+/.test(line)) {
            const items = []
            while (i < contentLines.length && /^[\u2022\-\*]\s+/.test(contentLines[i])) {
                items.push(contentLines[i].replace(/^[\u2022\-\*]\s+/, ''))
                i++
            }
            sections.push({ type: 'list', items })
            continue
        }

        const isAllCapsHeading = line === line.toUpperCase() && line.length < 80 && line.length > 2 && /[A-Z]/.test(line)
        const isTitleCaseHeading = (() => {
            if (isAllCapsHeading || line.length <= 2 || line.length >= 60) return false
            if (/[.!?;,:]$/.test(line)) return false
            if (!/^[A-Z]/.test(line)) return false
            const words = line.split(/\s+/)
            if (words.length < 2 || words.length > 8) return false
            const smallWords = ['a','an','and','as','at','but','by','for','in','is','it','of','on','or','the','to','with']
            const capWords = words.filter(w => /^[A-Z]/.test(w) || /^\d+$/.test(w))
            if (capWords.length < 2) return false
            return words.every(w => /^[A-Z]/.test(w) || /^\d+$/.test(w) || smallWords.includes(w.toLowerCase()))
        })()
        if (isAllCapsHeading || isTitleCaseHeading) {
            sections.push({ type: 'heading', text: line })
        } else {
            sections.push({ type: 'paragraph', text: line })
        }
        i++
    }

    return { title, full_title, slug, description, sections }
}

function BlogEditor({ blog, onSave, onCancel, saving, token, aiPrefill }) {
    const isEditing = !!blog?.id
    const existingCopy = isEditing ? rebuildCopyFromBlog(blog) : (aiPrefill?.content || '')

    const [rawCopy, setRawCopy] = useState(existingCopy)
    const [imageUrl, setImageUrl] = useState(blog?.image_url || aiPrefill?.imageUrl || '')
    const [imageData, setImageData] = useState(aiPrefill?.imageData || null)
    const [imageMime, setImageMime] = useState(aiPrefill?.imageMime || null)
    const [uploading, setUploading] = useState(false)
    const textareaRef = useRef(null)

    const wrapSelection = (before, after) => {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const selected = rawCopy.slice(start, end)
        if (!selected) return
        const wrapped = before + selected + after
        const newCopy = rawCopy.slice(0, start) + wrapped + rawCopy.slice(end)
        setRawCopy(newCopy)
        setTimeout(() => {
            ta.focus()
            ta.selectionStart = start + before.length
            ta.selectionEnd = start + before.length + selected.length
        }, 0)
    }

    const handleBold = () => wrapSelection('**', '**')
    const handleItalic = () => wrapSelection('*', '*')
    const handleHeading = () => {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const selected = rawCopy.slice(start, end)
        if (!selected) return
        const upper = selected.toUpperCase()
        const newCopy = rawCopy.slice(0, start) + upper + rawCopy.slice(end)
        setRawCopy(newCopy)
        setTimeout(() => { ta.focus(); ta.selectionStart = start; ta.selectionEnd = start + upper.length }, 0)
    }
    const handleLink = () => {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const selected = rawCopy.slice(start, end)
        const url = prompt('Enter URL:')
        if (!url) return
        const linkText = selected || 'link text'
        const md = `[${linkText}](${url})`
        const newCopy = rawCopy.slice(0, start) + md + rawCopy.slice(end)
        setRawCopy(newCopy)
        setTimeout(() => { ta.focus() }, 0)
    }

    const parsed = parseCopyToPost(rawCopy)

    const [generatingCover, setGeneratingCover] = useState(false)

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)
        try {
            const res = await fetch(`${API_BASE}/api/admin/upload?type=blog`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (data.url) setImageUrl(data.url)
            if (data.imageData) {
                setImageData(data.imageData)
                setImageMime(data.imageMime)
            }
        } catch (e) {
            console.error(e)
        }
        setUploading(false)
    }

    const handleGenerateCover = async () => {
        const title = parsed.title || blog?.title || ''
        if (!title) return
        setGeneratingCover(true)
        try {
            const res = await fetch(`${API_BASE}/api/admin/ai/image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description: parsed.description || '' }),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setImageData(data.imageData)
            setImageMime(data.imageMime)
            setImageUrl(`data:${data.imageMime};base64,${data.imageData}`)
        } catch (e) {
            console.error(e)
        }
        setGeneratingCover(false)
    }

    const handleSave = () => {
        const seoMeta = aiPrefill?.seoMeta || {}
        const existingMeta = blog?.meta || {}
        const blogData = {
            slug: parsed.slug || blog?.slug || '',
            title: parsed.title,
            full_title: parsed.full_title,
            date: blog?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            author: 'DESIFEST',
            category: seoMeta.primary_keyword ? 'Editorial' : (blog?.category || 'Press'),
            description: seoMeta.meta_description || parsed.description,
            image_url: imageUrl,
            badge: seoMeta.primary_keyword ? '' : 'FOR IMMEDIATE RELEASE',
            meta: {
                ...existingMeta,
                ...(seoMeta.seo_title ? { seo_title: seoMeta.seo_title } : {}),
                ...(seoMeta.meta_description ? { meta_description: seoMeta.meta_description } : {}),
                ...(seoMeta.primary_keyword ? { primary_keyword: seoMeta.primary_keyword } : {}),
                ...(seoMeta.secondary_keywords?.length ? { secondary_keywords: seoMeta.secondary_keywords } : {}),
                ...(seoMeta.suggested_links?.length ? { suggested_links: seoMeta.suggested_links } : {}),
            },
            sections: parsed.sections,
            social_links: blog?.social_links || {},
            published: true,
            ...(imageData ? { image_data: imageData, image_mime: imageMime } : {}),
        }
        onSave(blogData)
    }

    return (
        <>
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onCancel} className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <h1 className="oswald-500 text-3xl uppercase">{isEditing ? 'Edit Post' : 'New Post'}</h1>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-400">Cover Image</label>
                        <p className="mb-2 text-xs text-gray-500">Landscape orientation, 1200 x 450px recommended (16:9 or wider)</p>
                        <div className="flex items-center gap-4">
                            {imageUrl && <img src={imageUrl} alt="" className="h-20 w-32 rounded object-cover" />}
                            <label className="flex cursor-pointer items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                <Upload className="h-4 w-4" />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            <button
                                type="button"
                                onClick={handleGenerateCover}
                                disabled={generatingCover}
                                className="flex items-center gap-2 rounded bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                            >
                                <ImagePlus className="h-4 w-4" />
                                {generatingCover ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-400">Paste your copy</label>
                        <p className="mb-2 text-xs text-gray-500">First line = title. ALL CAPS lines = headings. "Quoted text" = quote. Lines starting with - = bullet list. **bold**, *italic*, [text](url) for rich formatting.</p>
                        <div className="flex items-center gap-1 border border-white/10 border-b-0 bg-white/[0.03] px-2 py-1.5">
                            <button type="button" onClick={handleBold} title="Bold (select text first)" className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                                <Bold className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={handleItalic} title="Italic (select text first)" className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                                <Italic className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={handleLink} title="Insert Link (select text first)" className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                                <Link2 className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={handleHeading} title="Make Heading (select text first)" className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white">
                                <Heading className="h-4 w-4" />
                            </button>
                            <span className="ml-2 text-xs text-gray-600">Select text, then click a button</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={rawCopy}
                            onChange={e => setRawCopy(e.target.value)}
                            rows={18}
                            placeholder={"Your blog title goes here\n\nIntro paragraph goes here...\n\nHEADING IN ALL CAPS\n\nBody paragraph continues here...\n\n\"A quoted statement goes here\"\n\u2014 Attribution Name\n\n- Bullet point one\n- Bullet point two\n\n[EVENT]\nDate: June 19, 2026\nVenue: Sankofa Square\nTime: 11AM - 11PM\n\n[CONTACT]\nName: Person Name\nRole: Title\nEmail: email@example.com\nPhone: 123-456-7890"}
                            className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm leading-relaxed text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={saving || !parsed.title}
                            className="flex items-center gap-2 bg-[#D5FF00] px-6 py-2.5 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Post'}
                        </button>
                        <button onClick={onCancel} className="border border-white/20 px-6 py-2.5 text-white hover:bg-white/10">
                            Cancel
                        </button>
                    </div>
                </div>

                <div>
                    <label className="mb-3 block text-sm font-medium text-gray-400">Preview</label>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#100422]">
                        {imageUrl ? (
                            <div className="relative">
                                <img src={imageUrl} alt="" className="h-[200px] w-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#100422] via-[#100422]/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-xs uppercase tracking-widest text-[#D5FF00]">FOR IMMEDIATE RELEASE</p>
                                    <h2 className="oswald-500 mt-1 text-lg leading-tight text-white">{parsed.full_title || 'Your title here...'}</h2>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[200px] items-center justify-center bg-white/5">
                                <p className="text-sm text-gray-600">Cover image preview</p>
                            </div>
                        )}

                        <div className="p-4">
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#d6cfea]">
                                <span>{blog?.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="text-[#D5FF00]">|</span>
                                <span>by DESIFEST</span>
                                <span className="text-[#D5FF00]">|</span>
                                <span>Press</span>
                            </div>
                            <div className="h-[1px] w-full bg-white/20" />
                            <div className="mt-3 max-h-[300px] space-y-3 overflow-y-auto text-sm leading-relaxed text-[#f5f1fb]">
                                {parsed.sections.length === 0 && (
                                    <p className="text-gray-600">Start typing to see your content here...</p>
                                )}
                                {parsed.sections.map((section, i) => (
                                    <PreviewSection key={i} section={section} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function PreviewSection({ section }) {
    switch (section.type) {
        case 'intro':
            return <p className="text-sm font-medium text-white">{section.text}</p>
        case 'heading':
            return <h3 className="oswald-500 mt-2 text-base uppercase text-[#D5FF00]">{section.text}</h3>
        case 'paragraph':
            return <p className="text-sm text-[#d6cfea]">{section.text}</p>
        case 'quote':
            return (
                <blockquote className="rounded border-l-2 border-[#D5FF00] bg-white/5 px-3 py-2 text-sm text-white">
                    <span className="font-medium">{section.text}</span>
                    {section.attribution && <span className="mt-1 block text-xs text-gray-400">&mdash; {section.attribution}</span>}
                </blockquote>
            )
        case 'list':
            return (
                <ul className="list-disc space-y-1 pl-5 text-sm text-[#d6cfea] marker:text-[#D5FF00]">
                    {section.items?.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )
        case 'event-details':
            return (
                <div className="rounded border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="mb-1 text-xs font-medium uppercase text-[#D5FF00]">Event Details</p>
                    {section.venue && <p className="text-[#d6cfea]">{section.venue}</p>}
                    {section.date && <p className="text-[#d6cfea]">{section.date}</p>}
                    {section.time && <p className="text-[#d6cfea]">{section.time}</p>}
                </div>
            )
        case 'contact-card':
            return (
                <div className="rounded border border-white/10 bg-white/5 p-3 text-sm">
                    <p className="mb-1 text-xs font-medium uppercase text-[#D5FF00]">Media Contact</p>
                    {section.name && <p className="font-medium text-white">{section.name}</p>}
                    {section.role && <p className="text-[#d6cfea]">{section.role}</p>}
                    {section.email && <p className="text-[#d6cfea]">{section.email}</p>}
                    {section.phone && <p className="text-[#d6cfea]">{section.phone}</p>}
                    {section.website && <p className="text-[#d6cfea]">{section.website}</p>}
                    {section.location && <p className="text-[#d6cfea]">{section.location}</p>}
                </div>
            )
        default:
            return null
    }
}

function rebuildCopyFromBlog(blog) {
    const lines = []
    if (blog.full_title || blog.title) lines.push(blog.full_title || blog.title)
    if (blog.sections) {
        for (const s of blog.sections) {
            if (s.type === 'intro' || s.type === 'paragraph') lines.push(s.text || '')
            else if (s.type === 'heading') lines.push((s.text || '').toUpperCase())
            else if (s.type === 'quote') {
                const q = s.text || ''
                const quoted = q.startsWith('"') ? q : `\u201C${q}\u201D`
                lines.push(quoted)
                if (s.attribution) lines.push(`\u2014 ${s.attribution}`)
            }
            else if (s.type === 'list' && s.items) {
                s.items.forEach(item => lines.push(`\u2022 ${item}`))
            }
            else if (s.type === 'event-details') {
                lines.push('[EVENT]')
                if (s.date) lines.push(`Date: ${s.date}`)
                if (s.venue) lines.push(`Venue: ${s.venue}`)
                if (s.time) lines.push(`Time: ${s.time}`)
            }
            else if (s.type === 'contact-card') {
                lines.push('[CONTACT]')
                if (s.name) lines.push(`Name: ${s.name}`)
                if (s.role) lines.push(`Role: ${s.role}`)
                if (s.email) lines.push(`Email: ${s.email}`)
                if (s.phone) lines.push(`Phone: ${s.phone}`)
                if (s.website) lines.push(`Website: ${s.website}`)
                if (s.location) lines.push(`Location: ${s.location}`)
            }
        }
    }
    return lines.join('\n\n')
}

const PAGE_DEFINITIONS = [
    {
        slug: 'home',
        name: 'Homepage',
        sections: [
            { key: 'hero_line1', label: 'Hero Line 1', type: 'text' },
            { key: 'hero_line2', label: 'Hero Line 2', type: 'text' },
            { key: 'hero_line3', label: 'Hero Line 3', type: 'text' },
            { key: 'hero_description', label: 'Hero Description', type: 'text' },
            { key: 'hero_date', label: 'Event Date', type: 'text' },
            { key: 'hero_location', label: 'Event Location', type: 'text' },
            { key: 'hero_year', label: 'Event Year', type: 'text' },
            { key: 'hero_anniversary', label: 'Anniversary Text', type: 'text' },
            { key: 'artists_section_title', label: 'Artists Section Title', type: 'text' },
            { key: 'community_section_title', label: 'Community Section Title', type: 'text' },
            { key: 'govt_support_title', label: 'Government Support Title', type: 'text' },
            { key: 'contact_heading', label: 'Contact Section Heading', type: 'text' },
            { key: 'hero_cta_btn', label: 'Hero CTA Button Text', type: 'text' },
            { key: 'stat1_value', label: 'Stat 1 Value (e.g. 56M+)', type: 'text' },
            { key: 'stat1_label', label: 'Stat 1 Label (e.g. ALUMNI ARTISTS)', type: 'text' },
            { key: 'stat2_value', label: 'Stat 2 Value (e.g. 300K+)', type: 'text' },
            { key: 'stat2_label', label: 'Stat 2 Label (e.g. COMMUNITY ARTISTS)', type: 'text' },
            { key: 'stat3_value', label: 'Stat 3 Value (e.g. 2K+)', type: 'text' },
            { key: 'stat3_label', label: 'Stat 3 Label (e.g. YEAR ROUND PROGRAM)', type: 'text' },
            { key: 'stat4_value', label: 'Stat 4 Value (e.g. 1000HR+)', type: 'text' },
            { key: 'stat4_label', label: 'Stat 4 Label (e.g. OPEN MIC)', type: 'text' },
            { key: 'hero_cta_explore', label: 'Hero CTA Line 1 (e.g. Explore)', type: 'text' },
            { key: 'hero_cta_join', label: 'Hero CTA Line 2 (e.g. Join)', type: 'text' },
            { key: 'hero_cta_enjoy', label: 'Hero CTA Line 3 (e.g. Enjoy)', type: 'text' },
            { key: 'partner_support_title', label: 'Partners & Sponsors Section Title', type: 'text' },
            { key: 'presenting_sponsor_title', label: 'Presenting Sponsor Section Title', type: 'text' },
            { key: 'marquee_text1', label: 'Marquee Ribbon Text 1', type: 'text' },
            { key: 'marquee_text2', label: 'Marquee Ribbon Text 2', type: 'text' },
            { key: 'animation_video_url', label: 'Homepage Background Video', type: 'video' },
            { key: 'shop_product1_title', label: 'Shop Product 1 Title', type: 'text' },
            { key: 'shop_product1_price', label: 'Shop Product 1 Price', type: 'text' },
            { key: 'shop_product1_link', label: 'Shop Product 1 Link', type: 'text' },
            { key: 'shop_product2_title', label: 'Shop Product 2 Title', type: 'text' },
            { key: 'shop_product2_price', label: 'Shop Product 2 Price', type: 'text' },
            { key: 'shop_product2_link', label: 'Shop Product 2 Link', type: 'text' },
            { key: 'shop_product3_title', label: 'Shop Product 3 Title', type: 'text' },
            { key: 'shop_product3_price', label: 'Shop Product 3 Price', type: 'text' },
            { key: 'shop_product3_link', label: 'Shop Product 3 Link', type: 'text' },
            { key: 'shop_product4_title', label: 'Shop Product 4 Title', type: 'text' },
            { key: 'shop_product4_price', label: 'Shop Product 4 Price', type: 'text' },
            { key: 'shop_product4_link', label: 'Shop Product 4 Link', type: 'text' },
            { key: 'shop_product5_title', label: 'Shop Product 5 Title', type: 'text' },
            { key: 'shop_product5_price', label: 'Shop Product 5 Price', type: 'text' },
            { key: 'shop_product5_link', label: 'Shop Product 5 Link', type: 'text' },
            { key: 'shop_viewall_text', label: 'Shop View All Button Text', type: 'text' },
            { key: 'community_card1_title', label: 'Community Card 1 Title', type: 'text' },
            { key: 'community_card2_title', label: 'Community Card 2 Title', type: 'text' },
            { key: 'community_card3_title', label: 'Community Card 3 Title', type: 'text' },
            { key: 'shop_visible', label: 'Show Shop Section (true/false)', type: 'text' },
            { key: 'shop_title', label: 'Shop Section Title', type: 'text' },
            { key: 'blog_section_title', label: 'Blog Section Title', type: 'text' },
            { key: 'contact_subtitle', label: 'Contact Subtitle', type: 'text' },
            { key: 'hero_artist_image', label: 'Hero Artist Image', type: 'image', defaultSrc: asset('home/Artist.png') },
            { key: 'hero_arrow_image', label: 'Hero Arrow Image', type: 'image', defaultSrc: asset('home/image.png') },
            { key: 'home_background_2', label: 'Artists Section Background', type: 'image', defaultSrc: asset('home/background_2.png') },
            { key: 'artist_img1', label: 'Artists Carousel Image 1', type: 'image', defaultSrc: asset('home/animation/image1.png') },
            { key: 'artist_img2', label: 'Artists Carousel Image 2', type: 'image', defaultSrc: asset('home/animation/image2.png') },
            { key: 'artist_img3', label: 'Artists Carousel Image 3', type: 'image', defaultSrc: asset('home/animation/image3.png') },
            { key: 'community_img1', label: 'Community Image 1', type: 'image', defaultSrc: asset('home/Community/image1.png') },
            { key: 'community_img2', label: 'Community Image 2', type: 'image', defaultSrc: asset('home/Community/image2.png') },
            { key: 'community_img3', label: 'Community Image 3', type: 'image', defaultSrc: asset('home/Community/image3.png') },
            { key: 'contact_bg_desktop', label: 'Contact Background (Desktop)', type: 'image', defaultSrc: asset('home/Contact_us_bg.png') },
            { key: 'contact_bg_mobile', label: 'Contact Background (Mobile)', type: 'image', defaultSrc: asset('home/image copy 2.png') },
            { key: 'media_bg', label: 'Blog & Media Background', type: 'image', defaultSrc: asset('home/Media/image copy.png') },
            { key: 'shop_img1', label: 'Shop Product 1', type: 'image', defaultSrc: asset('home/Shop/Shop1.png') },
            { key: 'shop_img2', label: 'Shop Product 2', type: 'image', defaultSrc: asset('home/Shop/Shop2.png') },
            { key: 'shop_img3', label: 'Shop Product 3', type: 'image', defaultSrc: asset('home/Shop/Shop3.png') },
            { key: 'shop_img4', label: 'Shop Product 4', type: 'image', defaultSrc: asset('home/Shop/Shop4.png') },
            { key: 'shop_img5', label: 'Shop Product 5', type: 'image', defaultSrc: asset('home/Shop/Shop5.png') },
            { key: 'govt_logo1', label: 'Government Logo 1 (Ontario Trillium)', type: 'image', defaultSrc: asset('home/govtsupp/image.png') },
            { key: 'govt_logo2', label: 'Government Logo 2 (Ontario Creates)', type: 'image', defaultSrc: asset('home/govtsupp/image copy.png') },
            { key: 'govt_logo3', label: 'Government Logo 3 (Factor)', type: 'image', defaultSrc: asset('home/govtsupp/image copy 2.png') },
            { key: 'govt_logo4', label: 'Government Logo 4 (Toronto Arts)', type: 'image', defaultSrc: asset('home/govtsupp/image copy 3.png') },
            { key: 'govt_logo5', label: 'Government Logo 5 (City of Toronto)', type: 'image', defaultSrc: asset('home/govtsupp/image copy 4.png') },
            { key: 'govt_logo6', label: 'Government Logo 6 (Canada)', type: 'image', defaultSrc: asset('home/govtsupp/image copy 5.png') },
            { key: 'partner_logo1', label: 'Partner Logo 1', type: 'image', defaultSrc: asset('home/partnersupp/image.png') },
            { key: 'partner_logo2', label: 'Partner Logo 2', type: 'image', defaultSrc: asset('home/partnersupp/image copy.png') },
            { key: 'partner_logo3', label: 'Partner Logo 3', type: 'image', defaultSrc: asset('home/partnersupp/image copy 2.png') },
            { key: 'partner_logo4', label: 'Partner Logo 4', type: 'image', defaultSrc: asset('home/partnersupp/image copy 4.png') },
            { key: 'partner_logo5', label: 'Partner Logo 5', type: 'image', defaultSrc: asset('home/partnersupp/image copy 5.png') },
            { key: 'presenting_logo1', label: 'Presenting Sponsor Logo', type: 'image', defaultSrc: asset('home/partnersupp/image6.png') },
        ],
    },
    {
        slug: 'about',
        name: 'About',
        sections: [
            { key: 'hero_label', label: 'Hero Label', type: 'text' },
            { key: 'hero_line1', label: 'Hero Line 1', type: 'text' },
            { key: 'hero_line2', label: 'Hero Line 2', type: 'text' },
            { key: 'about_mission_title', label: 'Mission Card Title', type: 'text' },
            { key: 'about_mission_desc', label: 'Mission Card Description', type: 'text' },
            { key: 'about_vision_title', label: 'Vision Card Title', type: 'text' },
            { key: 'about_vision_desc', label: 'Vision Card Description', type: 'text' },
            { key: 'about_culture_title', label: 'Culture Card Title', type: 'text' },
            { key: 'about_culture_desc', label: 'Culture Card Description', type: 'text' },
            { key: 'about_support_title', label: 'Support Card Title', type: 'text' },
            { key: 'about_support_desc', label: 'Support Card Description', type: 'text' },
            { key: 'about_col2img', label: 'About Column Image', type: 'image', defaultSrc: asset('about/col2img.png') },
            { key: 'about_img2', label: 'About Image 2', type: 'image', defaultSrc: asset('about/abouttwo.svg') },
            { key: 'about_img3', label: 'About Image 3', type: 'image', defaultSrc: asset('about/aboutthree.svg') },
            { key: 'about_img4', label: 'About Image 4', type: 'image', defaultSrc: asset('about/aboutfour.svg') },
        ],
    },
    {
        slug: 'concerts',
        name: 'Concerts',
        sections: [
            { key: 'hero_line1', label: 'Hero Title Line 1', type: 'text' },
            { key: 'hero_taglines', label: 'Hero Taglines (one per line)', type: 'text' },
            { key: 'hero_year', label: 'Hero Year', type: 'text' },
            { key: 'hero_line2', label: 'Hero Title Line 2', type: 'text' },
            { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
            { key: 'artist_signup_btn', label: 'Artist Signup Button Text', type: 'text' },
            { key: 'volunteer_btn', label: 'Volunteer Button Text', type: 'text' },
            { key: 'day1_label', label: 'Day 1 Label', type: 'text' },
            { key: 'day1_date', label: 'Day 1 Date', type: 'text' },
            { key: 'day1_time', label: 'Day 1 Time', type: 'text' },
            { key: 'day1_title', label: 'Day 1 Title', type: 'text' },
            { key: 'day1_description', label: 'Day 1 Description', type: 'text' },
            { key: 'day2_label', label: 'Day 2 Label', type: 'text' },
            { key: 'day2_date', label: 'Day 2 Date', type: 'text' },
            { key: 'day2_time', label: 'Day 2 Time', type: 'text' },
            { key: 'day2_title', label: 'Day 2 Title', type: 'text' },
            { key: 'day2_description', label: 'Day 2 Description', type: 'text' },
            { key: 'artist_form_bg', label: 'Artist Form Background', type: 'image', defaultSrc: asset('concerts/artistform.png') },
            { key: 'volunteer_form_bg', label: 'Volunteer Form Background', type: 'image', defaultSrc: asset('concerts/volunteerform.png') },
        ],
    },
    {
        slug: 'volunteersignup',
        name: 'Volunteer Signup',
        sections: [
            { key: 'hero_title', label: 'Page Title', type: 'text' },
            { key: 'hero_subtitle', label: 'Page Subtitle', type: 'text' },
            { key: 'hero_bg', label: 'Hero Background Image', type: 'image', defaultSrc: asset('concerts/volunteerform.png') },
        ],
    },
    {
        slug: 'community',
        name: 'Community',
        sections: [
            { key: 'hero_line1', label: 'Hero Line 1', type: 'text' },
            { key: 'hero_line2', label: 'Hero Line 2', type: 'text' },
            { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
            { key: 'hero_subtitle2', label: 'Hero Subtitle Line 2', type: 'text' },
            { key: 'open_mic_btn', label: 'Open Mic Button Text', type: 'text' },
            { key: 'sofa_btn', label: 'Sofa Sessions Button Text', type: 'text' },
        ],
    },
    {
        slug: 'media',
        name: 'Media & Press',
        sections: [
            { key: 'hero_top_text', label: 'Hero Top Text', type: 'text' },
            { key: 'hero_title', label: 'Hero Title', type: 'text' },
            { key: 'press_details_text', label: 'Press Details Text', type: 'text' },
            { key: 'mission_label', label: 'Mission Label', type: 'text' },
            { key: 'mission_heading_line1', label: 'Mission Heading (colored words)', type: 'text' },
            { key: 'mission_description', label: 'Mission Description', type: 'text' },
            { key: 'mission_stat1_label', label: 'Mission Stat 1 Label (e.g. FACEBOOK FANS)', type: 'text' },
            { key: 'mission_stat1_value', label: 'Mission Stat 1 Value (e.g. 13K+)', type: 'text' },
            { key: 'mission_stat2_label', label: 'Mission Stat 2 Label (e.g. INSTAGRAM FANS)', type: 'text' },
            { key: 'mission_stat2_value', label: 'Mission Stat 2 Value (e.g. 28K+)', type: 'text' },
            { key: 'mission_stat3_label', label: 'Mission Stat 3 Label (e.g. TOTAL IMPRESSIONS)', type: 'text' },
            { key: 'mission_stat3_value', label: 'Mission Stat 3 Value (e.g. 45M+)', type: 'text' },
            { key: 'mission_stat4_label', label: 'Mission Stat 4 Label (e.g. FESTIVAL ATTENDANCE)', type: 'text' },
            { key: 'mission_stat4_value', label: 'Mission Stat 4 Value (e.g. 65K+)', type: 'text' },
            { key: 'contact1_name', label: 'Contact 1 Name', type: 'text' },
            { key: 'contact1_designation', label: 'Contact 1 Designation', type: 'text' },
            { key: 'contact1_phone', label: 'Contact 1 Phone', type: 'text' },
            { key: 'contact1_email', label: 'Contact 1 Email', type: 'text' },
            { key: 'contact2_name', label: 'Contact 2 Name', type: 'text' },
            { key: 'contact2_designation', label: 'Contact 2 Designation', type: 'text' },
            { key: 'contact2_phone', label: 'Contact 2 Phone', type: 'text' },
            { key: 'contact2_email', label: 'Contact 2 Email', type: 'text' },
            { key: 'contact3_name', label: 'Contact 3 Name', type: 'text' },
            { key: 'contact3_designation', label: 'Contact 3 Designation', type: 'text' },
            { key: 'contact3_phone', label: 'Contact 3 Phone', type: 'text' },
            { key: 'contact3_email', label: 'Contact 3 Email', type: 'text' },
            { key: 'logos_title', label: 'Official Logos Section Title', type: 'text' },
            { key: 'contacts_heading', label: 'Contacts Section Heading', type: 'text' },
            { key: 'media_bw_logo', label: 'B&W Logo', type: 'image', defaultSrc: asset('media/bw.svg') },
            { key: 'media_color_logo', label: 'Color Logo', type: 'image', defaultSrc: asset('media/color.svg') },
            { key: 'boost_bg', label: 'Boost Section Background', type: 'image', defaultSrc: asset('media/BACKGROUND.png') },
            { key: 'boost_img1', label: 'Boost Image 1', type: 'image', defaultSrc: asset('media/Boost/image1.png') },
            { key: 'boost_img2', label: 'Boost Image 2', type: 'image', defaultSrc: asset('media/Boost/image2.png') },
            { key: 'boost_img3', label: 'Boost Image 3', type: 'image', defaultSrc: asset('media/Boost/image3.png') },
            { key: 'boost_img4', label: 'Boost Image 4', type: 'image', defaultSrc: asset('media/Boost/image4.png') },
        ],
    },
    {
        slug: 'sponsorship',
        name: 'Sponsorship',
        sections: [
            { key: 'description', label: 'Sponsorship Description', type: 'text' },
            { key: 'video1_url', label: 'Main Sponsorship Video', type: 'video' },
            { key: 'calendar_url', label: 'Google Calendar Appointment URL', type: 'text' },
        ],
    },
    {
        slug: 'artists',
        name: 'Our Artists',
        sections: [
            { key: 'hero_line1', label: 'Hero Line 1', type: 'text' },
            { key: 'hero_line2', label: 'Hero Line 2', type: 'text' },
            { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
            { key: 'hero_image', label: 'Hero Background Image', type: 'image', defaultSrc: asset('artist/Hero.png') },
            { key: 'featured_img1', label: 'Featured Artist 1', type: 'image', defaultSrc: asset('artist/Featured/image 1.png') },
            { key: 'featured_img2', label: 'Featured Artist 2', type: 'image', defaultSrc: asset('artist/Featured/image 2.png') },
            { key: 'featured_img3', label: 'Featured Artist 3', type: 'image', defaultSrc: asset('artist/Featured/image 3.png') },
        ],
    },
    {
        slug: 'press-kit',
        name: 'Press Kit',
        sections: [
            { key: 'hero_top_heading', label: 'Top Heading', type: 'text' },
            { key: 'hero_title', label: 'Main Title', type: 'text' },
            { key: 'hero_subtext', label: 'Subtext', type: 'text' },
            { key: 'download_btn', label: 'Download Button Text', type: 'text' },
            { key: 'presskit_bg', label: 'Press Kit Background', type: 'image', defaultSrc: asset('media/BACKGROUND.png') },
        ],
    },
    {
        slug: 'openmic',
        name: 'Open Mic',
        sections: [
            { key: 'hero_title', label: 'Hero Title', type: 'text' },
            { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'text' },
            { key: 'featured_section_title', label: 'Featured Artists Section Title', type: 'text' },
            { key: 'seasons_section_title', label: 'Seasons Section Title', type: 'text' },
            { key: 'session1_name', label: 'Session 1 Name', type: 'text' },
            { key: 'session1_handle', label: 'Session 1 Handle', type: 'text' },
            { key: 'session2_name', label: 'Session 2 Name', type: 'text' },
            { key: 'session2_handle', label: 'Session 2 Handle', type: 'text' },
            { key: 'session3_name', label: 'Session 3 Name', type: 'text' },
            { key: 'session3_handle', label: 'Session 3 Handle', type: 'text' },
            { key: 'hero_image', label: 'Hero Background Image', type: 'image', defaultSrc: asset('openmic/image.png') },
            { key: 'session_img1', label: 'Session Image 1', type: 'image', defaultSrc: asset('openmic/Session/session 1.jpg') },
            { key: 'session_img2', label: 'Session Image 2', type: 'image', defaultSrc: asset('openmic/Session/session 2.jpg') },
            { key: 'session_img3', label: 'Session Image 3', type: 'image', defaultSrc: asset('openmic/Session/session 3.jpg') },
            { key: 'featured_name1', label: 'Featured Artist 1 Name', type: 'text' },
            { key: 'featured_handle1', label: 'Featured Artist 1 Handle', type: 'text' },
            { key: 'featured_img1', label: 'Featured Artist 1 Image', type: 'image', defaultSrc: asset('openmic/Featured/image1.png') },
            { key: 'featured_name2', label: 'Featured Artist 2 Name', type: 'text' },
            { key: 'featured_handle2', label: 'Featured Artist 2 Handle', type: 'text' },
            { key: 'featured_img2', label: 'Featured Artist 2 Image', type: 'image', defaultSrc: asset('openmic/Featured/image2.png') },
            { key: 'featured_name3', label: 'Featured Artist 3 Name', type: 'text' },
            { key: 'featured_handle3', label: 'Featured Artist 3 Handle', type: 'text' },
            { key: 'featured_img3', label: 'Featured Artist 3 Image', type: 'image', defaultSrc: asset('openmic/Featured/image3.png') },
            { key: 'featured_name4', label: 'Featured Artist 4 Name', type: 'text' },
            { key: 'featured_handle4', label: 'Featured Artist 4 Handle', type: 'text' },
            { key: 'featured_img4', label: 'Featured Artist 4 Image', type: 'image', defaultSrc: asset('openmic/Featured/image4.png') },
            { key: 'featured_name5', label: 'Featured Artist 5 Name', type: 'text' },
            { key: 'featured_handle5', label: 'Featured Artist 5 Handle', type: 'text' },
            { key: 'featured_img5', label: 'Featured Artist 5 Image', type: 'image', defaultSrc: asset('openmic/Featured/image5.png') },
            { key: 'featured_name6', label: 'Featured Artist 6 Name', type: 'text' },
            { key: 'featured_handle6', label: 'Featured Artist 6 Handle', type: 'text' },
            { key: 'featured_img6', label: 'Featured Artist 6 Image', type: 'image', defaultSrc: asset('openmic/Featured/image6.png') },
            { key: 'featured_name7', label: 'Featured Artist 7 Name', type: 'text' },
            { key: 'featured_handle7', label: 'Featured Artist 7 Handle', type: 'text' },
            { key: 'featured_img7', label: 'Featured Artist 7 Image', type: 'image', defaultSrc: asset('openmic/Featured/image7.png') },
            { key: 'featured_name8', label: 'Featured Artist 8 Name', type: 'text' },
            { key: 'featured_handle8', label: 'Featured Artist 8 Handle', type: 'text' },
            { key: 'featured_img8', label: 'Featured Artist 8 Image', type: 'image', defaultSrc: asset('openmic/Featured/image8.png') },
            { key: 'featured_name9', label: 'Featured Artist 9 Name', type: 'text' },
            { key: 'featured_handle9', label: 'Featured Artist 9 Handle', type: 'text' },
            { key: 'featured_img9', label: 'Featured Artist 9 Image', type: 'image', defaultSrc: asset('openmic/Featured/image9.png') },
            { key: 'featured_name10', label: 'Featured Artist 10 Name', type: 'text' },
            { key: 'featured_handle10', label: 'Featured Artist 10 Handle', type: 'text' },
            { key: 'featured_img10', label: 'Featured Artist 10 Image', type: 'image', defaultSrc: asset('openmic/Featured/image10.png') },
            { key: 'featured_name11', label: 'Featured Artist 11 Name', type: 'text' },
            { key: 'featured_handle11', label: 'Featured Artist 11 Handle', type: 'text' },
            { key: 'featured_img11', label: 'Featured Artist 11 Image', type: 'image', defaultSrc: asset('openmic/Featured/image11.png') },
            { key: 'featured_name12', label: 'Featured Artist 12 Name', type: 'text' },
            { key: 'featured_handle12', label: 'Featured Artist 12 Handle', type: 'text' },
            { key: 'featured_img12', label: 'Featured Artist 12 Image', type: 'image', defaultSrc: asset('openmic/Featured/image12.png') },
            { key: 'featured_name13', label: 'Featured Artist 13 Name', type: 'text' },
            { key: 'featured_handle13', label: 'Featured Artist 13 Handle', type: 'text' },
            { key: 'featured_img13', label: 'Featured Artist 13 Image', type: 'image', defaultSrc: asset('openmic/Featured/image13.png') },
            { key: 'featured_name14', label: 'Featured Artist 14 Name', type: 'text' },
            { key: 'featured_handle14', label: 'Featured Artist 14 Handle', type: 'text' },
            { key: 'featured_img14', label: 'Featured Artist 14 Image', type: 'image', defaultSrc: asset('openmic/Featured/image14.png') },
            { key: 'featured_name15', label: 'Featured Artist 15 Name', type: 'text' },
            { key: 'featured_handle15', label: 'Featured Artist 15 Handle', type: 'text' },
            { key: 'featured_img15', label: 'Featured Artist 15 Image', type: 'image', defaultSrc: asset('openmic/Featured/image15.png') },
            { key: 'featured_name16', label: 'Featured Artist 16 Name', type: 'text' },
            { key: 'featured_handle16', label: 'Featured Artist 16 Handle', type: 'text' },
            { key: 'featured_img16', label: 'Featured Artist 16 Image', type: 'image', defaultSrc: asset('openmic/Featured/image16.png') },
        ],
    },
    {
        slug: 'sofa-sessions',
        name: 'Sofa Sessions',
        sections: [
            { key: 'youtube_url', label: 'YouTube Video Embed URL', type: 'text' },
            { key: 'card1_title', label: 'Card 1 Title', type: 'text' },
            { key: 'card1_description', label: 'Card 1 Description', type: 'text' },
            { key: 'card2_title', label: 'Card 2 Title', type: 'text' },
            { key: 'card2_description', label: 'Card 2 Description', type: 'text' },
            { key: 'card3_title', label: 'Card 3 Title', type: 'text' },
            { key: 'card3_description', label: 'Card 3 Description', type: 'text' },
            { key: 'hero_bg', label: 'Hero Background', type: 'image', defaultSrc: asset('sofa_session/sofasessionbg.png') },
            { key: 'hero_circles', label: 'Hero White Circles', type: 'image', defaultSrc: asset('sofa_session/whitecircles.png') },
            { key: 'contact_desktop', label: 'Contact Image (Desktop)', type: 'image', defaultSrc: asset('sofa_session/sofacontactdesktop.svg') },
            { key: 'contact_mobile', label: 'Contact Image (Mobile)', type: 'image', defaultSrc: asset('sofa_session/sofacontactmobile.svg') },
            { key: 'carousel_img1', label: 'Carousel Image 1', type: 'image', defaultSrc: asset('sofa_session/ssone.svg') },
            { key: 'carousel_img2', label: 'Carousel Image 2', type: 'image', defaultSrc: asset('sofa_session/sstwo.svg') },
            { key: 'carousel_img3', label: 'Carousel Image 3', type: 'image', defaultSrc: asset('sofa_session/ssthree.svg') },
            { key: 'carousel_img4', label: 'Carousel Image 4', type: 'image', defaultSrc: asset('sofa_session/ssfour.svg') },
            { key: 'carousel_img5', label: 'Carousel Image 5', type: 'image', defaultSrc: asset('sofa_session/ssfive.svg') },
            { key: 'second_section_img', label: 'Card 1 Image (The Beginning)', type: 'image', defaultSrc: asset('sofa_session/sofasessionsecondsection.svg') },
            { key: 'card2_img', label: 'Card 2 Image (Artist Platform)', type: 'image', defaultSrc: asset('sofa_session/sofasessionsecondsection.svg') },
            { key: 'card3_img', label: 'Card 3 Image (Community & Culture)', type: 'image', defaultSrc: asset('sofa_session/sofasessionsecondsection.svg') },
            { key: 'second_section_bg', label: 'Second Section Background', type: 'image', defaultSrc: asset('sofa_session/sofasessionsecondsectionbg.png') },
        ],
    },
]

function AnalyticsSection({ token, onUnauthorized }) {
    const { data, loading, error } = useAdminFetch('/api/admin/analytics', token)

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const cards = data ? [
        { label: 'Total Artists', value: data.total_artists, icon: Users, color: 'text-purple-400' },
        { label: 'Total Bookings', value: data.total_bookings, icon: BookOpen, color: 'text-blue-400' },
        { label: 'Bookings This Month', value: data.bookings_this_month, icon: Calendar, color: 'text-cyan-400' },
        { label: 'Conversion Rate', value: `${data.conversion_rate}%`, icon: TrendingUp, color: 'text-green-400' },
        { label: 'Commission Pending', value: `$${data.commission_pending.toLocaleString()}`, icon: Clock, color: 'text-yellow-400' },
        { label: 'Commission Collected', value: `$${data.commission_collected.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
        { label: 'Total Enquiries', value: data.total_enquiries, icon: Mail, color: 'text-orange-400' },
    ] : []

    return (
        <>
            <div className="mb-6">
                <h1 className="oswald-500 text-3xl uppercase">Analytics Dashboard</h1>
                <p className="mt-1 text-sm text-gray-400">Overview of platform activity and revenue</p>
            </div>
            {loading && <p className="text-gray-400">Loading analytics...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}
            {!loading && data && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cards.map((card, i) => {
                        const Icon = card.icon
                        return (
                            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-5">
                                <div className="flex items-center gap-3">
                                    <div className={`rounded-lg bg-white/5 p-2 ${card.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.label}</p>
                                        <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

function BookingsSection({ token, onUnauthorized }) {
    const { data: bookings, loading, error, refetch } = useAdminFetch('/api/admin/bookings', token)
    const { data: artists } = useAdminFetch('/api/admin/artists', token)
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedBooking, setSelectedBooking] = useState(null)
    const [showCreate, setShowCreate] = useState(false)
    const [creating, setCreating] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [newBooking, setNewBooking] = useState({ client_name: '', client_email: '', artist_id: '', event_date: '', event_type: '', budget: '', notes: '' })

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const statuses = ['all', 'pending', 'accepted', 'confirmed', 'completed', 'declined']
    const filtered = bookings && statusFilter !== 'all' ? bookings.filter(b => b.status === statusFilter) : bookings

    const handleCreate = async () => {
        if (!newBooking.client_name.trim()) return
        setCreating(true)
        try {
            await fetch(`${API_BASE}/api/admin/bookings`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newBooking, artist_id: newBooking.artist_id || null }),
            })
            setShowCreate(false)
            setNewBooking({ client_name: '', client_email: '', artist_id: '', event_date: '', event_type: '', budget: '', notes: '' })
            refetch()
        } catch (e) { console.error(e) }
        setCreating(false)
    }

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(true)
        try {
            const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })
            if (res.ok) {
                const updated = await res.json()
                setSelectedBooking(prev => prev && prev.id === id ? { ...prev, ...updated } : prev)
                refetch()
            }
        } catch (e) { console.error(e) }
        setUpdating(false)
    }

    const statusBadge = (status) => {
        const styles = {
            pending: 'bg-gray-500/20 text-gray-400',
            accepted: 'bg-blue-500/20 text-blue-400',
            confirmed: 'bg-green-500/20 text-green-400',
            completed: 'bg-emerald-500/20 text-emerald-400',
            declined: 'bg-red-500/20 text-red-400',
        }
        return (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
                {status}
            </span>
        )
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="oswald-500 text-3xl uppercase">Bookings</h1>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90">
                    <Plus className="h-4 w-4" /> New Booking
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {statuses.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 text-sm font-medium uppercase transition ${statusFilter === s ? 'bg-[#D5FF00] text-black' : 'border border-white/20 text-white hover:bg-white/10'}`}>
                        {s}
                    </button>
                ))}
            </div>

            {loading && <p className="text-gray-400">Loading bookings...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}
            {!loading && !error && filtered?.length === 0 && <p className="text-gray-400">No bookings found.</p>}

            {!loading && !error && filtered?.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Artist</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Event Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Budget</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(b => (
                                <tr key={b.id} onClick={() => setSelectedBooking(b)} className="cursor-pointer border-b border-white/10 hover:bg-white/5">
                                    <td className="px-4 py-3 text-gray-300">{b.client_name}</td>
                                    <td className="px-4 py-3 text-gray-300">{[b.artist_first_name, b.artist_last_name].filter(Boolean).join(' ') || '—'}</td>
                                    <td className="px-4 py-3 text-gray-300">{b.event_date ? new Date(b.event_date).toLocaleDateString() : '—'}</td>
                                    <td className="px-4 py-3 text-gray-300">{b.event_type || '—'}</td>
                                    <td className="px-4 py-3">{statusBadge(b.status)}</td>
                                    <td className="px-4 py-3 text-gray-300">{b.budget ? `$${parseFloat(b.budget).toLocaleString()}` : '—'}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(b.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="mt-4 text-sm text-gray-500">Total: {filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>
                </div>
            )}

            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedBooking(null)}>
                    <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-white/10 bg-[#1a0e2e] p-6" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="oswald-500 text-xl uppercase text-white">Booking Details</h2>
                            <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Client</span><span className="text-sm text-gray-300">{selectedBooking.client_name}</span></div>
                            {selectedBooking.client_email && <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Email</span><span className="text-sm text-gray-300">{selectedBooking.client_email}</span></div>}
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Artist</span><span className="text-sm text-gray-300">{[selectedBooking.artist_first_name, selectedBooking.artist_last_name].filter(Boolean).join(' ') || '—'}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Event Date</span><span className="text-sm text-gray-300">{selectedBooking.event_date ? new Date(selectedBooking.event_date).toLocaleDateString() : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Type</span><span className="text-sm text-gray-300">{selectedBooking.event_type || '—'}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Budget</span><span className="text-sm text-gray-300">{selectedBooking.budget ? `$${parseFloat(selectedBooking.budget).toLocaleString()}` : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Commission</span><span className="text-sm text-gray-300">{selectedBooking.commission_amount ? `$${parseFloat(selectedBooking.commission_amount).toLocaleString()}` : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-xs font-semibold uppercase text-[#D5FF00]">Status</span>{statusBadge(selectedBooking.status)}</div>
                            {selectedBooking.notes && <div><span className="text-xs font-semibold uppercase text-[#D5FF00]">Notes</span><p className="mt-1 text-sm text-gray-300">{selectedBooking.notes}</p></div>}
                        </div>
                        <div className="mt-6">
                            <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Update Status</p>
                            <div className="flex flex-wrap gap-2">
                                {['pending', 'accepted', 'confirmed', 'completed', 'declined'].map(s => (
                                    <button key={s} onClick={() => handleUpdateStatus(selectedBooking.id, s)} disabled={updating || selectedBooking.status === s}
                                        className={`rounded px-3 py-1.5 text-xs font-medium transition ${selectedBooking.status === s ? 'bg-[#D5FF00] text-black' : 'border border-white/20 text-gray-300 hover:bg-white/10'} disabled:opacity-50`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowCreate(false)}>
                    <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-white/10 bg-[#1a0e2e] p-6" onClick={e => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="oswald-500 text-xl uppercase text-white">New Booking</h2>
                            <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="space-y-3">
                            <input type="text" placeholder="Client Name *" value={newBooking.client_name} onChange={e => setNewBooking(p => ({ ...p, client_name: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none" />
                            <input type="email" placeholder="Client Email" value={newBooking.client_email} onChange={e => setNewBooking(p => ({ ...p, client_email: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none" />
                            <select value={newBooking.artist_id} onChange={e => setNewBooking(p => ({ ...p, artist_id: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#D5FF00] focus:outline-none">
                                <option value="">Select Artist (optional)</option>
                                {artists?.map(a => <option key={a.id} value={a.id}>{[a.first_name, a.last_name].filter(Boolean).join(' ')}</option>)}
                            </select>
                            <input type="date" value={newBooking.event_date} onChange={e => setNewBooking(p => ({ ...p, event_date: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-[#D5FF00] focus:outline-none" />
                            <input type="text" placeholder="Event Type (e.g. Wedding, Corporate)" value={newBooking.event_type} onChange={e => setNewBooking(p => ({ ...p, event_type: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none" />
                            <input type="number" placeholder="Budget ($)" value={newBooking.budget} onChange={e => setNewBooking(p => ({ ...p, budget: e.target.value }))}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none" />
                            <textarea placeholder="Notes" value={newBooking.notes} onChange={e => setNewBooking(p => ({ ...p, notes: e.target.value }))} rows={3}
                                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#D5FF00] focus:outline-none" />
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button onClick={handleCreate} disabled={creating || !newBooking.client_name.trim()}
                                className="flex items-center gap-2 bg-[#D5FF00] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create Booking'}
                            </button>
                            <button onClick={() => setShowCreate(false)} className="border border-white/20 px-5 py-2 text-sm text-white hover:bg-white/10">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function CommissionsSection({ token, onUnauthorized }) {
    const { data, loading, error, refetch } = useAdminFetch('/api/admin/commissions', token)
    const [marking, setMarking] = useState(null)

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const handleMarkPaid = async (id) => {
        setMarking(id)
        try {
            await fetch(`${API_BASE}/api/admin/commissions/${id}/paid`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            })
            refetch()
        } catch (e) { console.error(e) }
        setMarking(null)
    }

    const stats = data?.stats
    const bookings = data?.bookings || []

    return (
        <>
            <div className="mb-6">
                <h1 className="oswald-500 text-3xl uppercase">Commission Tracking</h1>
                <p className="mt-1 text-sm text-gray-400">Track 15% commission on confirmed and completed bookings</p>
            </div>

            {loading && <p className="text-gray-400">Loading commissions...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}

            {!loading && stats && (
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-medium uppercase text-gray-400">Total Commissionable</p>
                        <p className="mt-1 text-2xl font-bold text-white">{stats.total_commissionable}</p>
                    </div>
                    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                        <p className="text-xs font-medium uppercase text-yellow-400">Commission Pending</p>
                        <p className="mt-1 text-2xl font-bold text-yellow-400">${parseFloat(stats.pending_total).toLocaleString()}</p>
                    </div>
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                        <p className="text-xs font-medium uppercase text-green-400">Commission Collected</p>
                        <p className="mt-1 text-2xl font-bold text-green-400">${parseFloat(stats.collected_total).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {!loading && bookings.length === 0 && <p className="text-gray-400">No confirmed or completed bookings yet.</p>}

            {!loading && bookings.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Artist</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Budget</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Commission (15%)</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#D5FF00]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id} className="border-b border-white/10">
                                    <td className="px-4 py-3 text-gray-300">{b.client_name}</td>
                                    <td className="px-4 py-3 text-gray-300">{[b.artist_first_name, b.artist_last_name].filter(Boolean).join(' ') || '—'}</td>
                                    <td className="px-4 py-3 text-gray-300">{b.budget ? `$${parseFloat(b.budget).toLocaleString()}` : '—'}</td>
                                    <td className="px-4 py-3 font-medium text-white">{b.commission_amount ? `$${parseFloat(b.commission_amount).toLocaleString()}` : '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${b.commission_status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {b.commission_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {b.commission_status !== 'paid' && (
                                            <button onClick={() => handleMarkPaid(b.id)} disabled={marking === b.id}
                                                className="flex items-center gap-1 rounded bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-500/30 disabled:opacity-50">
                                                <CheckCircle className="h-3 w-3" />
                                                {marking === b.id ? 'Marking...' : 'Mark Paid'}
                                            </button>
                                        )}
                                        {b.commission_status === 'paid' && <span className="text-xs text-gray-500">Paid</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

function FeaturedArtistsSection({ token, onUnauthorized }) {
    const { data: artists, loading, error, refetch } = useAdminFetch('/api/admin/featured-artists', token)
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const handleToggleFeatured = async (id, currentFeatured) => {
        setUpdating(id)
        try {
            await fetch(`${API_BASE}/api/admin/artists/${id}/featured-order`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !currentFeatured }),
            })
            refetch()
        } catch (e) { console.error(e) }
        setUpdating(null)
    }

    const handleUpdateOrder = async (id, order) => {
        setUpdating(id)
        try {
            await fetch(`${API_BASE}/api/admin/artists/${id}/featured-order`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured_order: parseInt(order) || 0 }),
            })
            refetch()
        } catch (e) { console.error(e) }
        setUpdating(null)
    }

    const featuredArtists = artists?.filter(a => a.featured) || []
    const otherArtists = artists?.filter(a => !a.featured) || []

    return (
        <>
            <div className="mb-6">
                <h1 className="oswald-500 text-3xl uppercase">Featured Artists</h1>
                <p className="mt-1 text-sm text-gray-400">Toggle featured status and set display order for the artist directory. Lower order numbers appear first.</p>
            </div>

            {loading && <p className="text-gray-400">Loading artists...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}

            {!loading && artists && (
                <>
                    <div className="mb-6">
                        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">
                            <Star className="h-4 w-4 fill-[#D5FF00]" /> Featured ({featuredArtists.length})
                        </h2>
                        {featuredArtists.length === 0 && <p className="text-sm text-gray-500">No featured artists yet. Toggle the star on any approved artist below.</p>}
                        <div className="space-y-2">
                            {featuredArtists.map(a => (
                                <div key={a.id} className="flex items-center justify-between rounded border border-yellow-500/20 bg-yellow-500/5 p-3">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleToggleFeatured(a.id, true)} disabled={updating === a.id}
                                            className="transition hover:scale-110 disabled:opacity-50">
                                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        </button>
                                        <div>
                                            <span className="font-medium text-white">{[a.first_name, a.last_name].filter(Boolean).join(' ')}</span>
                                            <span className="ml-2 text-xs text-gray-400">{a.genre || ''} {a.city ? `· ${a.city}` : ''}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">Order:</span>
                                        <input type="number" defaultValue={a.featured_order || 0}
                                            onBlur={e => handleUpdateOrder(a.id, e.target.value)}
                                            className="w-16 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white focus:border-[#D5FF00] focus:outline-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">Other Approved Artists ({otherArtists.length})</h2>
                        <div className="space-y-2">
                            {otherArtists.map(a => (
                                <div key={a.id} className="flex items-center justify-between rounded border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleToggleFeatured(a.id, false)} disabled={updating === a.id}
                                            className="transition hover:scale-110 disabled:opacity-50">
                                            <Star className="h-5 w-5 text-gray-600 hover:text-yellow-400/60" />
                                        </button>
                                        <div>
                                            <span className="text-sm text-gray-300">{[a.first_name, a.last_name].filter(Boolean).join(' ')}</span>
                                            <span className="ml-2 text-xs text-gray-500">{a.genre || ''} {a.city ? `· ${a.city}` : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

function ReviewsSection({ token, onUnauthorized }) {
    const { data: reviews, loading, error, refetch } = useAdminFetch('/api/admin/reviews', token)
    const [filter, setFilter] = useState('all')
    const [updating, setUpdating] = useState(null)

    useEffect(() => {
        if (error === 'Unauthorized') onUnauthorized()
    }, [error])

    const handleApprove = async (id, approved) => {
        setUpdating(id)
        try {
            await fetch(`${API_BASE}/api/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved }),
            })
            refetch()
        } catch (e) { console.error(e) }
        setUpdating(null)
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this review?')) return
        try {
            await fetch(`${API_BASE}/api/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            refetch()
        } catch (e) { console.error(e) }
    }

    const filtered = reviews ? (filter === 'all' ? reviews : filter === 'pending' ? reviews.filter(r => !r.approved) : reviews.filter(r => r.approved)) : []
    const pendingCount = reviews?.filter(r => !r.approved).length || 0

    return (
        <>
            <div className="mb-6">
                <h1 className="oswald-500 text-3xl uppercase">Review Moderation</h1>
                <p className="mt-1 text-sm text-gray-400">Approve or reject client reviews before they appear on artist profiles</p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                {[['all', 'All'], ['pending', `Pending (${pendingCount})`], ['approved', 'Approved']].map(([key, label]) => (
                    <button key={key} onClick={() => setFilter(key)}
                        className={`px-4 py-2 text-sm font-medium uppercase transition ${filter === key ? 'bg-[#D5FF00] text-black' : 'border border-white/20 text-white hover:bg-white/10'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {loading && <p className="text-gray-400">Loading reviews...</p>}
            {error && error !== 'Unauthorized' && <p className="text-red-400">{error}</p>}
            {!loading && filtered.length === 0 && <p className="text-gray-400">No reviews found.</p>}

            {!loading && filtered.length > 0 && (
                <div className="space-y-3">
                    {filtered.map(review => (
                        <div key={review.id} className={`rounded border p-4 ${review.approved ? 'border-green-500/20 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-white">{review.client_name}</span>
                                        <span className="text-xs text-gray-400">for {[review.artist_first_name, review.artist_last_name].filter(Boolean).join(' ') || 'Unknown Artist'}</span>
                                        {review.approved && <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">Approved</span>}
                                        {!review.approved && <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">Pending</span>}
                                    </div>
                                    <div className="mt-1 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`h-3.5 w-3.5 ${s <= (review.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-300">{review.review_text}</p>
                                    <p className="mt-1 text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {!review.approved && (
                                        <button onClick={() => handleApprove(review.id, true)} disabled={updating === review.id}
                                            className="flex items-center gap-1 rounded bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/30 disabled:opacity-50">
                                            <ThumbsUp className="h-3 w-3" /> Approve
                                        </button>
                                    )}
                                    {review.approved && (
                                        <button onClick={() => handleApprove(review.id, false)} disabled={updating === review.id}
                                            className="flex items-center gap-1 rounded bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-400 hover:bg-yellow-500/30 disabled:opacity-50">
                                            <ThumbsDown className="h-3 w-3" /> Reject
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(review.id)}
                                        className="rounded p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-400">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

function PagesSection({ token, onUnauthorized }) {
    const [selectedPage, setSelectedPage] = useState(null)
    const [content, setContent] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')

    const loadPage = async (pageSlug) => {
        setLoading(true)
        setSaveMsg('')
        try {
            const res = await fetch(`${API_BASE}/api/admin/pages/${pageSlug}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.status === 401) { onUnauthorized(); return }
            const rows = await res.json()
            const contentMap = {}
            rows.forEach(r => { contentMap[r.section_key] = r.content_value || '' })
            setContent(contentMap)
        } catch (e) {
            console.error(e)
        }
        setLoading(false)
    }

    const handleSelectPage = (pageDef) => {
        setSelectedPage(pageDef)
        loadPage(pageDef.slug)
    }

    const handleSave = async () => {
        if (!selectedPage) return
        setSaving(true)
        setSaveMsg('')
        try {
            const pageDef = selectedPage
            const sections = pageDef.sections.map(s => ({
                section_key: s.key,
                content_type: s.type === 'video' ? 'text' : s.type,
                content_value: content[s.key] || '',
                label: s.label,
            }))
            const res = await fetch(`${API_BASE}/api/admin/pages/${pageDef.slug}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections }),
            })
            if (res.ok) setSaveMsg('Saved successfully!')
        } catch (e) {
            setSaveMsg('Failed to save')
        }
        setSaving(false)
    }

    const [uploadingKey, setUploadingKey] = useState(null)

    const handleImageUpload = async (sectionKey, file) => {
        if (!file) return
        setUploadingKey(sectionKey)
        const formData = new FormData()
        formData.append('image', file)
        try {
            const res = await fetch(`${API_BASE}/api/admin/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                const apiUrl = `/api/page-image/${selectedPage.slug}/${sectionKey}`
                const updated = { ...content, [sectionKey]: apiUrl }
                setContent(updated)
                setSaving(true)
                setSaveMsg('')
                const sectionDef = selectedPage.sections.find(s => s.key === sectionKey)
                const sections = [{
                    section_key: sectionKey,
                    content_type: sectionDef?.type === 'video' ? 'text' : (sectionDef?.type || 'image'),
                    content_value: apiUrl,
                    label: sectionDef?.label || sectionKey,
                    image_data: data.imageData,
                    image_mime: data.imageMime,
                }]
                const saveRes = await fetch(`${API_BASE}/api/admin/pages/${selectedPage.slug}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ sections }),
                })
                if (saveRes.ok) {
                    setSaveMsg('Image saved successfully!')
                } else {
                    setSaveMsg('Upload succeeded but save failed')
                }
                setSaving(false)
            } else {
                setSaveMsg(data.error || 'Image upload failed')
            }
        } catch (e) {
            console.error(e)
            setSaveMsg('Upload failed')
        }
        setUploadingKey(null)
    }

    const handleVideoUpload = async (sectionKey, file) => {
        if (!file) return
        setUploadingKey(sectionKey)
        const formData = new FormData()
        formData.append('video', file)
        try {
            const res = await fetch(`${API_BASE}/api/admin/upload?type=video`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                const updated = { ...content, [sectionKey]: data.url }
                setContent(updated)
                setSaving(true)
                setSaveMsg('')
                const pageDef = selectedPage
                const sections = pageDef.sections.map(s => ({
                    section_key: s.key,
                    content_type: s.type === 'video' ? 'text' : s.type,
                    content_value: s.key === sectionKey ? data.url : (updated[s.key] || ''),
                    label: s.label,
                }))
                const saveRes = await fetch(`${API_BASE}/api/admin/pages/${selectedPage.slug}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ sections }),
                })
                if (saveRes.ok) {
                    setSaveMsg('Video saved successfully!')
                } else {
                    setSaveMsg('Upload succeeded but save failed')
                }
                setSaving(false)
            } else {
                setSaveMsg(data.error || 'Video upload failed')
            }
        } catch (e) {
            console.error(e)
            setSaveMsg('Video upload failed')
        }
        setUploadingKey(null)
    }

    const getFilename = (urlPath) => {
        if (!urlPath) return 'No video set'
        const parts = urlPath.split('/')
        return parts[parts.length - 1]
    }

    if (selectedPage) {
        return (
            <>
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={() => { setSelectedPage(null); setContent({}) }} className="rounded p-2 text-gray-400 hover:bg-white/10 hover:text-white">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="oswald-500 text-3xl uppercase">{selectedPage.name}</h1>
                </div>

                {loading ? (
                    <p className="text-gray-400">Loading...</p>
                ) : (
                    <div className="max-w-3xl space-y-5">
                        {selectedPage.sections.map(section => (
                            <div key={section.key}>
                                <label className="mb-1 block text-sm font-medium text-gray-400">{section.label}</label>
                                {section.type === 'text' ? (
                                    <textarea
                                        value={content[section.key] || ''}
                                        onChange={e => setContent(prev => ({ ...prev, [section.key]: e.target.value }))}
                                        rows={section.key.includes('description') || section.key.includes('subtitle') ? 3 : 1}
                                        className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
                                    />
                                ) : section.type === 'video' ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 rounded border border-white/10 bg-white/5 px-4 py-3">
                                            <Film className="h-5 w-5 shrink-0 text-[#D5FF00]" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-white">{getFilename(content[section.key])}</p>
                                                {content[section.key] && (
                                                    <p className="truncate text-xs text-gray-500">{content[section.key]}</p>
                                                )}
                                            </div>
                                        </div>
                                        {content[section.key] && (
                                            <video
                                                src={content[section.key]}
                                                muted
                                                loop
                                                playsInline
                                                autoPlay
                                                className="h-28 w-48 rounded border border-white/10 object-cover"
                                            />
                                        )}
                                        {uploadingKey === section.key ? (
                                            <div className="flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm text-gray-300">
                                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Uploading Video...
                                            </div>
                                        ) : (
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                                <Upload className="h-4 w-4" />
                                                Upload New Video
                                                <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e => handleVideoUpload(section.key, e.target.files[0])} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {(() => {
                                            const previewSrc = content[section.key] || section.defaultSrc
                                            return previewSrc ? (
                                                <div className="rounded border border-white/10 bg-white/5 p-2 inline-block">
                                                    <img src={previewSrc} alt={section.label} className="max-h-40 max-w-xs rounded object-contain" />
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {content[section.key] ? 'Current (uploaded)' : 'Current (default)'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="rounded border border-dashed border-white/20 bg-white/5 px-4 py-3 inline-block">
                                                    <p className="text-xs text-gray-500">No image set</p>
                                                </div>
                                            )
                                        })()}
                                        <div className="flex items-center gap-4">
                                            {uploadingKey === section.key ? (
                                                <div className="flex items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm text-gray-300">
                                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Uploading & Saving...
                                                </div>
                                            ) : (
                                                <label className="flex cursor-pointer items-center gap-2 rounded border border-white/20 px-4 py-2 text-sm text-gray-300 hover:bg-white/5">
                                                    <Upload className="h-4 w-4" />
                                                    {content[section.key] ? 'Replace Image' : 'Upload Image'}
                                                    <input type="file" accept="image/*" onChange={e => handleImageUpload(section.key, e.target.files[0])} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#D5FF00] px-6 py-2.5 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {saveMsg && <span className={`text-sm ${saveMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{saveMsg}</span>}
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <>
            <h1 className="oswald-500 mb-6 text-3xl uppercase">Pages</h1>
            <div className="space-y-2">
                {PAGE_DEFINITIONS.map(page => (
                    <button
                        key={page.slug}
                        onClick={() => handleSelectPage(page)}
                        className="flex w-full items-center justify-between rounded border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
                    >
                        <div>
                            <h3 className="font-medium text-white">{page.name}</h3>
                            <p className="text-sm text-gray-400">{page.sections.length} editable sections</p>
                        </div>
                        <Edit3 className="h-4 w-4 text-gray-400" />
                    </button>
                ))}
            </div>
        </>
    )
}

function InputField({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
            />
        </div>
    )
}

function TextareaField({ label, value, onChange, rows = 3 }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">{label}</label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={rows}
                className="w-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#D5FF00] focus:outline-none"
            />
        </div>
    )
}

function formatValue(val) {
    if (val === null || val === undefined) return '—'
    if (typeof val === 'boolean') return val ? 'Yes' : 'No'
    if (Array.isArray(val)) return val.join(', ') || '—'
    if (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}/)) {
        return new Date(val).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
    }
    return String(val)
}

function getColumns(tab) {
    switch (tab) {
        case 'contacts':
            return [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'message', label: 'Message' },
                { key: 'consent', label: 'Consent' },
                { key: 'created_at', label: 'Date' },
            ]
        case 'artists':
            return [
                { key: 'first_name', label: 'Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'event', label: 'Event' },
                { key: 'genre', label: 'Genre' },
                { key: 'city', label: 'City' },
                { key: 'profile_approved', label: 'Profile' },
                { key: 'featured', label: 'Featured' },
                { key: 'created_at', label: 'Date' },
            ]
        case 'booking_artists':
            return [
                { key: 'first_name', label: 'Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'genre', label: 'Genre' },
                { key: 'city', label: 'City' },
                { key: 'profile_approved', label: 'Approved' },
                { key: 'featured', label: 'Featured' },
                { key: 'created_at', label: 'Date' },
            ]
        case 'volunteers':
            return [
                { key: 'first_name', label: 'Name' },
                { key: 'last_name', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'genre', label: 'Availability' },
                { key: 'how_can_you_help', label: 'How Can Help' },
                { key: 'city', label: 'City' },
                { key: 'created_at', label: 'Date' },
            ]
        case 'newsletter':
            return [
                { key: 'first_name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'created_at', label: 'Date' },
            ]
        default:
            return []
    }
}
