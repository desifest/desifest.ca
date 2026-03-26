import React from 'react'
import images from '@/Assets/openmic/image copy 4.png'
import arrow from '@/Assets/openmic/image copy 5.png'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'
import { useRef } from 'react'
import usePageContent from '@/hooks/usePageContent'

import images1Fallback from '@/Assets/openmic/Session/session 1.jpg'
import images2Fallback from '@/Assets/openmic/Session/session 2.jpg'
import images3Fallback from '@/Assets/openmic/Session/session 3.jpg'

const Popularart = () => {
    const { content } = usePageContent('openmic')

    const artists = [
        {
            id: 1,
            name: content.session1_name || 'DURHAM',
            handle: content.session1_handle || 'SEASON 3',
            image: content.session_img1 || images1Fallback,
        },
        {
            id: 2,
            name: content.session2_name || 'Lahore Tikka House',
            handle: content.session2_handle || 'SEASON 3',
            image: content.session_img2 || images2Fallback,
        },
        {
            id: 3,
            name: content.session3_name || 'TORONTO',
            handle: content.session3_handle || 'SEASON 3',
            image: content.session_img3 || images3Fallback,
        },
    ]
    const scrollRef = useRef(null)

    const scrollLeft = () => {
        scrollRef.current.scrollBy({
            left: -350,
            behavior: 'smooth',
        })
    }

    const scrollRight = () => {
        scrollRef.current.scrollBy({
            left: 350,
            behavior: 'smooth',
        })
    }
    return (
        <div className="w-full overflow-hidden py-10">
            {/* Heading */}
            <div className="mb-10 flex items-center justify-center">
                <div className="flex w-full items-center gap-1 md:items-center md:gap-4">
                    <h2 className="oswald-500 text-[36px] tracking-wide whitespace-nowrap text-white md:text-[80px]">
                        {content.seasons_section_title || 'SEASONS AND PLACES'}
                    </h2>

                    <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
                        {/* Line */}
                        <div className="h-0.5 w-full bg-white" />
                    </div>
                    {/* Arrows */}
                    <div className="flex shrink-0 items-center md:ml-10 md:gap-4">
                        <button onClick={scrollLeft} className="transition hover:opacity-70">
                            <img src={left} alt="left" className="h-8 w-8 md:h-10 md:w-10" />
                        </button>
                        <button onClick={scrollRight} className="transition hover:opacity-70">
                            <img src={right} alt="right" className="h-8 w-8 md:h-10 md:w-10" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Container */}
            <div className="scrollbar-hide flex flex-col items-start overflow-x-auto px-6 sm:flex-row sm:gap-12 sm:px-12 sm:pb-32">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        className="group relative flex-shrink-0 basis-[260px] origin-top transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.2] sm:basis-[320px]"
                    >
                        <div className="flex origin-top-left flex-row gap-2 bg-[linear-gradient(90deg,#FFFFFF_0%,#7E6FF5_61.58%,#FAA7EB_100%)] p-4 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:flex-col sm:gap-0 sm:bg-[#FFFFFF40] sm:bg-none sm:group-hover:bg-[linear-gradient(180deg,#FFFFFF_0%,#7E6FF5_61.58%,#FAA7EB_100%)]">
                            <div className="relative h-45 w-1/2 border-4 border-white sm:h-70 sm:w-full">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="h-full w-full object-cover transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]  "
                                />
                            </div>

                            <div className="my-4 w-1/2 text-left sm:w-full">
                                <h3 className="dm-sans-400 text-4xl font-normal tracking-wider uppercase text-white group-hover:text-[#100422] sm:text-4xl">
                                    {artist.name}
                                </h3>
                                <p className="dm-sans-400 text-lg font-normal text-white/70 group-hover:text-[#100422]">
                                    {artist.handle}
                                </p>
                            </div>
                            <div className="absolute right-6 bottom-6">
                                <img src={arrow} alt="" className="h-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Popularart
