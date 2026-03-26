import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { CalendarDays, Clock3, MapPin, ChevronLeft } from 'lucide-react'
import blogs from '@/data/blogs'
import SEO from '@/Components/SEO'

const BlogPost = () => {
    const { slug } = useParams()
    const pathSlug = slug
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/blogs/${pathSlug}`)
                if (res.ok) {
                    const data = await res.json()
                    setBlog({
                        id: data.slug,
                        title: data.title,
                        fullTitle: data.full_title,
                        date: data.date,
                        author: data.author,
                        category: data.category,
                        description: data.description,
                        image: data.image_url,
                        badge: data.badge,
                        meta: data.meta || {},
                        sections: data.sections || [],
                        socialLinks: data.social_links || {},
                    })
                    setLoading(false)
                    return
                }
            } catch (e) {}

            const staticBlog = blogs.find((b) => b.id === pathSlug)
            if (staticBlog) {
                setBlog(staticBlog)
            } else {
                setNotFound(true)
            }
            setLoading(false)
        }
        fetchBlog()
    }, [pathSlug])

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#100422] text-white">
                <p className="text-gray-300">Loading...</p>
            </main>
        )
    }

    if (notFound || !blog) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#100422] text-white">
                <h1 className="text-3xl">Blog post not found</h1>
            </main>
        )
    }

    const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
    const shareText = encodeURIComponent(blog.fullTitle || blog.title || '')
    const shareUrl = encodeURIComponent(pageUrl)

    const socialIcons = [
        { name: 'Twitter', href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, icon: FaTwitter },
        { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, icon: FaFacebookF },
        { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, icon: FaLinkedinIn },
    ]

    const blogImageUrl = blog.image
        ? (blog.image.startsWith('http') ? blog.image : `https://desifest.ca${blog.image}`)
        : null

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.fullTitle || blog.title,
        description: blog.description || '',
        ...(blogImageUrl ? { image: blogImageUrl } : {}),
        datePublished: blog.date || '',
        author: {
            '@type': 'Organization',
            name: blog.author || 'DESIFEST',
        },
        publisher: {
            '@type': 'Organization',
            name: 'DESIFEST',
            url: 'https://desifest.ca',
        },
        url: `https://desifest.ca/blog/${pathSlug}`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://desifest.ca/blog/${pathSlug}`,
        },
    }

    return (
        <main className="relative min-h-screen w-full bg-[#100422] px-6 pt-28 pb-16 text-white md:px-12 md:pt-32 md:pb-20 lg:px-20">
            <SEO
                title={blog.fullTitle || blog.title}
                description={blog.description || ''}
                image={blogImageUrl}
                type="article"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#453361] blur-3xl" />
            </div>

            <article className="relative mx-auto w-full max-w-5xl">
                <Link to="/media" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-300 transition hover:text-[#D5FF00]">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Blogs
                </Link>

                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    {blog.image ? (
                    <img src={blog.image} alt={blog.fullTitle} className="h-[350px] w-full object-cover md:h-[450px]" />
                    ) : (
                    <div className="flex h-[350px] w-full items-center justify-center bg-[#1a0a2e] md:h-[450px]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100422] via-[#100422]/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-sm uppercase tracking-widest text-neon-yellow">{blog.badge}</p>
                        <h1 className="oswald-500 mt-3 text-3xl leading-tight md:text-5xl">{blog.fullTitle}</h1>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#d6cfea] md:text-base">
                    <span>{blog.date}</span>
                    <span className="text-neon-yellow">|</span>
                    <span>by {blog.author}</span>
                    <span className="text-neon-yellow">|</span>
                    <span>{blog.category}</span>
                </div>

                <div className="mt-6 h-[2px] w-full bg-white/20" />

                <div className="dm-sans-400 mt-10 space-y-8 text-base leading-8 text-[#f5f1fb] md:text-lg">
                    {resetLinkedKeywords()}
                    {blog.sections.map((section, i) => (
                        <BlogSection key={i} section={section} />
                    ))}
                </div>

                <div className="mt-14 flex items-center gap-4">
                    {socialIcons.map(({ name, href, icon: Icon }) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={name}
                            className="hover:border-neon-yellow hover:text-neon-yellow flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/5 transition duration-300"
                        >
                            <Icon className="text-base" />
                        </a>
                    ))}
                </div>
            </article>
        </main>
    )
}

const AUTO_LINKS = {
    'DESIFEST': { url: 'https://desifest.ca', external: true },
    'Desifest': { url: 'https://desifest.ca', external: true },
    'UMA Foundation': { url: 'https://umafoundation.org', external: true },
}

const linkedKeywords = new Set()

function resetLinkedKeywords() {
    linkedKeywords.clear()
}

function renderRichText(text) {
    const parts = []
    let remaining = text
    let keyIdx = 0

    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|\[(.+?)\]\((.+?)\))/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(autoLinkText(text.slice(lastIndex, match.index), keyIdx))
            keyIdx++
        }
        if (match[2]) {
            parts.push(<strong key={`b-${match.index}`}>{match[2]}</strong>)
        } else if (match[3]) {
            parts.push(<em key={`i-${match.index}`}>{match[3]}</em>)
        } else if (match[4] && match[5]) {
            const isExternal = match[5].startsWith('http')
            parts.push(
                <a key={`l-${match.index}`} href={match[5]} className="text-neon-yellow underline decoration-neon-yellow/40 hover:decoration-neon-yellow" {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {match[4]}
                </a>
            )
        }
        lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
        parts.push(autoLinkText(text.slice(lastIndex), keyIdx))
    }

    return parts.length > 0 ? parts : autoLinkText(text, 0)
}

function autoLinkText(text, keyIdx) {
    const sortedKeywords = Object.keys(AUTO_LINKS).sort((a, b) => b.length - a.length)
    const fragments = [text]

    for (const keyword of sortedKeywords) {
        if (linkedKeywords.has(keyword.toLowerCase())) continue
        for (let i = 0; i < fragments.length; i++) {
            if (typeof fragments[i] !== 'string') continue
            const idx = fragments[i].indexOf(keyword)
            if (idx === -1) continue
            const before = fragments[i].slice(0, idx)
            const after = fragments[i].slice(idx + keyword.length)
            const { url, external } = AUTO_LINKS[keyword]
            linkedKeywords.add(keyword.toLowerCase())
            const link = (
                <a key={`auto-${keyword}-${keyIdx}`} href={url} className="text-neon-yellow hover:underline" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {keyword}
                </a>
            )
            fragments.splice(i, 1, before, link, after)
            break
        }
    }

    return fragments
}

const BlogSection = ({ section }) => {
    switch (section.type) {
        case 'intro':
            return <p className="text-xl font-medium text-white">{renderRichText(section.text)}</p>
        case 'paragraph':
            return <p className={section.italic ? 'italic text-[#d6cfea]' : ''}>{renderRichText(section.text)}</p>
        case 'heading':
            return <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">{section.text}</h2>
        case 'quote':
            return (
                <blockquote className="rounded-xl border-l-4 border-neon-yellow bg-white/[0.03] px-6 py-5 text-white">
                    <span className="font-semibold">{section.text}</span>
                    {section.attribution && <> — {section.attribution}</>}
                </blockquote>
            )
        case 'list':
            return (
                <ul className="list-disc space-y-2 pl-6 marker:text-neon-yellow">
                    {section.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )
        case 'event-details':
            return (
                <div className="space-y-5 rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">
                    <h2 className="oswald-500 text-2xl uppercase text-neon-yellow">Event Details</h2>
                    <div className="space-y-4 text-[#efe7ff]">
                        <div className="flex items-start gap-3 italic">
                            <MapPin className="mt-1 h-5 w-5 text-neon-yellow" />
                            <span>{section.venue}</span>
                        </div>
                        <div className="flex items-start gap-3 italic">
                            <CalendarDays className="mt-1 h-5 w-5 text-neon-yellow" />
                            <span>{section.date}</span>
                        </div>
                        <div className="flex items-start gap-3 italic">
                            <Clock3 className="mt-1 h-5 w-5 text-neon-yellow" />
                            <span>{section.time}</span>
                        </div>
                    </div>
                </div>
            )
        case 'pricing':
            return (
                <div className="grid gap-4 md:grid-cols-3">
                    {section.tiers.map((tier, i) => (
                        <div key={i} className="rounded-xl border border-white/20 bg-white/[0.04] p-4 text-center">
                            <p className="text-sm uppercase text-[#d6cfea]">{tier.label}</p>
                            <p className="mt-2 text-2xl font-bold">{tier.price}</p>
                        </div>
                    ))}
                </div>
            )
        case 'contact-card':
            return (
                <div className="mt-14 rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                    <h3 className="oswald-500 mb-4 text-xl uppercase text-neon-yellow">Media Contact</h3>
                    <p className="text-white">
                        <strong>{section.name}</strong><br />
                        {section.role}<br />
                        {section.email}<br />
                        {section.phone}<br />
                        {section.website}<br />
                        {section.location}
                    </p>
                </div>
            )
        case 'tribute-card':
            return (
                <div className="mt-12 rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center backdrop-blur-sm">
                    <p className="text-lg italic text-[#efe7ff]">{section.text}</p>
                    <p className="mt-4 font-semibold text-white">{section.years}</p>
                </div>
            )
        default:
            return null
    }
}

export default BlogPost
