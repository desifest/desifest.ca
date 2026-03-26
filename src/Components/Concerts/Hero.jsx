import React from 'react'
import Digit from '../Animations/Digit'
import { useNavigate } from 'react-router-dom'
import usePageContent from '@/hooks/usePageContent'

const Hero = () => {
    const navigate = useNavigate()
    const { content } = usePageContent('concerts')
    return (
        <div className="z-30 mt-20 flex min-h-screen flex-col gap-16 px-6 py-12 md:flex-row md:justify-between md:px-20 md:py-16">
            {/* LEFT SECTION */}
            <div className="flex flex-1 flex-col">
                {/* Header Navigation */}
                <div className="dm-sans-400 flex gap-4">
                    <button
                        onClick={() => navigate('/sponsorship')}
                        className="bg-neon-yellow oswald-500 bg-midnight-purple cursor-pointer border-2 px-3 py-2 text-sm text-black uppercase transition hover:bg-lime-300 md:text-3xl"
                    >
                        Sponsor Us
                    </button>
                </div>

                {/* HERO TEXT */}
                <div className="flex flex-col leading-none">
                    <h1 className="flex items-end gap-3 leading-none">
                        <span className="oswaldd text-soft-lavender pointer-events-none text-5xl leading-none font-medium sm:text-7xl md:text-9xl">
                            {content.hero_line1 || 'THE'}
                        </span>

                        <span className="dm-sans-400 text-xs text-white sm:text-sm md:text-lg">
                            {(content.hero_taglines || "THREE DAYS.\nONE COMMUNITY.\nCOUNTLESS MOMENTS.").split('\n').map((line, i) => <span className="block" key={i}>{line}</span>)}
                        </span>
                    </h1>

                    <div className="special-gothic-one-regular text-neon-yellow flex h-20 items-center overflow-hidden text-5xl leading-none font-black sm:h-28 sm:text-7xl md:h-32 md:text-[120px]">
                        <Digit value={2} delay={0} />
                        <Digit value={0} delay={0.1} />
                        <Digit value={2} delay={0.2} />
                        <Digit value={6} delay={0.3} />
                    </div>

                    <div className="oswaldd text-soft-lavender text-5xl leading-none font-medium sm:text-6xl md:text-[120px]">
                        {content.hero_line2 || 'CONCERT'}
                    </div>

                    <p className="dm-sans-400 max-w-xl text-sm font-light tracking-wide text-white sm:text-lg md:text-xl">
                        {content.hero_subtitle || 'LIVE MUSIC. SHARED ENERGY. REAL CONNECTION.'}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4">
                        <button
                            onClick={() => navigate('/artistsignup')}
                            className="oswaldd bg-neon-yellow px-4 py-3 text-sm font-medium text-black hover:cursor-pointer hover:bg-lime-300 sm:px-6 sm:py-4 sm:text-lg md:px-8 md:text-3xl"
                        >
                            {content.artist_signup_btn || 'ARTIST SIGN UP'}
                        </button>

                        <button
                            onClick={() => navigate('/volunteersignup')}
                            className="oswaldd bg-neon-yellow px-4 py-3 text-sm font-medium text-black hover:cursor-pointer hover:bg-lime-300 sm:px-6 sm:py-4 sm:text-lg md:px-8 md:text-3xl"
                        >
                            {content.volunteer_btn || 'VOLUNTEER SIGN UP'}
                        </button>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="dm-sans-400 flex flex-1 flex-col gap-10 text-white">
                {/* Launch Night — Thursday Kick-Off */}
                <div className="border-b border-white pb-10">
                    <p className="dm-sans-500 mb-2 text-lg font-semibold tracking-wider md:text-xl">
                        {content.day0_label || 'LAUNCH NIGHT'}
                    </p>

                    <h3 className="special-gothic-one-regular mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
                        {content.day0_date || 'JUNE 18'}
                    </h3>

                    <p className="mb-6 text-base md:text-lg">{content.day0_time || '7:00PM – 11:00PM'}</p>

                    <h4 className="oswaldd mb-2 text-xl font-medium tracking-wide md:text-2xl">
                        {content.day0_title || 'THE BLUEPRINT: HOW SOUTH ASIAN SOUND SHAPED GLOBAL SOUNDS'}
                    </h4>

                    <p className="max-w-md text-base font-thin text-white md:text-xl">
                        {content.day0_description || 'The 20th Anniversary kick-off — an evening showcase exploring the roots and reach of South Asian music across the globe. A celebration of the sounds, stories, and artists that built the blueprint.'}
                    </p>
                </div>

                {/* Day 02 */}
                <div className="border-b border-white pb-10">
                    <p className="dm-sans-500 mb-2 text-lg font-semibold tracking-wider md:text-xl">
                        {content.day1_label || 'DAY 02'}
                    </p>

                    <h3 className="special-gothic-one-regular mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
                        {content.day1_date || 'JUNE 19'}
                    </h3>

                    <p className="mb-6 text-base md:text-lg">{content.day1_time || '5:00PM – 11:00PM'}</p>

                    <h4 className="oswaldd mb-2 text-xl font-medium tracking-wide md:text-2xl">
                        {content.day1_title || 'MULTICULTURAL MUSIC CELEBRATION'}
                    </h4>

                    <p className="max-w-md text-base font-thin text-white md:text-xl">
                        {content.day1_description || 'A free public event highlighting artists shaped by South Asian roots and global influence. Expect high-energy performances, cross-genre collaborations, and a crowd that reflects the diversity of Toronto itself.'}
                    </p>
                </div>

                {/* Day 03 */}
                <div className="border-b border-white pb-10">
                    <p className="dm-sans-500 mb-2 text-lg font-semibold tracking-wider md:text-xl">
                        {content.day2_label || 'DAY 03'}
                    </p>

                    <h3 className="special-gothic-one-regular mb-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
                        {content.day2_date || 'JUNE 20'}
                    </h3>

                    <p className="mb-6 text-base md:text-lg">{content.day2_time || '11:00AM – 11:00PM'}</p>

                    <h4 className="oswaldd mb-2 text-xl font-medium tracking-wide md:text-2xl">
                        {content.day2_title || 'FOOD VENDORS, BRAND ACTIVATIONS'}
                    </h4>

                    <p className="max-w-md text-base font-thin text-white md:text-xl">
                        {content.day2_description || '12 hours of free, family-friendly music and dance — showcasing Canadian and international artists performing everything from Bollywood favourites and Punjabi bangers to Hip Hop, Dance, and Pop.'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Hero
