import { useState, useEffect } from 'react'
import usePageContent from '@/hooks/usePageContent'

const DEFAULT_PLAYLIST_ID = 'RDCLAK5uy_kwmNQ6C3BXrVOcih6fGljxeeekGrzjTtE'

const SouthAsianCharts = () => {
    const { content } = usePageContent('artists')
    const playlistId = content.charts_playlist_id || DEFAULT_PLAYLIST_ID
    const [tracks, setTracks] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeVideo, setActiveVideo] = useState(null)
    const [playlistTitle, setPlaylistTitle] = useState('South Asian Charts')

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const res = await fetch(`/api/south-asian-playlist?list=${playlistId}`)
                const data = await res.json()
                if (data.items?.length > 0) {
                    setTracks(data.items)
                    if (data.title) setPlaylistTitle(data.title)
                }
            } catch (e) {
                console.error(e)
            }
            setLoading(false)
        }
        fetchPlaylist()
    }, [playlistId])

    if (loading) {
        return (
            <section className="w-full py-10">
                <div className="pr-6">
                    <div className="flex h-64 items-center justify-center rounded-2xl bg-gray-100">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                    </div>
                </div>
            </section>
        )
    }

    if (tracks.length === 0) {
        return (
            <section className="w-full py-10">
                <div className="pr-6">
                    <div className="overflow-hidden rounded-2xl shadow-lg">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0`}
                                title="South Asian Charts Now"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    const totalMins = (() => {
        const totalSec = tracks.reduce((sum, t) => {
            const parts = t.duration.split(':').map(Number)
            return sum + (parts.length === 3 ? parts[0]*3600 + parts[1]*60 + parts[2] : parts[0]*60 + (parts[1]||0))
        }, 0)
        return Math.floor(totalSec / 60)
    })()

    return (
        <section className="w-full py-10">
            <div className="pr-6">
                <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
                        <div className="flex flex-col items-center gap-4 bg-[#0f0f0f] p-6 lg:items-start lg:p-8">
                            <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                                {tracks[0]?.thumbnail ? (
                                    <img src={tracks[0].thumbnail} alt="" className="aspect-square w-full object-cover" />
                                ) : (
                                    <div className="aspect-square w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400" />
                                )}
                            </div>

                            <div className="w-full text-center lg:text-left">
                                <h2 className="oswald-500 text-xl text-white">{playlistTitle}</h2>
                                <p className="dm-sans-400 mt-1 text-xs text-gray-300">
                                    {tracks.length} videos &middot; Updated today
                                </p>
                            </div>

                            <div className="flex w-full items-center gap-2">
                                <button
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:text-white"
                                    title="Save"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>
                                <button
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:text-white"
                                    title="Share"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </button>
                                <button
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-300 transition hover:text-white"
                                    title="Download"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex w-full gap-2">
                                <a
                                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dm-sans-700 flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm text-black transition hover:bg-gray-200"
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                    Play all
                                </a>
                                <a
                                    href={`https://www.youtube.com/playlist?list=${playlistId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dm-sans-700 flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white transition hover:bg-white/20"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Shuffle
                                </a>
                            </div>

                            <p className="dm-sans-400 text-xs leading-relaxed text-gray-300">
                                Today's ranking of the hottest songs on YouTube.
                            </p>
                        </div>

                        <div className="bg-white">
                            {activeVideo && (
                                <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                                        title="Now Playing"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                            {tracks.map((track) => (
                                <button
                                    key={track.videoId}
                                    onClick={() => setActiveVideo(track.videoId === activeVideo ? null : track.videoId)}
                                    className={`flex w-full items-center gap-4 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${activeVideo === track.videoId ? 'bg-gray-100' : ''}`}
                                >
                                    <span className="dm-sans-400 w-6 shrink-0 text-center text-sm text-gray-300">
                                        {track.position}
                                    </span>
                                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded">
                                        <img
                                            src={track.thumbnail}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                        {track.duration && (
                                            <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                                                {track.duration}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="dm-sans-700 truncate text-sm text-black">
                                            {track.title}
                                        </p>
                                        <p className="dm-sans-400 truncate text-xs text-gray-300">
                                            {track.artist}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SouthAsianCharts
