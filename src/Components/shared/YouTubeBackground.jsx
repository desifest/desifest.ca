import { useState, useRef, useCallback } from 'react'

const DEFAULT_VIDEO_ID = 'CPhw-lFpLsE'

function extractVideoId(input) {
    if (!input) return DEFAULT_VIDEO_ID
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
        const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : DEFAULT_VIDEO_ID
    }
    return input
}

export default function YouTubeBackground({ videoUrl, height = '800px', containerClassName = '', topGradient, bottomGradient }) {
    const videoId = extractVideoId(videoUrl)
    const iframeRef = useRef(null)
    const [soundEnabled, setSoundEnabled] = useState(false)

    const toggleSound = useCallback(() => {
        if (!iframeRef.current) return
        const msg = soundEnabled
            ? JSON.stringify({ event: 'command', func: 'mute' })
            : JSON.stringify({ event: 'command', func: 'unMute' })
        iframeRef.current.contentWindow.postMessage(msg, '*')
        setSoundEnabled(!soundEnabled)
    }, [soundEnabled])

    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&vq=hd1080&origin=${encodeURIComponent(window.location.origin)}`

    return (
        <div className={`relative w-full ${containerClassName}`}>
            <div
                className="absolute inset-0 z-0 w-full overflow-hidden pointer-events-none"
                style={{ height }}
            >
                <iframe
                    ref={iframeRef}
                    src={src}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
                    style={{
                        width: 'max(100%, 177.78vh)',
                        height: 'max(100%, 56.25vw)',
                    }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Background video"
                />
            </div>

            <button
                onClick={toggleSound}
                className="absolute top-6 right-6 z-50 rounded-full bg-black/30 px-6 py-3 text-white backdrop-blur hover:bg-black transition pointer-events-auto"
            >
                {soundEnabled ? '🔇' : '🔊'}
            </button>

            {topGradient}
            {bottomGradient}
        </div>
    )
}
