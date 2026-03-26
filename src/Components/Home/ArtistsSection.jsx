import arrowFallback from '@/Assets/home/animation/image.png'
import background2Fallback from '@/Assets/home/background_2.png'
import { useEffect, useRef } from 'react'
import img1Fallback from '@/Assets/home/animation/image1.png'
import img2Fallback from '@/Assets/home/animation/image2.png'
import img3Fallback from '@/Assets/home/animation/image3.png'

import { useNavigate } from 'react-router-dom'

const ArtistCard = ({ image, title, arrow }) => {
    const navigate = useNavigate()

    const goToArtists = () => {
        navigate('/artists')
    }

    return (
        <div className="group h-60 hover:bg-neon-yellow relative flex w-full cursor-pointer flex-row bg-white p-6 transition-all duration-500 ease-out sm:h-120 sm:flex-col sm:gap-2">
            {/* IMAGE */}
            <div className="w-full  overflow-hidden sm:h-200 sm:w-full">
                <img
                    src={image}
                    alt={title}
                    className="sm:h-80 h-50 w-full object-cover  transition-all duration-500 ease-out group-hover:w-full sm:w-4/5"
                />
            </div>

            {/* CONTENT */}
            <div className="flex w-full flex-col  items-start justify-between px-2">
                <div className="dm-sans-400 flex flex-col h-full sm:flex-row justify-between sm:items-end sm:justify-between text-3xl leading-tight text-black uppercase sm:text-4xl">
                    <div className='w-3/4'>{title}</div>
                    <div className='w-full text-end '> <button
                        onClick={goToArtists}
                        className="transition-transform duration-500 ease-out group-hover:-rotate-45"
                    >
                        <img src={arrow} alt="Go to Our Artists" className="w-10" />
                    </button></div>
                   
                </div>
            </div>
        </div>
    )
}

const ArtistsSection = ({ scrollY, pageContent = {} }) => {
    const featuredRef = useRef(null)
    const communityRef = useRef(null)
    const imageRef = useRef(null)

    const arrow = pageContent.hero_arrow_image || arrowFallback
    const background2 = pageContent.home_background_2 || background2Fallback
    const img1 = pageContent.artist_img1 || img1Fallback
    const img2 = pageContent.artist_img2 || img2Fallback
    const img3 = pageContent.artist_img3 || img3Fallback

    useEffect(() => {
        const y = scrollY ?? 0

        if (featuredRef.current) {
            featuredRef.current.style.transform = `translateY(-${y * 0.15}px)`
        }

        if (communityRef.current) {
            communityRef.current.style.transform = `translateY(-${y * 0.1}px)`
        }

        if (imageRef.current) {
            imageRef.current.style.transform = `translateY(-${y * 0.05}px)`
        }
    }, [scrollY])

    return (
        <section className="bg-deep-purple relative w-full py-2 sm:py-32">
            {/* BACKGROUND IMAGE */}
            <img
                src={background2}
                alt="background"
                className="absolute inset-0 z-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 -bottom-4 z-20 bg-gradient-to-t from-[#100422]/100 to-[#100422]/0"></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#453361]/100 to-[#453361]/50"></div>

            {/* GRID CONTAINER (UNCHANGED) */}
            <div className="relative z-30 mx-auto grid w-full max-w-full grid-cols-1 gap-8  sm:px-8 pt-28 sm:grid-cols-3">
                {/* Featured Artist */}
                <div ref={featuredRef} className="flex sm:w-90 w-80 mx-auto items-center">
                    <ArtistCard
                        image={img1}
                        title="alumni
artists"
                        arrow={arrow}
                    />
                </div>

                {/* Community Artist */}
                <div ref={communityRef} className="sm:w-90 w-80 mx-auto items-center">
                    <ArtistCard image={img2} title="Community Artists" arrow={arrow} />
                </div>

                {/* Image Card */}
                <div
                    ref={imageRef}
                    className="hidden h-120 w-80 items-center border-8 border-white sm:block"
                >
                    <img src={img3} className="hidden h-full w-full object-cover sm:block" alt="" />
                </div>
            </div>
        </section>
    )
}

export default ArtistsSection
