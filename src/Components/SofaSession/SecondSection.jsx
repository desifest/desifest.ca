import arrow from '@/Assets/home/animation/image.png'
import { useEffect, useRef } from 'react'
import usePageContent from '@/hooks/usePageContent'
// IMAGES

import img2Fallback from '@/Assets/sofa_session/sofasessionsecondsection.svg'
import bgFallback from '@/Assets/sofa_session/sofasessionsecondsectionbg.png'

const ArtistCard = ({ image, title, description }) => {
    return (
        <div className="group relative flex h-full cursor-pointer flex-col justify-between bg-gradient-to-b from-[#AC48FF] to-[#541FDF] p-6 transition-all duration-500 ease-out hover:bg-[radial-gradient(circle_at_top,_#FFFFFF_0%,_#DDFE08_40%,_#AC48FF_100%)]">
            {/* IMAGE */}

            <div className="mb-4 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-60 w-3/5 group-hover:w-4/5 object-cover  transition-all duration-500 ease-out "
                />
            </div>

            {/* TEXT CONTENT */}
            <div className="flex flex-col gap-3">
                <h3 className="dm-sans-400 text-[32px] leading-tight text-white uppercase group-hover:text-black sm:text-[48px]">
                    {title}
                </h3>

                <p className="dm-sans-400 text-[18px] leading-relaxed text-white/90 group-hover:text-black">
                    {description}
                </p>
            </div>

            {/* ARROW */}
            <div className="right-6 bottom-6 mt-10 justify-end self-end">
                <img
                    src={arrow}
                    alt=""
                    className="w-8 brightness-0 invert transition-all duration-500 ease-out group-hover:-rotate-45 group-hover:invert-0"
                />
            </div>
        </div>
    )
}

const SecondSection = ({ scrollY, pageContent }) => {
    const { content: localContent } = usePageContent('sofa-sessions')
    const content = pageContent || localContent
    const featuredRef = useRef(null)
    const communityRef = useRef(null)
    const imageRef = useRef(null)

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
        <section className="relative w-full overflow-x-hidden overflow-y-clip bg-[#AC48FF] py-16 lg:py-32">
            <div className="md:px-6 md:pl-40">
                {/* DESKTOP BG */}
                <img
                    src={content.second_section_bg || bgFallback}
                    className="pointer-events-none absolute -bottom-10 hidden h-200 lg:block"
                    alt=""
                />

                {/* GRID CONTAINER (UNCHANGED) */}
                <div className="relative z-30 mx-auto grid w-full max-w-full grid-cols-1 gap-16 px-6 pt-20 lg:grid-cols-3">
                    {/* FIRST CARD – TOP */}
                    <div ref={featuredRef} className="self-start">
                        <ArtistCard
                            image={content.second_section_img || img2Fallback}
                            title={content.card1_title || "The beginning"}
                            description={content.card1_description || "Born during the pandemic, DESIFEST Sofa Sessions brought our community together when live performances stopped."}
                        />
                    </div>
                    {/* SECOND CARD – LOWER */}
                    <div ref={communityRef} className="self-start sm:mt-20">
                        <ArtistCard
                            image={content.card2_img || img2Fallback}
                            title={content.card2_title || "Artist Platform"}
                            description={content.card2_description || "What began as a simple sofa evolved into a hub for genuine conversations, talent showcases, and the inspiring stories of South Asian artists. We celebrate their journeys and creative paths beyond the spotlight."}
                        />
                    </div>
                    {/* THIRD CARD – TOP */}
                    <div className="relative self-start">
                        <ArtistCard
                            image={content.card3_img || img2Fallback}
                            title={content.card3_title || "Community & Culture"}
                            description={content.card3_description || "This initiative focuses on building community, celebrating culture, and keeping the conversation going. Even when the music pauses, the stories continue to resonate."}
                        />

                        {/* BG attached to 3rd card */}
                    </div>{' '}
                </div>
                <div className="relative h-100">
                    <img
                        src={content.second_section_bg || bgFallback}
                        className="pointer-events-none absolute left-10 scale-150 md:hidden"
                        alt=""
                    />
                </div>
            </div>
        </section>
    )
}

export default SecondSection
