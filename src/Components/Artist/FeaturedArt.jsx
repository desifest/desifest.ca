import React from 'react'
import arrow from '@/Assets/openmic/image copy 5.png'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'
import { useRef } from 'react'
import usePageContent from '@/hooks/usePageContent'

import images1Fallback from '@/Assets/artist/Featured/image 1.png'
import images2Fallback from '@/Assets/artist/Featured/image 2.png'
import images3Fallback from '@/Assets/artist/Featured/image 3.png'

const FeaturedArt = () => {
    const scrollRef = useRef(null)
    const { content } = usePageContent('artists')

    const artists = [
        {
            id: 1,
            name: 'kalakaar',
            handle: 'https://www.instagram.com/kalakaarcollective/',
            image: content.featured_img1 || images1Fallback,
        },
        {
            id: 2,
            name: 'Masterd',
            handle: 'https://www.instagram.com/masterdofficial/',
            image: content.featured_img2 || images2Fallback,
        },
        {
            id: 3,
            name: 'Landy garcia',
            handle: 'https://www.instagram.com/landygarciamtl/',
            image: content.featured_img3 || images3Fallback,
        },
    ]

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
            <div className="mb-10 flex flex-col items-start justify-center">
                <div className="flex w-full items-center gap-1 md:items-center md:gap-4">
                    <h2 className="oswald-500 text-[36px] tracking-wide whitespace-nowrap text-black md:text-[60px]">
                        FEATURED ARTISTS
                    </h2>

                    <div className="dm-sans-400 flex flex-1 flex-col items-center justify-start text-2xl sm:mt-8">
                        <div className="h-0.5 w-full bg-black" />
                        <div className="hidden sm:flex">
                            The voices shaping the DESIFEST sound today.
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center md:ml-10 md:gap-4">
                        <button onClick={scrollLeft} className="transition hover:opacity-70">
                            <img src={left} alt="left" className="h-8 w-8 invert md:h-10 md:w-10" />
                        </button>
                        <button onClick={scrollRight} className="transition hover:opacity-70">
                            <img
                                src={right}
                                alt="right"
                                className="h-8 w-8 invert md:h-10 md:w-10"
                            />
                        </button>
                    </div>
                </div>
                <div className="ml-2 flex sm:hidden">
                    The voices shaping the DESIFEST sound today.
                </div>
            </div>

            <div className="scrollbar-hide flex flex-col items-start overflow-x-auto px-6 sm:flex-row sm:gap-6 sm:px-12 sm:pb-32">
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        className="group relative flex-shrink-0 basis-[260px] origin-top transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.2] sm:basis-[320px]"
                    >
                        <div className="flex flex-row gap-2 p-4 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:flex-col sm:gap-0">
                            <div className="relative h-45 w-1/2 overflow-hidden border-4 border-black sm:h-70 sm:w-full">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="h-full w-full object-cover  transition-all duration-500 group-hover:scale-105 "
                                />
                            </div>

                            <div className="my-4 w-1/2 text-left sm:w-full">
                                <h3 className="dm-sans-700 pr-8 text-4xl tracking-wider text-[#EEFE08] uppercase [-webkit-text-stroke:1px_black] sm:text-5xl">
                                    {artist.name}
                                </h3>

                                <a
                                    href={artist.handle}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dm-sans-400 text-lg text-[#26193A] hover:underline"
                                >
                                    @{artist.handle.split('/').filter(Boolean).pop()}
                                </a>
                            </div>

                            <div className="absolute right-6 bottom-6 invert transition-all duration-300 group-hover:translate-x-2">
                                <img src={arrow} alt="" className="h-8" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FeaturedArt
