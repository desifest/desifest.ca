import arrowFallback from '@/Assets/home/image.png'
import artistFallback from '@/Assets/home/Artist.png'
import { useNavigate } from 'react-router-dom'
import usePageContent from '@/hooks/usePageContent'

const HeroSection = ({ pageContent = {} }) => {
    const navigate = useNavigate()
    const { content: fetchedContent } = usePageContent('home', {
        hero_line1: 'Where South',
        hero_line2: 'Asian Culture',
        hero_line3: 'Meets the World.',
        hero_description: "Canada's largest South Asian music and arts festival— uniting generations, genres, and voices on one iconic stage.",
        hero_date: 'June 19 – 20',
        hero_location: 'Sankofa Square, Canada',
        hero_year: '2026',
        hero_anniversary: '20th Anniversary',
    })

    const content = { ...fetchedContent, ...pageContent }

    const artist = content.hero_artist_image || artistFallback
    const arrow = content.hero_arrow_image || arrowFallback

    const anniversary = content.hero_anniversary || '20th Anniversary'
    const annParts = anniversary.split(' ')
    const annNumber = annParts[0] || '20th'
    const annLabel = annParts.slice(1).join(' ') || 'Anniversary'

    return (
        <>
        {/* desktop */}
            <section className="relative hidden h-220 w-full overflow-hidden pl-5 md:flex">
                {/* RIGHT ARTIST IMAGE */}
                <img
                    src={artist}
                    alt="Artist"
                    className="absolute bottom-0 left-90 h-170 max-h-180 mask-[linear-gradient(to_top,transparent_0%,black_25%,black_100%)] object-contain [-webkit-mask-image:linear-gradient(to_top,transparent_0%,black_25%,black_100%)]"
                />

                {/* LEFT TEXT */}
                <div className="h-screen w-full px-6 pt-24 text-white lg:w-2/3">
                    <h1 className="font-[oswald] leading-tight font-medium uppercase">
                        <span className="text-neon-yellow my-4 block text-3xl sm:text-[70px]">
                        {content.hero_line1}
                        </span>
                        <span className="text-neon-yellow  block text-5xl sm:text-8xl">
                        {content.hero_line2}
                        </span>
                        <span className="mt-4 inline-block w-160 bg-white px-2 py-2 text-[44px] text-black md:text-[72px]">
                            {content.hero_line3}
                        </span>
                    </h1>

                    <p className="dm-sans-400 mt-2 max-w-lg text-sm text-gray-300 md:text-xl">
                        Canada's largest South Asian music and arts festival—<br />
                        uniting generations, genres, and voices on one iconic stage.
                    </p>

                    <div className="relative z-10 flex gap-4 pt-6">
                        <button
                            onClick={() => navigate('/sponsorship')}
                            className="oswaldd bg-neon-yellow cursor-pointer px-6 py-3 text-sm font-medium text-black hover:bg-lime-300 lg:px-8 lg:py-4 lg:text-2xl"
                        >
                            SPONSOR US
                        </button>
                        <button
                            onClick={() => navigate('/artistsignup')}
                            className="oswaldd bg-neon-yellow cursor-pointer px-6 py-3 text-sm font-medium text-black hover:bg-lime-300 lg:px-8 lg:py-4 lg:text-2xl"
                        >
                            ARTIST SIGN UP
                        </button>
                        <button
                            onClick={() => navigate('/volunteersignup')}
                            className="oswaldd bg-neon-yellow cursor-pointer px-6 py-3 text-sm font-medium text-black hover:bg-lime-300 lg:px-8 lg:py-4 lg:text-2xl"
                        >
                            VOLUNTEER SIGN UP
                        </button>
                    </div>

                    {/* Anniversary watermark */}
                    <div className="mt-4 font-[oswald] text-[64px] leading-40 text-white/10 uppercase md:text-[246px]">
                        {annNumber}
                    </div>
                    <div className="font-[oswald] text-[64px] leading-56 text-white/10 uppercase md:text-[96px]">
                        {annLabel}
                    </div>
                </div>
                {/* BOTTOM DECORATIVE ELEMENTS */}
                <div className="h-screen w-full px-6 pt-32 text-white lg:w-1/3">
                    <div className="absolute top-50 right-16 text-right text-white">
                        {/* Background year */}
                        <div className="font-[Oswald] text-[140px] leading-16 font-medium text-white/10 select-none">
                            {content.hero_year}
                        </div>

                        {/* Foreground content */}
                        <div className="relative z-10 mt-4">
                            <h3 className="special-gothic-one-regular text-[56px] leading-none font-normal tracking-normal text-white uppercase">
                                {content.hero_date}
                            </h3>

                            <p className="dm-sans-400 mt-1 text-[32px] leading-none font-semibold tracking-[-0.04em] text-white/90 uppercase">
                                {content.hero_location}
                            </p>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 flex h-120 w-120 items-center justify-center">
                        {/* Concentric rings */}
                        <div className="absolute inset-24.75 rounded-full border border-white/40" />
                        <div className="absolute inset-16.5 rounded-full border border-white/30" />
                        <div className="absolute inset-8.25 rounded-full border border-white/20" />
                        <div className="absolute inset-0 rounded-full border border-white/10" />

                        <div className="relative z-10 flex items-center justify-center">
                            <button
                                onClick={() => navigate('/concerts')}
                                className="relative mt-4 h-29 w-29"
                            >
                                <img
                                    src={arrow}
                                    alt="Arrow"
                                    className="h-full w-full"
                                />
                            </button>

                            <div className="ml-4">
                                <div className="oswaldd text-3xl leading-tight tracking-wide text-white uppercase">
                                    <div>{content.hero_cta_explore || 'Explore'}</div>
                                    <div>{content.hero_cta_join || 'Join'}</div>
                                    <div>{content.hero_cta_enjoy || 'Enjoy'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* MOBILE HERO */}
            <section className="relative flex h-220 w-full flex-col overflow-x-clip pt-12 pl-2 text-center text-white md:hidden">
                {/* DATE BLOCK */}
                <div className="mb-6">
                    <div className="font-[Oswald] text-[82px] leading-none text-white/10">{content.hero_year}</div>
                    <h3 className="font-['Special_Gothic_Expanded_One'] text-[36px] leading-none uppercase">
                        {content.hero_date}
                    </h3>
                    <p className="mt-1 font-['DM_Sans'] text-[20px] tracking-[-0.04em] text-white/90 uppercase">
                        {content.hero_location}
                    </p>
                </div>

                {/* HEADLINE */}
                <h2 className="mb-5 flex w-full flex-col items-start justify-start font-[oswald] leading-tight uppercase">
                    <span className="text-neon-yellow block text-[30px]">{content.hero_line1}</span>
                    <span className="text-neon-yellow block text-[46px]">{content.hero_line2}</span>
                    <span className="mt-3 block bg-white px-4 text-[36px] text-black">
                        {content.hero_line3}
                    </span>
                </h2>

                {/* DESCRIPTION */}
                <p className="dm-sans-400 mb-0 w-full text-start text-[12px] leading-snug text-gray-300">
                    {content.hero_description}
                </p>

                <div className="relative z-10 flex flex-col gap-3 pt-4 pr-4">
                    <button
                        onClick={() => navigate('/sponsorship')}
                        className="oswaldd bg-neon-yellow w-fit cursor-pointer px-4 py-3 text-sm font-medium text-black hover:bg-lime-300"
                    >
                        SPONSOR US
                    </button>
                    <button
                        onClick={() => navigate('/artistsignup')}
                        className="oswaldd bg-neon-yellow w-fit cursor-pointer px-4 py-3 text-sm font-medium text-black hover:bg-lime-300"
                    >
                        ARTIST SIGN UP
                    </button>
                    <button
                        onClick={() => navigate('/volunteersignup')}
                        className="oswaldd bg-neon-yellow w-fit cursor-pointer px-4 py-3 text-sm font-medium text-black hover:bg-lime-300"
                    >
                        VOLUNTEER SIGN UP
                    </button>
                </div>

                <div className="w-full text-start font-[oswald] text-[110px] leading-28 text-white/20 uppercase">
                    {annNumber}
                </div>
                <div className="w-full text-start font-[oswald] text-[44px] text-white/20 uppercase">
                    {annLabel}
                </div>
                {/* ARTIST IMAGE */}
                <img
                    src={artist}
                    alt="Artist"
                    className="absolute top-32 left-44 h-180 scale-110 mask-[linear-gradient(to_top,transparent_32%,black_41%,black_100%)] object-contain [-webkit-mask-image:linear-gradient(to_top,transparent_32%,black_41%,black_100%)]"
                />

                {/* ARROW + RINGS */}
                <div className="absolute -right-24 bottom-0 z-20 flex h-100 w-100 origin-center scale-[0.75] items-center justify-center">
                    <div className="absolute inset-24.75 rounded-full border border-white/40" />
                    <div className="absolute inset-16.5 rounded-full border border-white/30" />
                    <div className="absolute inset-8.25 rounded-full border border-white/20" />
                    <div className="absolute inset-0 rounded-full border border-white/10" />

                    <div className="relative z-10 flex items-center gap-6">
                        <button
                            className="relative h-20.5 w-20.5 hover:scale-105"
                            onClick={() => navigate('/concerts')}
                        >
                            <img src={arrow} alt="Arrow" />
                        </button>

                        <div className="oswaldd text-[0.95rem] leading-tight tracking-wide text-white uppercase">
                            <div>{content.hero_cta_explore || 'Explore'}</div>
                            <div>{content.hero_cta_join || 'Join'}</div>
                            <div>{content.hero_cta_enjoy || 'Enjoy'}</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection
