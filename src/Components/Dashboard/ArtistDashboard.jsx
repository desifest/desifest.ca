import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { User, Image, Calendar, Inbox, DollarSign, LogOut, Save, Plus, X, ChevronLeft, ChevronRight, Check, XCircle, ArrowLeftRight, ExternalLink } from 'lucide-react'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'media', label: 'Media', icon: Image },
  { key: 'availability', label: 'Availability', icon: Calendar },
  { key: 'bookings', label: 'Bookings', icon: Inbox },
  { key: 'earnings', label: 'Earnings', icon: DollarSign },
]

const PERFORMANCE_TYPES = ['Solo', 'Band', 'DJ', 'Dance', 'Spoken Word', 'Comedy', 'Acoustic', 'Full Production']
const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Punjabi', 'Tamil', 'Bengali', 'Urdu', 'French', 'Other']

export default function ArtistDashboard() {
  const { user, logout, authFetch } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-[#100422]">
      <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-white/10 bg-[#0a0118] md:flex">
        <div className="p-4">
          <h2 className="oswald-500 text-xl uppercase text-white">Artist</h2>
          <p className="mt-1 text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium transition ${
                activeTab === key ? 'bg-[#D5FF00]/10 text-[#D5FF00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex w-full flex-col md:hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0118] px-4 py-3">
          <h2 className="oswald-500 text-lg uppercase text-white">Artist Dashboard</h2>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Inbox className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#0a0118] px-4 py-2 space-y-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setActiveTab(key); setMobileMenuOpen(false) }}
                className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm font-medium ${
                  activeTab === key ? 'bg-[#D5FF00]/10 text-[#D5FF00]' : 'text-gray-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-400">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#0a0118] px-2 md:hidden">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition ${
                activeTab === key ? 'border-b-2 border-[#D5FF00] text-[#D5FF00]' : 'text-gray-500'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-auto p-4 text-white md:p-8">
        {activeTab === 'profile' && <ProfileSection authFetch={authFetch} />}
        {activeTab === 'media' && <MediaSection authFetch={authFetch} />}
        {activeTab === 'availability' && <AvailabilitySection authFetch={authFetch} />}
        {activeTab === 'bookings' && <BookingsSection authFetch={authFetch} />}
        {activeTab === 'earnings' && <EarningsSection authFetch={authFetch} />}
      </main>
    </div>
  )
}

function ProfileSection({ authFetch }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    bio: '', pressPhoto: null, pressPhotoPreview: '', bannerImageUrl: '', pricing: '', setLength: '',
    techRequirements: '', performanceTypes: [], languages: [], socialLinks: {}, genre: ''
  })

  useEffect(() => {
    authFetch('/api/dashboard/artist/profile').then(r => r.json()).then(data => {
      setProfile(data)
      if (data.press_photo_url) {
        const token = localStorage.getItem('authToken')
        fetch('/api/dashboard/artist/photo', { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.blob() : null)
          .then(blob => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              setForm(p => ({ ...p, pressPhotoPreview: url }))
            }
          })
          .catch(() => {})
      }
      setForm({
        bio: data.bio || '',
        pressPhoto: null,
        pressPhotoPreview: '',
        bannerImageUrl: data.banner_image_url || '',
        pricing: data.pricing || '',
        setLength: data.set_length || '',
        techRequirements: data.tech_requirements || '',
        performanceTypes: Array.isArray(data.performance_types) ? data.performance_types : [],
        languages: Array.isArray(data.languages) ? data.languages : [],
        socialLinks: typeof data.social_links === 'object' && data.social_links ? data.social_links : {},
        genre: data.genre || '',
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [authFetch])

  const toggleArrayItem = (key, item) => {
    setForm(prev => ({
      ...prev,
      [key]: prev[key].includes(item) ? prev[key].filter(i => i !== item) : [...prev[key], item]
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setMsg('Photo must be under 5MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      setMsg('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm(p => ({ ...p, pressPhoto: reader.result, pressPhotoPreview: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      const payload = {
        bio: form.bio,
        genre: form.genre,
        pricing: form.pricing,
        setLength: form.setLength,
        techRequirements: form.techRequirements,
        performanceTypes: form.performanceTypes,
        languages: form.languages,
        socialLinks: form.socialLinks,
      }
      if (form.pressPhoto) payload.pressPhoto = form.pressPhoto
      const res = await authFetch('/api/dashboard/artist/profile', {
        method: 'PUT', body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMsg('Profile saved!')
        if (form.pressPhoto) setForm(p => ({ ...p, pressPhoto: null }))
      }
      else { const d = await res.json(); setMsg(d.error || 'Failed to save') }
    } catch { setMsg('Failed to save') }
    setSaving(false)
  }

  if (loading) return <div className="text-gray-400">Loading profile...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="oswald-500 text-2xl uppercase">Edit Profile</h2>

      <Field label="Bio">
        <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={4} placeholder="Tell clients about yourself..." className="input-field" />
      </Field>

      <Field label="Genre">
        <input value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))} placeholder="e.g. Bollywood, Hip Hop, Classical" className="input-field" />
      </Field>

      <Field label="Profile Photo (max 5MB)">
        <div className="flex items-center gap-4">
          {form.pressPhotoPreview && (
            <img src={form.pressPhotoPreview} alt="Preview" className="h-20 w-20 rounded-xl object-cover border border-white/10" />
          )}
          <div className="flex-1">
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-[#D5FF00] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#070707] hover:file:bg-[#c5ef00]" />
            <p className="mt-1 text-xs text-gray-500">JPG, PNG or WebP. Under 5MB.</p>
          </div>
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pricing">
          <input value={form.pricing} onChange={e => setForm(p => ({ ...p, pricing: e.target.value }))} placeholder="e.g. $500 - $2000" className="input-field" />
        </Field>
        <Field label="Set Length">
          <input value={form.setLength} onChange={e => setForm(p => ({ ...p, setLength: e.target.value }))} placeholder="e.g. 30-60 minutes" className="input-field" />
        </Field>
      </div>

      <Field label="Tech Requirements">
        <textarea value={form.techRequirements} onChange={e => setForm(p => ({ ...p, techRequirements: e.target.value }))} rows={2} placeholder="Sound system, monitors, etc." className="input-field" />
      </Field>

      <Field label="Performance Types">
        <div className="flex flex-wrap gap-2">
          {PERFORMANCE_TYPES.map(t => (
            <button key={t} type="button" onClick={() => toggleArrayItem('performanceTypes', t)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${form.performanceTypes.includes(t) ? 'border-[#D5FF00]/40 bg-[#D5FF00]/10 text-[#D5FF00]' : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {t}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Languages">
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map(l => (
            <button key={l} type="button" onClick={() => toggleArrayItem('languages', l)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${form.languages.includes(l) ? 'border-[#D5FF00]/40 bg-[#D5FF00]/10 text-[#D5FF00]' : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {l}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Social Links">
        <div className="grid gap-3 sm:grid-cols-2">
          {['instagram', 'youtube', 'spotify', 'tiktok', 'facebook', 'website'].map(platform => (
            <input key={platform} value={form.socialLinks[platform] || ''} placeholder={platform.charAt(0).toUpperCase() + platform.slice(1)}
              onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, [platform]: e.target.value } }))} className="input-field" />
          ))}
        </div>
      </Field>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#D5FF00] px-6 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {profile?.slug && (
          <button
            onClick={async () => { await handleSave(); window.open(`/artists/${profile.slug}`, '_blank') }}
            disabled={saving}
            className="flex items-center gap-2 border border-[#D5FF00] px-6 py-2.5 text-sm font-semibold text-[#D5FF00] transition hover:bg-[#D5FF00]/10 disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4" /> View Profile
          </button>
        )}
        {msg && <span className={`text-sm ${msg.includes('saved') ? 'text-green-400' : 'text-red-400'}`}>{msg}</span>}
      </div>
    </div>
  )
}

function MediaSection({ authFetch }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newType, setNewType] = useState('photo')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  const fetchMedia = useCallback(() => {
    authFetch('/api/dashboard/artist/media').then(r => r.json()).then(d => { setMedia(d); setLoading(false) }).catch(() => setLoading(false))
  }, [authFetch])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  const photoCount = media.filter(m => m.media_type === 'photo').length
  const videoCount = media.filter(m => m.media_type === 'video').length
  const musicCount = media.filter(m => m.media_type === 'music').length

  const handleAdd = async () => {
    if (!newUrl.trim()) return
    setAdding(true); setError('')
    try {
      const res = await authFetch('/api/dashboard/artist/media', {
        method: 'POST', body: JSON.stringify({ mediaType: newType, url: newUrl.trim() })
      })
      if (res.ok) { setNewUrl(''); fetchMedia() }
      else { const d = await res.json(); setError(d.error || 'Failed to add') }
    } catch { setError('Failed to add') }
    setAdding(false)
  }

  const handleDelete = async (id) => {
    try {
      await authFetch(`/api/dashboard/artist/media/${id}`, { method: 'DELETE' })
      fetchMedia()
    } catch {}
  }

  if (loading) return <div className="text-gray-400">Loading media...</div>

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="oswald-500 text-2xl uppercase">Manage Media</h2>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>Photos: {photoCount}/6</span>
        <span>Videos: {videoCount}/3</span>
        <span>Music: {musicCount}/1</span>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <select value={newType} onChange={e => setNewType(e.target.value)} className="border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-[#D5FF00] focus:outline-none">
            <option value="photo">Photo</option>
            <option value="video">Video</option>
            <option value="music">Music</option>
          </select>
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder={newType === 'photo' ? 'Image URL' : newType === 'video' ? 'YouTube/video URL' : 'Music embed URL'}
            className="input-field flex-1" />
          <button onClick={handleAdd} disabled={adding} className="flex items-center gap-1 bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>

      {['photo', 'video', 'music'].map(type => {
        const items = media.filter(m => m.media_type === type)
        if (items.length === 0) return null
        return (
          <div key={type}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-400">{type}s</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 rounded border border-white/10 bg-white/5 px-3 py-2">
                  {type === 'photo' && <img src={item.url} alt="" className="h-10 w-10 rounded object-cover" onError={e => e.target.style.display = 'none'} />}
                  <span className="flex-1 truncate text-sm text-gray-300">{item.url}</span>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function AvailabilitySection({ authFetch }) {
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    authFetch('/api/dashboard/artist/availability').then(r => r.json()).then(d => {
      setBlockedDates(d.map(item => item.blocked_date.split('T')[0]))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [authFetch])

  const toggleDate = async (dateStr) => {
    try {
      const res = await authFetch('/api/dashboard/artist/availability', {
        method: 'POST', body: JSON.stringify({ date: dateStr })
      })
      const data = await res.json()
      if (data.action === 'blocked') setBlockedDates(prev => [...prev, dateStr])
      else setBlockedDates(prev => prev.filter(d => d !== dateStr))
    } catch {}
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

  if (loading) return <div className="text-gray-400">Loading availability...</div>

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="oswald-500 text-2xl uppercase">Manage Availability</h2>
      <p className="text-sm text-gray-400">Click on dates to block/unblock them. Blocked dates appear in red.</p>

      <div className="rounded border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="text-gray-400 hover:text-white"><ChevronLeft className="h-5 w-5" /></button>
          <span className="text-sm font-semibold uppercase tracking-wider">{monthName}</span>
          <button onClick={nextMonth} className="text-gray-400 hover:text-white"><ChevronRight className="h-5 w-5" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isBlocked = blockedDates.includes(dateStr)
            const isPast = new Date(dateStr) < new Date(new Date().toDateString())
            return (
              <button
                key={day}
                onClick={() => !isPast && toggleDate(dateStr)}
                disabled={isPast}
                className={`rounded py-2 text-xs font-medium transition ${
                  isPast ? 'text-gray-700 cursor-not-allowed' :
                  isBlocked ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                  'text-gray-300 hover:bg-white/10'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-gray-500">{blockedDates.length} date(s) currently blocked</p>
    </div>
  )
}

function BookingsSection({ authFetch }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [counterForm, setCounterForm] = useState(null)

  const fetchBookings = useCallback(() => {
    authFetch('/api/dashboard/artist/bookings').then(r => r.json()).then(d => { setBookings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [authFetch])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleAction = async (id, action, extra = {}) => {
    try {
      await authFetch(`/api/dashboard/artist/bookings/${id}`, {
        method: 'PATCH', body: JSON.stringify({ action, ...extra })
      })
      setCounterForm(null)
      fetchBookings()
    } catch {}
  }

  const statusColor = (s) => {
    const colors = { pending: 'text-yellow-400 bg-yellow-500/10', accepted: 'text-green-400 bg-green-500/10', declined: 'text-red-400 bg-red-500/10', countered: 'text-blue-400 bg-blue-500/10', confirmed: 'text-green-400 bg-green-500/10', cancelled: 'text-gray-400 bg-gray-500/10', completed: 'text-purple-400 bg-purple-500/10' }
    return colors[s] || 'text-gray-400 bg-gray-500/10'
  }

  if (loading) return <div className="text-gray-400">Loading bookings...</div>

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="oswald-500 text-2xl uppercase">Incoming Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No booking requests yet.</p>
      ) : (
        bookings.map(b => (
          <div key={b.id} className="rounded border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{b.event_name}</h3>
                <p className="text-sm text-gray-400">
                  {b.client_first_name} {b.client_last_name} &middot; {new Date(b.event_date).toLocaleDateString()}
                </p>
                {b.event_location && <p className="text-xs text-gray-500">{b.event_location}</p>}
                {b.event_description && <p className="mt-1 text-sm text-gray-300">{b.event_description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {b.price > 0 && <span className="text-sm font-semibold text-[#D5FF00]">${Number(b.price).toLocaleString()}</span>}
                <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>

            {b.status === 'pending' && (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleAction(b.id, 'accept')} className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                  <Check className="h-3 w-3" /> Accept
                </button>
                <button onClick={() => handleAction(b.id, 'decline')} className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                  <XCircle className="h-3 w-3" /> Decline
                </button>
                <button onClick={() => setCounterForm(counterForm === b.id ? null : b.id)} className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                  <ArrowLeftRight className="h-3 w-3" /> Counter
                </button>
              </div>
            )}

            {counterForm === b.id && (
              <CounterOfferForm onSubmit={(data) => handleAction(b.id, 'counter', data)} onCancel={() => setCounterForm(null)} />
            )}
          </div>
        ))
      )}
    </div>
  )
}

function CounterOfferForm({ onSubmit, onCancel }) {
  const [price, setPrice] = useState('')
  const [date, setDate] = useState('')

  return (
    <div className="rounded border border-blue-500/20 bg-blue-500/5 p-3 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Counter Price ($)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="input-field" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Counter Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSubmit({ counterPrice: price || undefined, counterDate: date || undefined })}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">Send Counter</button>
        <button onClick={onCancel} className="rounded border border-white/20 px-3 py-1.5 text-xs text-gray-400 hover:bg-white/5">Cancel</button>
      </div>
    </div>
  )
}

function EarningsSection({ authFetch }) {
  const [earnings, setEarnings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authFetch('/api/dashboard/artist/earnings').then(r => r.json()).then(d => { setEarnings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [authFetch])

  if (loading) return <div className="text-gray-400">Loading earnings...</div>

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="oswald-500 text-2xl uppercase">Earnings Summary</h2>
      {earnings && (
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total Bookings" value={earnings.total_bookings || 0} />
          <StatCard label="Pending Requests" value={earnings.pending_bookings || 0} />
          <StatCard label="Gross Earnings" value={`$${Number(earnings.gross_earnings || 0).toLocaleString()}`} accent />
          <StatCard label="Net Earnings (85%)" value={`$${Number(earnings.net_earnings || 0).toLocaleString()}`} accent />
        </div>
      )}
      <p className="text-xs text-gray-500">Net earnings reflect an estimated 15% platform commission.</p>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-[#D5FF00]' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</label>
      {children}
    </div>
  )
}
