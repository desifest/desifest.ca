import Silder1 from '../../Assets/artist/Silder/Silder1.png'
import Silder2_1 from '../../Assets/artist/Silder/Silder2.1.png'
import Silder2_2 from '../../Assets/artist/Silder/Silder2.2.png'
import Silder2_3 from '../../Assets/artist/Silder/Silder2.3.png'
import Silder2_4 from '../../Assets/artist/Silder/Silder2.4.png'
import Silder3 from '../../Assets/artist/Silder/Silder3.png'
import Silder4_1 from '../../Assets/artist/Silder/Silder4.1.png'
import Silder4_2 from '../../Assets/artist/Silder/Silder4.2.png'
import Silder4_3 from '../../Assets/artist/Silder/Silder4.3.png'
import Silder4_4 from '../../Assets/artist/Silder/Silder4.4.png'
import Silder5 from '../../Assets/artist/Silder/Silder5.png'
import Silder6_1 from '../../Assets/artist/Silder/Silder6.1.png'
import Silder6_2 from '../../Assets/artist/Silder/Silder6.2.png'
import Silder6_3 from '../../Assets/artist/Silder/Silder6.3.png'
import Silder6_4 from '../../Assets/artist/Silder/Silder6.4.png'
import Silder7 from '../../Assets/artist/Silder/Silder7.png'
import Silder8_1 from '../../Assets/artist/Silder/Silder8.1.png'
import Silder8_2 from '../../Assets/artist/Silder/Silder8.2.png'
import Silder8_3 from '../../Assets/artist/Silder/Silder8.3.png'
import Silder8_4 from '../../Assets/artist/Silder/Silder8.4.png'
import Silder9 from '../../Assets/artist/Silder/Silder9.png'
import Silder10_1 from '../../Assets/artist/Silder/Silder10.1.png'
import Silder10_2 from '../../Assets/artist/Silder/Silder10.2.png'
import Silder10_3 from '../../Assets/artist/Silder/Silder10.3.png'
import Silder10_4 from '../../Assets/artist/Silder/Silder10.4.png'
import Silder11 from '../../Assets/artist/Silder/Silder11.png'
import Silder12_1 from '../../Assets/artist/Silder/Silder12.1.png'
import Silder12_2 from '../../Assets/artist/Silder/Silder12.2.png'
import Silder12_3 from '../../Assets/artist/Silder/Silder12.3.png'
import Silder12_4 from '../../Assets/artist/Silder/Silder12.4.png'
import Silder13 from '../../Assets/artist/Silder/Silder13.png'

import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'

import { useRef, useState, useEffect } from 'react'

const Communityart = () => {
    const bigCircleRefs = useRef([])
    bigCircleRefs.current = []
    const addToRefs = (el) => {
        if (el && !bigCircleRefs.current.includes(el)) {
            bigCircleRefs.current.push(el)
        }
    }

    const scrollRef = useRef(null)
    const contentRef = useRef(null)
    const [activeIndex, setActiveIndex] = useState(null)

    const isDown = useRef(false)
    const startX = useRef(0)
    const scrollLeftPos = useRef(0)

    const handleScrollStart = () => {
        setActiveIndex(null)
    }

    const handleMouseDown = (e) => {
        isDown.current = true
        scrollRef.current.classList.add('cursor-grabbing')
        startX.current = e.pageX
        scrollLeftPos.current = scrollRef.current.scrollLeft
    }

    const handleMouseLeave = () => {
        isDown.current = false
        scrollRef.current.classList.remove('cursor-grabbing')
    }

    const handleMouseUp = () => {
        isDown.current = false
        scrollRef.current.classList.remove('cursor-grabbing')
    }

    const handleMouseMove = (e) => {
        if (!isDown.current) return
        e.preventDefault()
        const walk = (e.pageX - startX.current) * 1.2
        scrollRef.current.scrollLeft = scrollLeftPos.current - walk
    }

    const scrollLeftBtn = () => {
        scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }

    const scrollRightBtn = () => {
        scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }

    useEffect(() => {
        const container = scrollRef.current
        const content = contentRef.current

        if (!container || !content) return

        const singleWidth = content.scrollWidth / 4

        // Start from middle copy
        container.scrollLeft = singleWidth

        const handleInfinite = () => {
            if (container.scrollLeft <= 0) {
                container.scrollLeft = singleWidth
            }

            if (container.scrollLeft >= singleWidth * 2) {
                container.scrollLeft = singleWidth
            }
        }

        container.addEventListener('scroll', handleInfinite)
        return () => container.removeEventListener('scroll', handleInfinite)
    }, [])
    const snapToClosest = () => {
        const container = scrollRef.current
        if (!container) return

        const containerCenter = container.scrollLeft + container.offsetWidth / 2

        let closest = null
        let closestDistance = Infinity

        bigCircleRefs.current.forEach((circle) => {
            const circleCenter = circle.offsetLeft + circle.offsetWidth / 2

            const distance = Math.abs(containerCenter - circleCenter)

            if (distance < closestDistance) {
                closestDistance = distance
                closest = circle
            }
        })

        if (closest) {
            const scrollTo =
                closest.offsetLeft - container.offsetWidth / 2 + closest.offsetWidth / 2

            container.scrollTo({
                left: scrollTo,
                behavior: 'smooth',
            })
        }
    }
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        let timeout

        const handleScrollEnd = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                snapToClosest()
            }, 120)
        }

        container.addEventListener('scroll', handleScrollEnd)

        return () => {
            container.removeEventListener('scroll', handleScrollEnd)
        }
    }, [])

    const sliderContent = (
        <>
            <BigCircle
                ref={addToRefs}
                index={0}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder1}
                name="queens of bollywood"
            />
            <SmallGrid images={[Silder2_1, Silder2_2, Silder2_3, Silder2_4]} />
            <BigCircle
                ref={addToRefs}
                index={1}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder3}
                name="spitty"
            />
            <SmallGrid images={[Silder4_1, Silder4_2, Silder4_3, Silder4_4]} />
            <BigCircle
                ref={addToRefs}
                index={2}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                img={Silder5}
                draggable="false"
                name="Yanchan"
            />
            <SmallGrid images={[Silder6_1, Silder6_2, Silder6_3, Silder6_4]} />
            <BigCircle
                index={3}
                ref={addToRefs}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder7}
                name="desiriff"
            />
            <SmallGrid images={[Silder8_1, Silder8_2, Silder8_3, Silder8_4]} />
            <BigCircle
                index={4}
                ref={addToRefs}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder9}
                name="anchante"
            />
            <SmallGrid images={[Silder10_1, Silder10_2, Silder10_3, Silder10_4]} />
            <BigCircle
                ref={addToRefs}
                index={5}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder11}
                name="Bollywood duet"
            />
            <SmallGrid images={[Silder12_1, Silder12_2, Silder12_3, Silder12_4]} />
            <BigCircle
                index={6}
                ref={addToRefs}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                draggable="false"
                img={Silder13}
                name="muse box"
            />
             <SmallGrid images={[Silder12_1, Silder12_2, Silder12_3, Silder12_4]} /> 
        </>
    )

    return (
        <div className="w-full overflow-hidden py-8">
            {/* ===== HEADER (UNCHANGED) ===== */}
            <div className="mb-10 flex flex-col items-start justify-center">
                <div className="flex w-full items-center gap-1 md:items-center md:gap-4">
                    <h2 className="oswald-500 text-[36px] tracking-wide whitespace-nowrap text-black uppercase md:text-[60px]">
                        community artists
                    </h2>

                    <div className="dm-sans-400 flex flex-1 flex-col items-center justify-start text-2xl sm:mt-8">
                        <div className="h-0.5 w-full bg-black" />
                    </div>

                    <div className="flex shrink-0 items-center md:ml-10 md:gap-4">
                        <button onClick={scrollLeftBtn} className="transition hover:opacity-70">
                            <img src={left} alt="left" className="h-8 w-8 invert md:h-10 md:w-10" />
                        </button>
                        <button onClick={scrollRightBtn} className="transition hover:opacity-70">
                            <img
                                src={right}
                                alt="right"
                                className="h-8 w-8 invert md:h-10 md:w-10"
                            />
                        </button>
                    </div>
                </div>

                <div className="ml-2 mt-2 text-sm sm:text-base">
                    Once part of the journey. <br /> Always part of the community.
                </div>
            </div>

            {/* ===== SLIDER ===== */}
            <div
                ref={scrollRef}
                onMouseDown={(e) => {
                    handleScrollStart()
                    handleMouseDown(e)
                }}
                onTouchStart={handleScrollStart}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="no-scrollbar flex cursor-grab items-center overflow-x-auto py-40 select-none active:cursor-grabbing"
            >
                <div ref={contentRef} className="flex items-center">
                    {sliderContent}
                    {sliderContent}
                    {sliderContent}
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="mx-auto flex w-60 items-center gap-1 py-4">
                <div className="h-1.5 w-8 rounded-full bg-[#EEFE08]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#100422]" />
            </div>

            {/* FOOTER */}
            <div className="flex w-full flex-col items-center px-4 text-xl sm:items-end sm:text-3xl">
                <div className="oswald-500 uppercase">Thank you</div>
                <div className="oswald-400 uppercase">for being a part of our</div>
                <div className="oswald-500 uppercase">desifest community!</div>
            </div>
        </div>
    )
}

export default Communityart
import { forwardRef } from 'react'

const BigCircle = forwardRef(({ img, name, index, activeIndex, setActiveIndex }, ref) => {
    const isActive = activeIndex === index

    const handleClick = () => {
        if (window.innerWidth < 768) {
            setActiveIndex(isActive ? null : index)
        }
    }

    return (
        <div
            ref={ref}
            onClick={handleClick}
            className="group relative h-full flex-shrink-0 cursor-pointer overflow-visible"
        >
            {/* IMAGE */}
            <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'rounded-[40px] ring-4 ring-[#4A90D9]' : 'rounded-[170px]'} md:group-hover:rounded-[40px] md:group-hover:ring-4 md:group-hover:ring-[#4A90D9]`}>
                <img
                    src={img}
                    alt={name}
                    draggable="false"
                    className="pointer-events-none h-[340px] w-[340px] object-cover"
                />
            </div>

            {/* NAME */}
            <div
                className={`absolute bottom-0 w-full overflow-hidden transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'} md:opacity-0 md:group-hover:opacity-100`}
            >
                <div className="dm-sans-500 rounded-b-[40px] bg-[#10042299] px-4 py-6 text-left text-lg text-white uppercase">
                    {name}
                    <div className="dm-sans-400 mt-1 text-sm normal-case text-white/80">@artist.instaprofile</div>
                </div>
            </div>

            {/* RINGS */}
            <div
                className={`absolute -right-44 -bottom-44 z-[-10] flex h-[38rem] w-[38rem] items-center justify-center transition-all duration-700 ease-out ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'} md:scale-90 md:opacity-0 md:group-hover:scale-100 md:group-hover:opacity-100`}
            >
                <div className="absolute inset-32 rounded-[40px] border border-black/90 transition-all duration-700" />
                <div className="absolute inset-[5.5rem] rounded-[40px] border border-black/60 transition-all delay-75 duration-700" />
                <div className="absolute inset-12 rounded-[40px] border border-black/30 transition-all delay-150 duration-700" />
                <div className="absolute inset-0 rounded-[40px] border border-black/10 transition-all delay-200 duration-700" />
            </div>
        </div>
    )
})

const SmallGrid = ({ images }) => {
    return (
        <div className="grid flex-shrink-0 grid-cols-2 gap-0">
            {images.map((img, index) => (
                <img
                    key={index}
                    src={img}
                    alt="artist"
                    draggable="false"
                    className="pointer-events-none h-[143px] w-[143px] rounded-full object-cover"
                />
            ))}
        </div>
    )
}
