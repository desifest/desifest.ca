import { useState, useRef, useCallback } from 'react'
import ParallaxColumns from './paralaxcoolumn.jsx'
import ArtistsSection from './ArtistsSection.jsx'

const YOUTUBE_VIDEO_ID = 'czf4UcWwEio'

function getVideoId(input) {
    if (!input) return YOUTUBE_VIDEO_ID
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
        const match = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        return match ? match[1] : YOUTUBE_VIDEO_ID
    }
    return input
}

const Animation = ({ scrollY, pageContent = {} }) => {
    const iframeRef = useRef(null)
    const [soundEnabled, setSoundEnabled] = useState(false)

    const videoId = getVideoId(pageContent.animation_video_url)
    const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&vq=hd1080&origin=${encodeURIComponent(window.location.origin)}`

    const toggleSound = useCallback(() => {
        if (!iframeRef.current) return
        const msg = soundEnabled
            ? JSON.stringify({ event: 'command', func: 'mute' })
            : JSON.stringify({ event: 'command', func: 'unMute' })
        iframeRef.current.contentWindow.postMessage(msg, '*')
        setSoundEnabled(!soundEnabled)
    }, [soundEnabled])

    return (
        <section className="relative w-full overflow-hidden sm:mt-20">
            <div className="relative z-0 h-100 w-full sm:h-[1100px]">
                <div className="absolute inset-0 z-0 h-[800px] w-full overflow-hidden pointer-events-none">
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

                <div className="absolute inset-0 z-10 h-40 bg-gradient-to-b from-[#100422] to-transparent"></div>
                <div className="absolute inset-0 z-10 top-170 h-30 bg-gradient-to-t from-[#100422] to-transparent"></div>

                <div className="absolute bottom-0 z-20 h-full w-full">
                    <ParallaxColumns scrollY={scrollY} pageContent={pageContent} />
                </div>
            </div>

            <div className="relative sm:-translate-y-20 z-50">
                <ArtistsSection scrollY={scrollY} pageContent={pageContent} />
            </div>
        </section>
    )
}

export default Animation
