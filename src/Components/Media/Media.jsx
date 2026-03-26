import EventCard from '@/Components/Home/meadiacard.jsx'
import blog1 from '@/Assets/home/Media/image1.png'
import blog2 from '@/Assets/home/Media/image2.png'
import blog3 from '@/Assets/home/Media/image3.png'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'
import { useRef, useState, useEffect } from 'react'

const staticMediaData = [
    {
        image: blog1,
        title: 'DESIFEST 2025 "We are Canadian" return...',
        date: 'May 15, 2025',
        description:
            'DESIFEST 2025 Doubles Down on Canadian South Asian Talent with Bold "We Are Canadian" Return to Sankofa Square...',
        readMoreLink: 'desifest-press-release',
    },
    {
        image: blog2,
        title: 'Open Mic Unplugged Brings Back...',
        date: 'May 15, 2025',
        description:
            'Open Mic Unplugged Brings South Asian Music Back to the Heart of Gerrard Street May 31,...',
        readMoreLink: 'open-mic-unplugged',
    },
    {
        image: blog3,
        title: 'A Typographic Legend: Jan Middendorp',
        date: 'Jan 07, 2024',
        description:
            'Jan Middendorp (4/9/56–12/8/23) contributed an incredible wealth of knowledge to the field of typography...',
        readMoreLink: 'a-typographic-legend',
    },
]

const MediaBlogs = () => {
    const [mediaData, setMediaData] = useState(staticMediaData)
    const [page, setPage] = useState(0)
    const scrollRef = useRef(null)

    useEffect(() => {
        fetch('/api/blogs')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setMediaData(data.map(b => ({
                        image: b.image_url,
                        title: b.title,
                        date: b.date,
                        description: b.description,
                        readMoreLink: `/blog/${b.slug}`,
                    })))
                }
            })
            .catch(() => {})
    }, [])

    const totalPages = Math.ceil(mediaData.length / 3)
    const visibleBlogs = mediaData.slice(page * 3, page * 3 + 3)

    const goNext = () => {
        setPage(prev => {
            const max = Math.ceil(mediaData.length / 3) - 1
            return prev < max ? prev + 1 : prev
        })
    }

    const goPrev = () => {
        setPage(prev => prev > 0 ? prev - 1 : 0)
    }

    const scrollMobile = (dir) => {
        if (!scrollRef.current) return
        scrollRef.current.scrollBy({
            left: dir === 'left' ? -320 : 320,
            behavior: 'smooth',
        })
    }

    const canGoPrev = page > 0
    const canGoNext = page < totalPages - 1

    return (
        <div className="my-6 flex flex-col px-2">
            <div className="mb-8 text-white uppercase">
                <div className="oswald-500 hidden items-center gap-4 text-5xl sm:flex">
                    <span className="whitespace-nowrap">MEDIA BLOGS</span>
                    <div className="h-[3px] flex-1 rounded-full bg-white" />
                    <div className="flex items-center gap-3">
                        <div
                            onClick={goPrev}
                            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-opacity ${canGoPrev ? 'opacity-100 hover:bg-white/10' : 'cursor-default opacity-30'}`}
                        >
                            <img src={left} className="pointer-events-none h-5 w-5 object-contain" alt="" />
                        </div>
                        <div
                            onClick={goNext}
                            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-opacity ${canGoNext ? 'opacity-100 hover:bg-white/10' : 'cursor-default opacity-30'}`}
                        >
                            <img src={right} className="pointer-events-none h-5 w-5 object-contain" alt="" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-row sm:hidden">
                    <div className="oswald-500 mr-4 text-4xl text-nowrap">MEDIA BLOGS</div>

                    <div className="mt-3 flex w-full justify-center">
                        <div className="flex w-full items-center gap-3">
                            <div className="h-[2px] flex-1 rounded-full bg-white" />
                            <div className="flex items-center gap-2">
                                <div
                                    onClick={() => scrollMobile('left')}
                                    className="flex h-4 w-4 cursor-pointer items-center justify-center"
                                >
                                    <img src={left} className="pointer-events-none h-full w-full object-contain" alt="" />
                                </div>
                                <div
                                    onClick={() => scrollMobile('right')}
                                    className="flex h-4 w-4 cursor-pointer items-center justify-center"
                                >
                                    <img src={right} className="pointer-events-none h-full w-full object-contain" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:grid sm:grid-cols-3 sm:gap-8">
                {visibleBlogs.map((item, index) => (
                    <div key={`${page}-${index}`} className="w-full">
                        <EventCard {...item} />
                    </div>
                ))}
            </div>

            <div
                ref={scrollRef}
                className="flex cursor-grab gap-6 overflow-x-auto pb-4 active:cursor-grabbing sm:hidden"
            >
                {mediaData.map((item, index) => (
                    <div key={index} className="w-72 flex-shrink-0">
                        <EventCard {...item} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MediaBlogs
