import React from 'react'

import lineupbg from '../../Assets/concerts/artistlineupbg.svg'
import { useEffect, useRef } from 'react'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'
import usePageContent from '@/hooks/usePageContent'
import image1f from '@/Assets/openmic/Featured/image1.png'
import image2f from '@/Assets/openmic/Featured/image2.png'
import image3f from '@/Assets/openmic/Featured/image3.png'
import image4f from '@/Assets/openmic/Featured/image4.png'
import image5f from '@/Assets/openmic/Featured/image5.png'
import image6f from '@/Assets/openmic/Featured/image6.png'
import image7f from '@/Assets/openmic/Featured/image7.png'
import image8f from '@/Assets/openmic/Featured/image8.png'
import image9f from '@/Assets/openmic/Featured/image9.png'
import image10f from '@/Assets/openmic/Featured/image10.png'
import image11f from '@/Assets/openmic/Featured/image11.png'
import image12f from '@/Assets/openmic/Featured/image12.png'
import image13f from '@/Assets/openmic/Featured/image13.png'
import image14f from '@/Assets/openmic/Featured/image14.png'
import image15f from '@/Assets/openmic/Featured/image15.png'
import image16f from '@/Assets/openmic/Featured/image16.png'

const fallbacks = [image1f, image2f, image3f, image4f, image5f, image6f, image7f, image8f, image9f, image10f, image11f, image12f, image13f, image14f, image15f, image16f]

const Featuredartist = ({ scrollY }) => {
    const { content } = usePageContent('openmic')
    const cardRefs = useRef([])
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
    const defaultNames = [
        'Adheesh Gokhale', 'Amirtha Ravicoumar', 'Hyperr Beatbox', 'Muskaan Arora',
        'Ritesh Shah', 'Surie', 'Tripti Avasthi', 'Vasundhara Taneja',
        'Hetvi Rana', 'Raph Mayer', 'Eman Pirzada', 'Akshit Kukkreja',
        'Siddharth Khanna', 'Vrunda Upadhyay', 'Rozanna', 'Robbie Singh',
    ]
    const defaultHandles = [
        '@swar.adheesh', '@amirtha_ravicoumar', '@_hyperr_beatbox', '@music.muskaan',
        '@ritzpiano', '@supersurie', '@pepqueen', '@vasutnja',
        '@hetvimusic', '@raphmayer', '@emanpirzada', '@akshitkmusic',
        '@sidplaysguitar', '@vrundamusic', '@dcruz_rose', '@robbie.singhh',
    ]
    const positions = [
        { top: '0%', left: '55%' },
        { top: '6.53%', right: '55%' },
        { top: '13.07%', right: '18%' },
        { top: '19.6%', left: '12%' },
        { top: '26.13%', right: '6%' },
        { top: '32.67%', left: '18%' },
        { top: '39.2%', right: '4%' },
        { top: '45.73%', left: '8%' },
        { top: '52.27%', right: '14%' },
        { top: '58.8%', left: '10%' },
        { top: '65.33%', right: '20%' },
        { top: '71.87%', left: '15%' },
        { top: '78.4%', right: '8%' },
        { top: '84.93%', left: '3%' },
        { top: '91.47%', right: '12%' },
        { top: '98%', left: '18%' },
    ]
    const artists = Array.from({ length: 16 }, (_, i) => {
        const n = i + 1
        return {
            id: n,
            name: content[`featured_name${n}`] || defaultNames[i],
            handle: content[`featured_handle${n}`] || defaultHandles[i],
            instagram: '',
            image: fallbacks[i],
            ...positions[i],
        }
    })

    useEffect(() => {
        const y = scrollY ?? 0

        cardRefs.current.forEach((el, i) => {
            if (!el) return

            // subtle different speeds for depth
            const speed = 0.1

            const translate = y * speed

            el.style.transform = `translateY(-${translate}px)`
        })
    }, [scrollY])
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Checkered Background Pattern */}

            {/* Header */}
            <section className="px-12">
                <div className="flex items-center gap-6">
                    {/* Left title */}
                    <h2 className="oswaldd text-3xl font-medium tracking-wide whitespace-nowrap text-white uppercase md:text-[80px]">
                        {content.featured_section_title || 'Featured artists'}
                    </h2>

                    {/* Divider line */}
                    <div className="h-1 flex-1 bg-white" />

                    {/* Right text */}
                    <div className="flex shrink-0 items-center md:ml-10 md:gap-4">
                        <button onClick={scrollLeft} className="transition hover:opacity-70">
                            <img src={left} alt="left" className="h-8 w-8 md:h-10 md:w-10" />
                        </button>
                        <button onClick={scrollRight} className="transition hover:opacity-70">
                            <img src={right} alt="right" className="h-8 w-8 md:h-10 md:w-10" />
                        </button>
                    </div>
                </div>
            </section>

            {/* MOBILE – vertical list */}
            <div className="mt-12 block space-y-10 px-4 md:hidden">
                {artists.map((artist) => (
                    <div key={artist.id} className="flex flex-col items-center gap-4 text-center">
                        <img
                            src={artist.image}
                            alt={artist.name}
                            className="h-[260px] w-[260px] rounded-3xl object-cover"
                        />

                        <div>
                            <h3 className="text-xl font-bold text-white">{artist.name}</h3>
                            {artist.instagram ? (
                                <a
                                    href={artist.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-neon-yellow text-base text-white opacity-80 transition-colors duration-300"
                                >
                                    {artist.handle}
                                </a>
                            ) : (
                                <p className="text-base text-white opacity-80">{artist.handle}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Artist Cards Container */}
            <div className="relative mx-auto my-30 mb-80 hidden h-[3800px] w-full md:block">
                {artists.map((artist, i) => (
                    <div
                        key={artist.id}
                        ref={(el) => (cardRefs.current[i] = el)}
                        className="absolute will-change-transform"
                        style={{
                            top: artist.top,
                            left: artist.left,
                            right: artist.right,
                        }}
                    >
                        <div className="group flex items-center gap-4">
                            {/* IMAGE WRAPPER */}
                            <div className="relative rounded-[28px] shadow-none transition-[border-radius,box-shadow] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rounded-[140px] group-hover:shadow-xl">
                                {/* IMAGE */}
                                <div className="relative overflow-hidden rounded-[75px] border-4 border-white transition-[border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rounded-[150px]">
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="h-[280px] w-[280px] object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                                    />

                                    {/* TEXT INSIDE IMAGE */}
                                </div>
                                <div className="absolute -right-8 bottom-4 z-10 flex translate-y-4 flex-col overflow-visible bg-[#10042299] text-left opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-0 group-hover:opacity-100 group-hover:delay-150">
                                    <div className="text-neon-yellow dm-sans-600 text-2xl leading-tight drop-shadow-lg">
                                        {artist.name}
                                    </div>
                                    {artist.instagram ? (
                                        <a
                                            href={artist.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="dm-sans-400 hover:text-neon-yellow text-lg text-white drop-shadow-lg transition-colors duration-300"
                                        >
                                            {artist.handle}
                                        </a>
                                    ) : (
                                        <p className="dm-sans-400 text-lg text-white drop-shadow-lg">
                                            {artist.handle}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT TEXT */}
                            <div className="translate-x-0 border-l-2 border-[#D9D9D9] px-2 text-white opacity-100 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-4 group-hover:opacity-0">
                                <h3 className="dm-sans-400 text-2xl font-bold">{artist.name}</h3>
                                <p className="dm-sans-400 text-lg">{artist.handle}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Featuredartist
