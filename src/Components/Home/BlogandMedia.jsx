import EventCard from './meadiacard'
import meadiabackFallback from '@/Assets/home/Media/image copy.png'
import backgroundFallback from '@/Assets/home/Media/image.png'
import staticBlogs from '@/data/blogs'
import { useEffect, useRef, useState } from 'react'
import left from '../../Assets/concerts/leftwhitearrow.svg'
import right from '../../Assets/concerts/rightwhitearrow.svg'

const BlogsAndMedia = ({ scrollY, pageContent = {} }) => {
    const [blogs, setBlogs] = useState(staticBlogs)
    const [page, setPage] = useState(0)
    const scrollRef = useRef(null)

    const meadiaback = pageContent.media_bg || meadiabackFallback
    const background = pageContent.media_bg || backgroundFallback

    useEffect(() => {
        fetch('/api/blogs')
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setBlogs(data.map(b => ({
                        id: b.slug,
                        title: b.title,
                        fullTitle: b.full_title,
                        date: b.date,
                        author: b.author,
                        category: b.category,
                        description: b.description,
                        image: b.image_url,
                        link: `/blog/${b.slug}`,
                        badge: b.badge,
                    })))
                }
            })
            .catch(() => {})
    }, [])

    const totalPages = Math.ceil(blogs.length / 3)
    const visibleBlogs = blogs.slice(page * 3, page * 3 + 3)

    const goNext = () => {
        setPage(prev => {
            const max = Math.ceil(blogs.length / 3) - 1
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
        <section className="relative overflow-hidden px-4 py-4 text-white sm:px-8 lg:px-16">
            <div className="relative z-20 mx-auto max-w-7xl">
                <img
                    src={meadiaback}
                    alt="background"
                    className="pointer-events-none absolute -top-20 w-full object-cover"
                />

                <div className="mb-8 uppercase">
                    <div className="oswald-500 hidden items-center gap-4 text-5xl sm:flex">
                        <span className="text-neon-yellow whitespace-nowrap">
                            {pageContent.blog_section_title || 'BLOGS & MEDIA'}
                        </span>
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
                        <div className="oswald-500 text-neon-yellow mr-4 text-4xl text-nowrap">
                            {pageContent.blog_section_title || 'BLOGS & MEDIA'}
                        </div>
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

                <div className="relative z-30">
                    <img
                        src={background}
                        alt="background"
                        className="pointer-events-none absolute -top-20 z-0 w-full object-cover"
                    />

                    <div className="relative z-10 hidden sm:grid sm:grid-cols-3 sm:gap-8">
                        {visibleBlogs.map((blog, index) => (
                            <div key={`${page}-${index}`} className="w-full">
                                <EventCard
                                    image={blog.image}
                                    title={blog.title}
                                    date={blog.date}
                                    description={blog.description}
                                    readMoreLink={blog.link}
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        ref={scrollRef}
                        className="relative z-10 flex cursor-grab gap-6 overflow-x-auto pb-4 active:cursor-grabbing sm:hidden"
                    >
                        {blogs.map((blog, index) => (
                            <div key={index} className="w-72 flex-shrink-0">
                                <EventCard
                                    image={blog.image}
                                    title={blog.title}
                                    date={blog.date}
                                    description={blog.description}
                                    readMoreLink={blog.link}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BlogsAndMedia
