import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Inbox, Heart, Star, LogOut, X, Check, XCircle, Plus } from 'lucide-react'

const TABS = [
  { key: 'bookings', label: 'My Bookings', icon: Inbox },
  { key: 'favourites', label: 'Favourites', icon: Heart },
  { key: 'reviews', label: 'Reviews', icon: Star },
]

export default function ClientDashboard() {
  const { user, logout, authFetch } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('bookings')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex h-screen bg-[#100422]">
      <aside className="sticky top-0 hidden h-screen w-56 flex-shrink-0 flex-col border-r border-white/10 bg-[#0a0118] md:flex">
        <div className="p-4">
          <h2 className="oswald-500 text-xl uppercase text-white">Client</h2>
          <p className="mt-1 text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium transition ${
                activeTab === key ? 'bg-[#D5FF00]/10 text-[#D5FF00]' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex w-full flex-col md:hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0a0118] px-4 py-3">
          <h2 className="oswald-500 text-lg uppercase text-white">Client Dashboard</h2>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Inbox className="h-5 w-5" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#0a0118] px-4 py-2 space-y-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setActiveTab(key); setMobileMenuOpen(false) }}
                className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm font-medium ${activeTab === key ? 'bg-[#D5FF00]/10 text-[#D5FF00]' : 'text-gray-400'}`}>
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-gray-400">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        )}
        <div className="flex overflow-x-auto border-b border-white/10 bg-[#0a0118] px-2 md:hidden">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition ${activeTab === key ? 'border-b-2 border-[#D5FF00] text-[#D5FF00]' : 'text-gray-500'}`}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-auto p-4 text-white md:p-8">
        {activeTab === 'bookings' && <BookingsSection authFetch={authFetch} />}
        {activeTab === 'favourites' && <FavouritesSection authFetch={authFetch} />}
        {activeTab === 'reviews' && <ReviewsSection authFetch={authFetch} />}
      </main>
    </div>
  )
}

function BookingsSection({ authFetch }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)

  const fetchBookings = useCallback(() => {
    authFetch('/api/dashboard/client/bookings').then(r => r.json()).then(d => { setBookings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [authFetch])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleAction = async (id, action) => {
    try {
      await authFetch(`/api/dashboard/client/bookings/${id}`, {
        method: 'PATCH', body: JSON.stringify({ action })
      })
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
      <div className="flex items-center justify-between">
        <h2 className="oswald-500 text-2xl uppercase">My Bookings</h2>
        <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-1 bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>

      {showNew && <NewBookingForm authFetch={authFetch} onDone={() => { setShowNew(false); fetchBookings() }} />}

      {bookings.length === 0 && !showNew ? (
        <p className="text-gray-500">No bookings yet. Create your first booking request!</p>
      ) : (
        bookings.map(b => (
          <div key={b.id} className="rounded border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{b.event_name}</h3>
                <p className="text-sm text-gray-400">
                  Artist: {b.artist_first_name} {b.artist_last_name} &middot; {new Date(b.event_date).toLocaleDateString()}
                </p>
                {b.event_location && <p className="text-xs text-gray-500">{b.event_location}</p>}
              </div>
              <div className="flex items-center gap-2">
                {b.price > 0 && <span className="text-sm font-semibold text-[#D5FF00]">${Number(b.price).toLocaleString()}</span>}
                <span className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${statusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>

            {b.status === 'countered' && (
              <div className="rounded border border-blue-500/20 bg-blue-500/5 p-2 text-sm">
                <p className="text-blue-400">Counter offer received:</p>
                {b.counter_price && <p className="text-gray-300">Price: ${Number(b.counter_price).toLocaleString()}</p>}
                {b.counter_date && <p className="text-gray-300">Date: {new Date(b.counter_date).toLocaleDateString()}</p>}
              </div>
            )}

            {['accepted', 'countered'].includes(b.status) && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(b.id, 'confirm')} className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                  <Check className="h-3 w-3" /> Confirm
                </button>
                <button onClick={() => handleAction(b.id, 'cancel')} className="flex items-center gap-1 rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                  <XCircle className="h-3 w-3" /> Cancel
                </button>
              </div>
            )}

            {b.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => handleAction(b.id, 'cancel')} className="flex items-center gap-1 rounded border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10">
                  <XCircle className="h-3 w-3" /> Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function NewBookingForm({ authFetch, onDone }) {
  const [artists, setArtists] = useState([])
  const [form, setForm] = useState({ artistId: '', eventName: '', eventDate: '', eventLocation: '', eventDescription: '', price: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/artists/list').then(r => r.json()).then(setArtists).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      const res = await authFetch('/api/dashboard/client/bookings', {
        method: 'POST',
        body: JSON.stringify({
          artistId: parseInt(form.artistId),
          eventName: form.eventName,
          eventDate: form.eventDate,
          eventLocation: form.eventLocation,
          eventDescription: form.eventDescription,
          price: parseFloat(form.price) || 0,
        })
      })
      if (res.ok) onDone()
      else { const d = await res.json(); setError(d.error || 'Failed to create booking') }
    } catch { setError('Failed to create booking') }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border border-white/10 bg-white/5 p-4 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D5FF00]">New Booking Request</h3>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className="mb-1 block text-xs text-gray-400">Artist</label>
        <select value={form.artistId} onChange={e => setForm(p => ({ ...p, artistId: e.target.value }))} required className="input-field w-full">
          <option value="">Select an artist...</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.first_name} {a.last_name}{a.genre ? ` (${a.genre})` : ''}</option>)}
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Event Name</label>
          <input value={form.eventName} onChange={e => setForm(p => ({ ...p, eventName: e.target.value }))} required placeholder="Event name" className="input-field w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Event Date</label>
          <input type="date" value={form.eventDate} onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))} required className="input-field w-full" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Location</label>
          <input value={form.eventLocation} onChange={e => setForm(p => ({ ...p, eventLocation: e.target.value }))} placeholder="Venue/location" className="input-field w-full" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Budget ($)</label>
          <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className="input-field w-full" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-gray-400">Description</label>
        <textarea value={form.eventDescription} onChange={e => setForm(p => ({ ...p, eventDescription: e.target.value }))} rows={2} placeholder="Event details..." className="input-field w-full" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send Request'}
        </button>
        <button type="button" onClick={onDone} className="rounded border border-white/20 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">Cancel</button>
      </div>
    </form>
  )
}

function ReviewsSection({ authFetch }) {
  const [reviews, setReviews] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = useCallback(() => {
    Promise.all([
      authFetch('/api/dashboard/client/reviews').then(r => r.json()),
      authFetch('/api/dashboard/client/bookings').then(r => r.json()),
    ]).then(([r, b]) => {
      setReviews(r)
      const reviewedIds = new Set(r.map(rv => rv.booking_id))
      setBookings(b.filter(bk => ['accepted', 'confirmed', 'completed'].includes(bk.status) && !reviewedIds.has(bk.id)))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [authFetch])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true); setError('')
    try {
      const res = await authFetch('/api/dashboard/client/reviews', {
        method: 'POST', body: JSON.stringify({ bookingId: parseInt(selectedBooking), rating, text })
      })
      if (res.ok) { setShowForm(false); setSelectedBooking(''); setRating(5); setText(''); fetchAll() }
      else { const d = await res.json(); setError(d.error || 'Failed') }
    } catch { setError('Failed to submit review') }
    setSubmitting(false)
  }

  if (loading) return <div className="text-gray-400">Loading reviews...</div>

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="oswald-500 text-2xl uppercase">Reviews</h2>
        {bookings.length > 0 && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            <Plus className="h-4 w-4" /> Write Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded border border-white/10 bg-white/5 p-4 space-y-4">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div>
            <label className="mb-1 block text-xs text-gray-400">Booking</label>
            <select value={selectedBooking} onChange={e => setSelectedBooking(e.target.value)} required className="input-field w-full">
              <option value="">Select a booking...</option>
              {bookings.map(b => <option key={b.id} value={b.id}>{b.event_name} - {b.artist_first_name} {b.artist_last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)}
                  className={`text-2xl transition ${s <= rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-400">Review</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Share your experience..." className="input-field w-full" />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="bg-[#D5FF00] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded border border-white/20 px-4 py-2 text-sm text-gray-400 hover:bg-white/5">Cancel</button>
          </div>
        </form>
      )}

      {reviews.length === 0 && !showForm ? (
        <p className="text-gray-500">No reviews yet.{bookings.length > 0 ? ' You can review completed bookings.' : ''}</p>
      ) : (
        reviews.map(r => (
          <div key={r.id} className="rounded border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{r.event_name}</p>
                <p className="text-sm text-gray-400">{r.artist_first_name} {r.artist_last_name}</p>
              </div>
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(s => <span key={s} className={s <= r.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>)}
              </div>
            </div>
            {r.review_text && <p className="mt-2 text-sm text-gray-300">{r.review_text}</p>}
            <p className="mt-2 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  )
}

function FavouritesSection({ authFetch }) {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavourites = useCallback(() => {
    authFetch('/api/dashboard/client/favourites').then(r => r.json()).then(d => { setFavourites(d); setLoading(false) }).catch(() => setLoading(false))
  }, [authFetch])

  useEffect(() => { fetchFavourites() }, [fetchFavourites])

  const handleRemove = async (artistId) => {
    try {
      await authFetch('/api/dashboard/client/favourites', {
        method: 'POST', body: JSON.stringify({ artistId })
      })
      fetchFavourites()
    } catch {}
  }

  if (loading) return <div className="text-gray-400">Loading favourites...</div>

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="oswald-500 text-2xl uppercase">Favourite Artists</h2>
      {favourites.length === 0 ? (
        <p className="text-gray-500">No favourite artists yet. Browse artists to save your favourites.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {favourites.map(f => (
            <div key={f.favourite_id} className="flex items-center gap-3 rounded border border-white/10 bg-white/5 p-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D5FF00]/10 text-[#D5FF00]">
                {f.press_photo_url ? (
                  <img src={f.press_photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="text-lg font-bold">{(f.first_name || '?')[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{f.first_name} {f.last_name}</p>
                {f.genre && <p className="text-xs text-gray-400">{f.genre}</p>}
              </div>
              <button onClick={() => handleRemove(f.artist_id)} className="text-red-400 hover:text-red-300">
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
