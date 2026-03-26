import blog3 from '@/Assets/home/Media/image3.png'
/* eslint-disable no-unused-vars */
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'

const TypoGraphicBlog = () => {
    const socialLinks = [
        {
            name: 'Twitter',
            href: 'https://x.com/intent/post?text=A%20Typographic%20Legend%3A%20Jan%20Middendorp&url=https%3A%2F%2Fdesifest.ca%2Fa-typographic-legend-jan-middendorp%2F',
            icon: FaTwitter,
        },
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/sharer/sharer.php?u=https://desifest.ca/a-typographic-legend-jan-middendorp/',
            icon: FaFacebookF,
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/feed/?shareActive=true&shareUrl=https%3A%2F%2Fdesifest.ca%2Fa-typographic-legend-jan-middendorp%2F',
            icon: FaLinkedinIn,
        },
    ]

    return (
        <main className="relative mt-5 min-h-screen w-full bg-[#100422] px-6 py-16 text-white md:px-12 md:py-20 lg:px-20">

            {/* Soft Background Glow */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#453361] blur-3xl" />
            </div>

            <article className="relative mx-auto w-full max-w-5xl">

                {/* HERO IMAGE */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                        src={blog3}
                        alt="Jan Middendorp"
                        className="h-[350px] w-full object-cover md:h-[450px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100422] via-[#100422]/40 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-sm uppercase tracking-widest text-neon-yellow">
                            In Memoriam
                        </p>
                        <h1 className="oswald-500 mt-3 text-3xl leading-tight md:text-5xl">
                            A Typographic Legend: Jan Middendorp
                        </h1>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#d6cfea] md:text-base">
                    <span>January 7, 2024</span>
                    <span className="text-neon-yellow">|</span>
                    <span>by andrealeksen</span>
                    <span className="text-neon-yellow">|</span>
                    <span>Tribute</span>
                </div>

                <div className="mt-6 h-[2px] w-full bg-white/20" />

                {/* CONTENT */}
                <div className="dm-sans-400 mt-10 space-y-8 text-base leading-8 text-[#f5f1fb] md:text-lg">

                    <p className="text-xl font-medium text-white">
                        Jan Middendorp (1956–2023) leaves behind a legacy that shaped modern typography and touched countless designers around the world.
                    </p>

                    <p>
                        I met Jan at my first TypeCon conference in Milwaukee in 2012.
                        He quickly became one of my earliest mentors — offering business advice,
                        type critiques, and introductions that opened doors across the global
                        typography community.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        A Teacher & Author
                    </h2>

                    <p>
                        Jan authored numerous typography books that were not only rich in knowledge,
                        but beautifully designed and written with warmth and accessibility.
                        His textbook <span className="italic">“Shaping Text”</span> became a staple in my
                        Intro to Typography courses — thoughtful, thorough, and filled with
                        inviting chapter titles like “Seducing with Type.”
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        Beyond the Conference Stage
                    </h2>

                    <p>
                        Conferences were where ideas were exchanged — but the real magic
                        often happened afterward. Whether it was paella on a beach in Barcelona,
                        dancing in Amsterdam, or rooftop gatherings across Europe,
                        Jan was always present — thoughtful, observant, and quietly joyful.
                    </p>

                    <blockquote className="rounded-xl border-l-4 border-neon-yellow bg-white/[0.03] px-6 py-5 text-white">
                        A bright light in the international type community has dimmed —
                        but the influence, generosity, and knowledge he shared will endure.
                    </blockquote>

                    <p>
                        Our community is small, but deeply connected. Jan’s impact on my
                        professional journey — and personal life — is immeasurable.
                        May your memory live on, dear Jan.
                    </p>

                    {/* Closing Tribute Section */}
                    <div className="mt-12 rounded-2xl border border-white/15 bg-white/[0.04] p-8 text-center backdrop-blur-sm">
                        <p className="text-lg italic text-[#efe7ff]">
                            Thank you for the mentorship, the wisdom, and the inspiration.
                        </p>
                        <p className="mt-4 font-semibold text-white">
                            1956 – 2023
                        </p>
                    </div>
                </div>

                {/* SOCIAL SHARE */}
                <div className="mt-14 flex items-center gap-4">
                    {socialLinks.map(({ name, href, icon: Icon }) => (
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

export default TypoGraphicBlog
