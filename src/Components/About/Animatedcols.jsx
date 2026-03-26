import arrow from '@/Assets/home/animation/image.png'
import col2imgFallback from '@/Assets/about/col2img.png'
import abouttwoFallback from '@/Assets/about/abouttwo.svg'
import aboutthreeFallback from '@/Assets/about/aboutthree.svg'
import aboutfourFallback from '@/Assets/about/aboutfour.svg'
import yellowone from '@/Assets/about/yellowone.svg'
import yellowtwo from '@/Assets/about/yellowtwo.svg'
import yellowthree from '@/Assets/about/yelllowthree.svg'
import yellowfour from '@/Assets/about/yellowfour.svg'
import usePageContent from '@/hooks/usePageContent'

const ArtistCard = ({ image, title, description }) => {
    return (
        <div className="group hover:bg-neon-yellow relative mx-4 my-8 flex cursor-pointer flex-col justify-between bg-white p-8 transition-all duration-500 ease-out sm:mx-0 sm:h-180 sm:max-w-160">
            <div className="overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-3/4 group-hover:w-full object-cover transition-all duration-500 ease-out "
                />
            </div>
            <h3 className="dm-sans-400 mt-4 overflow-visible text-start text-4xl text-nowrap text-black uppercase sm:text-5xl md:mt-0">
                {title}
            </h3>
            <div className="dm-sans-400 mt-4 w-full max-w-sm text-start text-xl text-black sm:text-2xl md:mt-0">
                {description}
            </div>

            <div className="my-3 flex flex-col items-start justify-between">
                <div className="flex w-full justify-end">
                    <img
                        src={arrow}
                        alt=""
                        className="w-10 rotate-0 transition-transform duration-500 ease-out group-hover:-rotate-45"
                    />
                </div>
            </div>
        </div>
    )
}
import { useEffect, useRef } from 'react'

const columns = [
    { height: 1800, speed: 0.06, initialOffset: 0 },
    { height: 1800, speed: 0.02, initialOffset: 150 },
    { height: 2000, speed: 0.07, initialOffset: -50 },
]


const AnimatedCols = ({ scrollY }) => {
    const refs = useRef([])
    const { content } = usePageContent('about')

    const artistCardsData = [
        {
            title: content.about_mission_title || 'Our Mission',
            image: yellowone,
            description: content.about_mission_desc || 'To celebrate and promote South Asian Arts & Culture on a global stage, dismantling stereotypes, eradicating bias and combating discrimination to empower individuals in their pursuit of passion.',
        },
        {
            title: content.about_vision_title || 'Our Vision',
            image: yellowtwo,
            description: content.about_vision_desc || 'To become the leading global platform for South Asian Arts & Culture. We aim to connect artists, creators and audiences from the diverse South Asian diaspora, fostering a profound sense of belonging and mutual appreciation.',
        },
        {
            title: content.about_culture_title || 'Our Culture',
            image: yellowthree,
            description: content.about_culture_desc || 'We\'re passionate about music and art and create new opportunities for artists and influencers to showcase their talent. With the support of our partners, we\'re dedicated to promoting and supporting the next generation.',
        },
        {
            title: content.about_support_title || 'Our Support',
            image: yellowfour,
            description: content.about_support_desc || 'Since our 2006 launch, we are dedicated to supporting talent in Canada and helping them reach new audiences. We\'ve accomplished this by pooling our resources with a variety of partners, including leading brands and government organisations.',
        },
    ]

    const col2img = content.about_col2img || col2imgFallback
    const abouttwo = content.about_img2 || abouttwoFallback
    const aboutthree = content.about_img3 || aboutthreeFallback
    const aboutfour = content.about_img4 || aboutfourFallback

    useEffect(() => {
        const y = scrollY ?? 0
    
        refs.current.forEach((el, i) => {
            if (!el) return
    
            const baseOffset = columns[i].initialOffset
            const scrollMovement = y * columns[i].speed
    
            const totalTranslate = baseOffset - scrollMovement
    
            el.style.transform = `translateY(${totalTranslate}px)`
        })
    }, [scrollY])
    

    return (
        <div className="relative flex w-full items-start justify-start">
            <div className="hidden w-full sm:flex">
                {columns.map((col, i) => (
                    <div
                        key={i}
                        ref={(el) => (refs.current[i] = el)}
                        className="pointer-events-none flex flex-1 items-start justify-center overflow-visible bg-transparent px-4 pt-32 will-change-transform"
                        style={{ height: col.height }}
                    >
                        <div className="pointer-events-auto">
                            {artistCardsData[0] && i === 0 && (
                                <div className="w-full overflow-visible">
                                    <ArtistCard
                                        image={artistCardsData[0].image}
                                        title={artistCardsData[0].title}
                                        description={artistCardsData[0].description}
                                    />
                                    <div className="flex flex-row items-start gap-2">
                                        <img src={col2img} alt="" className="w-30" />
                                        <img src={abouttwo} alt="" className="w-80" />
                                    </div>
                                    <div className="mt-60 w-full translate-x-24 border-l-2 border-amber-50 pl-4 text-start">
                                        <p className="dm-sans-500 text-2xl tracking-wide text-white/80 uppercase">
                                            Facebook Fans
                                        </p>
                                        <h3 className="text-neon-yellow special-gothic-one-regular text-5xl">
                                            13K+
                                        </h3>
                                    </div>
                                    <div className="mt-20 w-full translate-x-80 border-l-2 border-amber-50 pl-4 text-start">
                                        <p className="dm-sans-500 text-2xl tracking-wide text-white/80 uppercase">
                                            Instagram Fans
                                        </p>
                                        <h3 className="text-neon-yellow special-gothic-one-regular text-5xl">
                                            28K+
                                        </h3>
                                    </div>
                                </div>
                            )}
                            {artistCardsData[1] && i === 1 && (
                                <div className="w-full">
                                    <ArtistCard
                                        image={artistCardsData[1].image}
                                        title={artistCardsData[1].title}
                                        description={artistCardsData[1].description}
                                    />
                                    <div className="flex flex-row items-start gap-2">
                                        <img src={aboutthree} alt="" className="w-full" />
                                    </div>
                                    <div className="mt-36 w-full translate-x-24 border-l-2 border-amber-50 pl-4 text-start">
                                        <p className="dm-sans-500 text-2xl tracking-wide text-white/80 uppercase">
                                            Total Impressions
                                        </p>
                                        <h3 className="text-neon-yellow special-gothic-one-regular text-5xl">
                                            45M+
                                        </h3>
                                    </div>
                                </div>
                            )}
                            {artistCardsData[2] && artistCardsData[3] && i === 2 && (
                                <div className="w-full">
                                    <ArtistCard
                                        image={artistCardsData[2].image}
                                        title={artistCardsData[2].title}
                                        description={artistCardsData[2].description}
                                    />
                                    <ArtistCard
                                        image={artistCardsData[3].image}
                                        title={artistCardsData[3].title}
                                        description={artistCardsData[3].description}
                                    />
                                    <img src={aboutfour} alt="" />
                                    <div className="mb-10 flex items-start gap-4">
                                        <div className="h-14 w-px" />
                                    </div>
                                    <div className="mt-30 w-full border-l-2 border-amber-50 pl-4 text-start">
                                        <p className="dm-sans-500 text-2xl tracking-wide text-white/80 uppercase">
                                            Festival Attendance
                                        </p>
                                        <h3 className="text-neon-yellow special-gothic-one-regular text-5xl">
                                            65K+
                                        </h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col sm:hidden">
                {artistCardsData.map((card, index) => (
                    <ArtistCard
                        key={index}
                        image={card.image}
                        title={card.title}
                        description={card.description}
                    />
                ))}
                <div className="mx-4 flex flex-row items-start gap-4">
                    <img src={col2img} alt="" className="w-16" />
                    <img src={col2img} alt="" className="w-30" />
                    <img src={col2img} alt="" className="w-44" />
                </div>
                <div className="flex -translate-y-16 flex-col items-start justify-start gap-12">
                    <div className="w-full translate-x-4 border-l-2 border-amber-50 pl-4 text-start">
                        <p className="dm-sans-500 text-lg tracking-wide text-white/80 uppercase">
                            Facebook Fans
                        </p>
                        <h3 className="text-neon-yellow special-gothic-one-regular text-4xl">
                            13K+
                        </h3>
                    </div>

                    <div className="w-full  translate-x-18 border-l-2 border-amber-50 pl-4 text-start">
                        <p className="dm-sans-500 text-lg tracking-wide text-white/80 uppercase">
                            Instagram Fans
                        </p>
                        <h3 className="text-neon-yellow special-gothic-one-regular text-4xl">
                            28K+
                        </h3>
                    </div>

                    <div className="w-full translate-x-28 border-l-2 border-amber-50 pl-4 text-start">
                        <p className="dm-sans-500 text-lg tracking-wide text-white/80 uppercase">
                            Total Impressions
                        </p>
                        <h3 className="text-neon-yellow special-gothic-one-regular text-4xl">
                            45M+
                        </h3>
                    </div>

                    <div className="w-full translate-x-48 border-l-2 border-amber-50 pl-4 text-start">
                        <p className="dm-sans-500 text-lg tracking-wide text-white/80 uppercase">
                            Festival Attendance
                        </p>
                        <h3 className="text-neon-yellow special-gothic-one-regular text-4xl">
                            65K+
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnimatedCols
