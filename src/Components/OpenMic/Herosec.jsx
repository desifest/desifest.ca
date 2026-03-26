import backgroungFallback from '@/Assets/openmic/image.png'
import usePageContent from '@/hooks/usePageContent'

const Herosec = ({ bgColor }) => {
    const { content } = usePageContent('openmic')
    const backgroung = content.hero_image || backgroungFallback
    return (
        <section className="relative flex h-screen w-full items-start justify-start overflow-hidden">
            {/* Background Image */}
            <img
                src={backgroung}
                alt="Open Mic Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Optional Blue Tint Layer (like your design) */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to top, ${bgColor}dd 10%, transparent 60%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-20 flex w-full flex-col items-center py-50 sm:py-60 sm:justify-center justify-start px-6 sm:px-24">
                <h1 className="dm-sans-300 relative flex-nowrap text-nowrap text-neon-yellow text-6xl max-text-xl leading-30 font-bold tracking-wide uppercase sm:text-[200px]">
                    {content.hero_title || 'OPEN MIC'}
                    <div className="absolute sm:-right-25 sm:-bottom-55 -bottom-25 -right-26 flex h-80 w-80 sm:h-140 sm:w-140 items-center justify-center">
                        {/* Concentric rings (inner → outer, opacity decreases) */}
                        <div className="absolute inset-24.75 rounded-full border border-white/40" />
                        <div className="absolute inset-16.5 rounded-full border border-white/30" />
                        <div className="absolute inset-9.25 rounded-full border border-white/20" />
                        <div className="absolute inset-0 rounded-full border border-white/10" />
                    </div>
                </h1>

                <p className="dm-sans-500 mt-4 text-sm tracking-wide text-white/90 uppercase sm:text-xl">
                    {content.hero_subtitle || 'WHERE NEW VOICES TAKE THEIR FIRST STEP'}
                </p>
            </div>
        </section>
    )
}

export default Herosec
