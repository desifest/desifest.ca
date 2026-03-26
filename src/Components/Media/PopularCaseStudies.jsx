import EventCard from '@/Components/Home/meadiacard.jsx'
import blog1 from '@/Assets/home/Media/image1.png'
import blog2 from '@/Assets/home/Media/image2.png'
import blog3 from '@/Assets/home/Media/image3.png'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'
import { useRef } from 'react'

const mediaData = [
    {
        image: blog1,
        title: 'DESIFEST 2025 "We are Canadian" return...',
        date: 'May 15, 2025',
        description:
            'DESIFEST 2025 Doubles Down on Canadian South Asian Talent with Bold "We Are Canadian" Return to Sankofa Square...',
        readMoreLink: '#',
    },
    {
        image: blog2,
        title: 'Open Mic Unplugged Brings Back...',
        date: 'May 15, 2025',
        description:
            'Open Mic Unplugged Brings South Asian Music Back to the Heart of Gerrard Street May 31,...',
        readMoreLink: '#',
    },
    {
        image: blog3,
        title: 'A Typographic Legend: Jan Middendorp',
        date: 'Jan 07, 2024',
        description:
            'Jan Middendorp (4/9/56–12/8/23) contributed an incredible wealth of knowledge to the field of typography...',
        readMoreLink: '#',
    },
]

const PopularCaseStudies = () => {
    const scrollRef = useRef(null)

    const scroll = (dir) => {
        if (!scrollRef.current) return
        // Card width (280px) + gap (32px from gap-8)
        const cardWidth = 280 + 32
        scrollRef.current.scrollBy({
            left: dir === 'left' ? -cardWidth : cardWidth,
            behavior: 'smooth',
        })
    }

    return (
        <div className="flex flex-col px-2 sm:pl-30">
            {/* Header */}
            <div className="mb-8 text-white uppercase">
                {/* Desktop header */}
                <div className="oswald-500 hidden items-center gap-4 text-5xl sm:flex">
                    <span className="whitespace-nowrap">POPULAR CASE STUDIES</span>
                    <div className="h-[3px] flex-1 rounded-full bg-white" />
                </div>

                {/* Mobile header */}
                <div className="sm:hidden">
                    <div className="oswald-500 text-3xl">POPULAR CASE STUDIES</div>

                    <div className="mt-3 flex w-full justify-center">
                        <div className="flex w-full items-center gap-3">
                            <div className="h-[2px] flex-1 self-center rounded-full bg-white" />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => scroll('left')}
                                    className="flex h-3 w-3 items-center justify-center"
                                >
                                    <img src={left} className="h-full w-full object-contain" alt="" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="flex h-3 w-3 items-center justify-center"
                                >
                                    <img src={right} className="h-full w-full object-contain" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Wrapper */}
            <div
                ref={scrollRef}
                className="flex justify-start gap-8 overflow-x-auto pb-4 sm:justify-center sm:flex-wrap sm:overflow-visible"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {mediaData.map((item, index) => (
                    <div
                        key={index}
                        className="flex min-w-[280px] flex-shrink-0 sm:max-w-[30%] sm:basis-1/3"
                    >
                        <EventCard {...item} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularCaseStudies