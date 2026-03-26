import { useState, useEffect, useMemo } from 'react'
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react'
import SEO from '@/Components/SEO'
import ArtistCard from '@/Components/Artist/ArtistCard'

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'name', label: 'A – Z' },
]

const ARTISTS_PER_PAGE = 12

export default function ArtistDirectoryPage() {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedGenre, setSelectedGenre] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [availableOnly, setAvailableOnly] = useState(false)
    const [sort, setSort] = useState('featured')
    const [page, setPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const fetchArtists = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (search) params.set('search', search)
                if (selectedGenre) params.set('genre', selectedGenre)
                if (selectedCity) params.set('city', selectedCity)
                if (availableOnly) params.set('availability', 'true')
                if (sort) params.set('sort_by', sort)
                params.set('limit', '200')
                const res = await fetch(`/api/artists?${params}`)
                if (res.ok) {
                    const data = await res.json()
                    const list = Array.isArray(data) ? data : (data.artists || [])
                    setArtists(list)
                }
            } catch (e) {
                console.error('Failed to fetch artists:', e)
            }
            setLoading(false)
        }

        const debounce = setTimeout(fetchArtists, 300)
        return () => clearTimeout(debounce)
    }, [search, selectedGenre, selectedCity, availableOnly, sort])

    useEffect(() => {
        setPage(1)
    }, [search, selectedGenre, selectedCity, availableOnly, sort])

    const allGenres = useMemo(() => {
        const genreSet = new Set()
        artists.forEach(a => {
            if (a.genre) {
                const g = Array.isArray(a.genre) ? a.genre : a.genre.split(',').map(s => s.trim())
                g.forEach(genre => genre && genreSet.add(genre))
            }
        })
        return [...genreSet].sort()
    }, [artists])

    const allCities = useMemo(() => {
        const citySet = new Set()
        artists.forEach(a => {
            if (a.city) citySet.add(a.city)
        })
        return [...citySet].sort()
    }, [artists])

    const totalPages = Math.ceil(artists.length / ARTISTS_PER_PAGE)
    const paginatedArtists = artists.slice((page - 1) * ARTISTS_PER_PAGE, page * ARTISTS_PER_PAGE)

    const activeFilterCount = [selectedGenre, selectedCity, availableOnly].filter(Boolean).length

    const clearFilters = () => {
        setSearch('')
        setSelectedGenre('')
        setSelectedCity('')
        setAvailableOnly(false)
        setSort('featured')
    }

    return (
        <>
            <SEO
                title="Artist Directory"
                description="Browse and discover talented South Asian artists in the DESIFEST network. Filter by genre, city, and availability to find the perfect artist for your event."
            />
            <section className="min-h-screen bg-[#100422] pt-28 pb-20 text-white md:pt-32">
                <div className="mx-auto w-full max-w-7xl px-4 pl-20 md:pl-28 lg:pl-28 lg:pr-12">
                    <div className="mb-10">
                        <h1 className="oswald-500 text-4xl uppercase md:text-5xl lg:text-6xl">
                            Artist <span className="text-[#D5FF00]">Directory</span>
                        </h1>
                        <p className="dm-sans-400 mt-3 max-w-2xl text-base text-gray-300 md:text-lg">
                            Discover talented artists from the DESIFEST network. Find the perfect performer for your next event.
                        </p>
                    </div>

                    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative max-w-md flex-1">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search artists, genres, cities..."
                                className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-12 pr-10 text-white placeholder-gray-500 outline-none transition focus:border-[#D5FF00]/50 focus:ring-1 focus:ring-[#D5FF00]/30"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white">
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${showFilters || activeFilterCount > 0 ? 'border-[#D5FF00]/50 bg-[#D5FF00]/10 text-[#D5FF00]' : 'border-white/15 bg-white/5 text-gray-300 hover:border-white/30'}`}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D5FF00] text-[10px] font-bold text-[#100422]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>

                            <div className="relative">
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    className="appearance-none rounded-xl border border-white/15 bg-white/5 py-3 pl-4 pr-10 text-sm text-gray-300 outline-none transition focus:border-[#D5FF00]/50"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value} className="bg-[#1a0a2e]">{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mb-8 rounded-xl border border-white/10 bg-white/5 p-4 md:p-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="min-w-[160px] flex-1">
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-300">Genre</label>
                                    <select
                                        value={selectedGenre}
                                        onChange={e => setSelectedGenre(e.target.value)}
                                        className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2 text-sm text-white outline-none focus:border-[#D5FF00]/50"
                                    >
                                        <option value="">All Genres</option>
                                        {allGenres.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="min-w-[160px] flex-1">
                                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-300">City</label>
                                    <select
                                        value={selectedCity}
                                        onChange={e => setSelectedCity(e.target.value)}
                                        className="w-full rounded-lg border border-white/15 bg-[#100422] px-3 py-2 text-sm text-white outline-none focus:border-[#D5FF00]/50"
                                    >
                                        <option value="">All Cities</option>
                                        {allCities.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex min-w-[160px] flex-1 items-end">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-[#100422] px-3 py-2 text-sm text-white">
                                        <input
                                            type="checkbox"
                                            checked={availableOnly}
                                            onChange={e => setAvailableOnly(e.target.checked)}
                                            className="accent-[#D5FF00]"
                                        />
                                        Available for gigs
                                    </label>
                                </div>
                            </div>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="mt-4 text-sm text-[#D5FF00] underline underline-offset-2 hover:no-underline">
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D5FF00] border-t-transparent" />
                                <p className="text-gray-300">Loading artists...</p>
                            </div>
                        </div>
                    ) : paginatedArtists.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="oswald-500 text-2xl text-gray-300">No artists found</p>
                            <p className="mt-2 text-gray-300">Try adjusting your search or filters</p>
                            {(search || activeFilterCount > 0) && (
                                <button onClick={clearFilters} className="mt-6 rounded-full border border-[#D5FF00] px-6 py-2 text-sm text-[#D5FF00] transition hover:bg-[#D5FF00] hover:text-[#100422]">
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-300">
                                {artists.length} artist{artists.length !== 1 ? 's' : ''} found
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {paginatedArtists.map(artist => (
                                    <ArtistCard key={artist.slug} artist={artist} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:border-white/30 disabled:opacity-30"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`h-10 w-10 rounded-lg text-sm transition ${p === page ? 'bg-[#D5FF00] font-bold text-[#100422]' : 'border border-white/15 text-gray-300 hover:border-white/30'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 transition hover:border-white/30 disabled:opacity-30"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    )
}
