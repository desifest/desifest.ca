import { Link } from 'react-router-dom'
import backgroungFallback from '@/Assets/artist/Hero.png'
import usePageContent from '@/hooks/usePageContent'

const Herosec = ({ bgColor }) => {
    const { content } = usePageContent('artists')
    const heroImage = content.hero_image || backgroungFallback

    return (
        <section className="relative flex min-h-screen w-full items-start justify-start overflow-hidden">
            <div className="relative h-full w-full overflow-hidden">
                <img
                    src={heroImage}
                    alt="Open Mic Background"
                    className="absolute inset-0 h-full w-full scale-105 object-cover"
                />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse at 30% 50%, rgba(255, 165, 0, 0.4) 0%, transparent 50%),
                            radial-gradient(ellipse at 70% 40%, rgba(100, 100, 255, 0.35) 0%, transparent 50%),
                            radial-gradient(ellipse at 50% 60%, rgba(160, 80, 220, 0.3) 0%, transparent 45%),
                            radial-gradient(circle, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0.7) 65%, rgb(255, 255, 255) 100%)
                        `,
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to top, #FFFFFF 8%, transparent 40%)`,
                    }}
                />

                <div className="relative z-20 flex w-full flex-col items-center justify-start px-6 py-50 sm:justify-center sm:px-24 sm:py-60">
                    <div className="mt-30 flex flex-col items-center text-center sm:mt-0">
                        <h2 className="special-gothic-one-regular text-5xl text-white md:text-6xl">
                            {content.hero_line1 || 'OUR'}
                        </h2>

                        <h1 className="special-gothic-one-regular text-7xl text-[#EEFE08] uppercase md:text-9xl">
                            {content.hero_line2 || 'ARTISTS'}
                        </h1>

                        <div className="mt-6 flex gap-4">
                            <button className="oswald-500 bg-[#EEFE08] px-6 py-2 text-2xl font-bold text-black uppercase shadow-md">
                                Featured
                            </button>

                            <Link to="/community" className="oswald-500 bg-white px-6 py-2 text-2xl font-bold text-black uppercase shadow-md">
                                Community
                            </Link>
                        </div>

                        <p className="dm-sans-400 mt-6 mt-30 text-lg tracking-wide text-[#100422] uppercase sm:mt-8">
                            {content.hero_subtitle || "LET'S SHOW UP, CONNECT AND GROW PERFORMANCES"}
                        </p>
                    </div>

                   
                </div>
            </div>
        </section>
    )
}

export default Herosec
