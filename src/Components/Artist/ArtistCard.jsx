import { Link } from 'react-router-dom'
import { MapPin, Music, Star } from 'lucide-react'

export default function ArtistCard({ artist }) {
    const name = `${artist.first_name} ${artist.last_name}`
    const genres = artist.genre
        ? (Array.isArray(artist.genre) ? artist.genre : artist.genre.split(',').map(g => g.trim())).slice(0, 3)
        : []
    const location = [artist.city, artist.country].filter(Boolean).join(', ')

    return (
        <Link
            to={`/artists/${artist.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1a0a2e] transition-all duration-300 hover:border-[#D5FF00]/40 hover:shadow-lg hover:shadow-[#D5FF00]/5"
        >
            <div className="relative aspect-square w-full overflow-hidden bg-[#100422]">
                {artist.photo_url ? (
                    <img
                        src={artist.photo_url}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Music className="h-16 w-16 text-[#453361]" />
                    </div>
                )}
                {artist.featured && (
                    <span className="absolute top-3 left-3 rounded-full bg-[#D5FF00] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#100422]">
                        Featured
                    </span>
                )}
                {artist.available_for_gigs && (
                    <span className="absolute top-3 right-3 rounded-full bg-green-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Available
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="oswald-500 truncate text-lg text-white group-hover:text-[#D5FF00] transition-colors">
                    {name}
                </h3>

                {location && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-300">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                    </div>
                )}

                {genres.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {genres.map((genre, i) => (
                            <span
                                key={i}
                                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-gray-300"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                )}

                {artist.avg_rating > 0 && (
                    <div className="mt-3 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(s => (
                                <Star key={s} className={`h-3 w-3 ${s <= Math.round(artist.avg_rating) ? 'fill-[#D5FF00] text-[#D5FF00]' : 'text-gray-600'}`} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-300">
                            {artist.avg_rating} ({artist.review_count})
                        </span>
                    </div>
                )}

                <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#D5FF00] opacity-0 transition-opacity group-hover:opacity-100">
                        View Profile →
                    </span>
                </div>
            </div>
        </Link>
    )
}
