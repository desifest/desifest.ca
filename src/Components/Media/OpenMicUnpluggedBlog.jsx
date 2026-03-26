/* eslint-disable no-unused-vars */
import blog2 from '@/Assets/home/Media/image2.png'
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import { CalendarDays, Clock3, MapPin } from 'lucide-react'

const OpenMicUnpluggedBlog = () => {
    const socialLinks = [
        { name: 'Twitter', href: '#', icon: FaTwitter },
        { name: 'Facebook', href: '#', icon: FaFacebookF },
        { name: 'LinkedIn', href: '#', icon: FaLinkedinIn },
    ]

    return (
        <main className="relative min-h-screen w-full bg-[#100422] mt-4 px-6 py-16 text-white md:px-12 md:py-20 lg:px-20">

            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#453361] blur-3xl" />
            </div>

            <article className="relative mx-auto w-full max-w-5xl">

                {/* HERO IMAGE */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                        src={blog2}
                        alt="Open Mic Unplugged"
                        className="h-[350px] w-full object-cover md:h-[450px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100422] via-[#100422]/40 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-sm uppercase tracking-widest text-neon-yellow">
                            FOR IMMEDIATE RELEASE
                        </p>
                        <h1 className="oswald-500 mt-3 text-3xl leading-tight md:text-5xl">
                            Open Mic Unplugged Brings South Asian Music Back to Gerrard Street
                        </h1>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#d6cfea] md:text-base">
                    <span>May 17, 2025</span>
                    <span className="text-neon-yellow">|</span>
                    <span>by Sathish Bala</span>
                    <span className="text-neon-yellow">|</span>
                    <span>MUSIC</span>
                </div>

                <div className="mt-6 h-[2px] w-full bg-white/20" />

                {/* CONTENT */}
                <div className="dm-sans-400 mt-10 space-y-8 text-base leading-8 text-[#f5f1fb] md:text-lg">

                    {/* Event Info Card */}
                    <div className="space-y-5 rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">
                        <h2 className="oswald-500 text-2xl uppercase text-neon-yellow">
                            Event Details
                        </h2>

                        <div className="space-y-4 text-[#efe7ff]">
                            <div className="flex items-start gap-3 italic">
                                <MapPin className="mt-1 h-5 w-5 text-neon-yellow" />
                                <span>Lahore Tikka House, Gerrard Street East, Toronto</span>
                            </div>

                            <div className="flex items-start gap-3 italic">
                                <CalendarDays className="mt-1 h-5 w-5 text-neon-yellow" />
                                <span>Saturday, May 31, 2025</span>
                            </div>

                            <div className="flex items-start gap-3 italic">
                                <Clock3 className="mt-1 h-5 w-5 text-neon-yellow" />
                                <span>7:00 PM – 10:00 PM</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-xl font-medium text-white">
                        As part of South Asian Heritage Month, DESIFEST launches a new acoustic concert series rooted in storytelling, culture, and community.
                    </p>

                    <p>
                        This inaugural edition takes place at one of Toronto’s most iconic venues —
                        <span className="font-semibold text-white"> Lahore Tikka House</span>.
                        More than a restaurant, it stands as a cultural landmark in Little India,
                        symbolizing resilience and belonging.
                    </p>

                    <blockquote className="rounded-xl border-l-4 border-neon-yellow bg-white/[0.03] px-6 py-5 text-white">
                        <span className="font-semibold">
                            "This isn’t just about a show — it’s about honouring our roots,
                            elevating emerging voices, and making sure culture lives in our
                            neighborhoods."
                        </span>{' '}
                        — Sathish Bala
                    </blockquote>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        The Experience
                    </h2>

                    <p>
                        Curated by Dee Devan and hosted by SatsB, Open Mic Unplugged
                        features Bollywood ballads, Tamil acoustic sets, Indie Fusion,
                        R&B, and spoken word — spotlighting artists who have grown
                        through DESIFEST’s open mic ecosystem.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        Food & Atmosphere
                    </h2>

                    <p>Lahore Tikka House will serve a special curated menu including:</p>

                    <ul className="list-disc space-y-2 pl-6 marker:text-neon-yellow">
                        <li>Chicken & Paneer Tikka</li>
                        <li>Fresh naan & Tandoori platters</li>
                        <li>Samosas, Pakoras & Street-style snacks</li>
                        <li>Mango lassi, Chai & Classic desserts</li>
                    </ul>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        Tickets
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-white/20 bg-white/[0.04] p-4 text-center">
                            <p className="text-sm uppercase text-[#d6cfea]">Early Bird</p>
                            <p className="mt-2 text-2xl font-bold">$20</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/[0.06] p-4 text-center">
                            <p className="text-sm uppercase text-[#d6cfea]">General</p>
                            <p className="mt-2 text-2xl font-bold">$25</p>
                        </div>

                        <div className="rounded-xl border border-white/20 bg-white/[0.04] p-4 text-center">
                            <p className="text-sm uppercase text-[#d6cfea]">At the Door</p>
                            <p className="mt-2 text-2xl font-bold">$35</p>
                        </div>
                    </div>

                    <p className="italic text-[#d6cfea]">
                        Limited seating available — reserve early to guarantee your spot.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        About Gerrard India Bazaar
                    </h2>

                    <p>
                        Known as “Little India,” Gerrard India Bazaar remains one of
                        Toronto’s most vibrant cultural corridors — a space where
                        South Asian identity, food, art, and tradition thrive.
                    </p>
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
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/5 transition duration-300 hover:border-neon-yellow hover:text-neon-yellow"
                        >
                            <Icon className="text-base" />
                        </a>
                    ))}
                </div>

            </article>
        </main>
    )
}

export default OpenMicUnpluggedBlog
