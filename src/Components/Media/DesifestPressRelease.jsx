/* eslint-disable no-unused-vars */
import { FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa'
import blog1 from '@/Assets/home/Media/image1.png'

const DesifestPressRelease = () => {
    const socialLinks = [
        {
            name: 'Twitter',
            href: 'https://x.com/intent/post?text=DESIFEST%202025%20Returns%20to%20Sankofa%20Square&url=https%3A%2F%2Fdesifest.ca%2Fdesifest-2025%2F',
            icon: FaTwitter,
        },
        {
            name: 'Facebook',
            href: 'https://www.facebook.com/sharer/sharer.php?u=https://desifest.ca/desifest-2025/',
            icon: FaFacebookF,
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/feed/?shareActive=true&shareUrl=https%3A%2F%2Fdesifest.ca%2Fdesifest-2025%2F',
            icon: FaLinkedinIn,
        },
    ]

    return (
        <main className="relative mt-5 min-h-screen w-full bg-[#100422] px-6 py-16 text-white md:px-12 md:py-20 lg:px-20">
            
            {/* Soft Glow Background */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#453361] blur-3xl" />
            </div>

            <article className="relative mx-auto w-full max-w-5xl">

                {/* HERO IMAGE */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                    <img
                        src={blog1}
                        alt="DESIFEST 2025"
                        className="h-[350px] w-full object-cover md:h-[450px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100422] via-[#100422]/40 to-transparent" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-sm uppercase tracking-widest text-neon-yellow">
                            FOR IMMEDIATE RELEASE
                        </p>
                        <h1 className="oswald-500 mt-3 text-3xl leading-tight md:text-5xl">
                            DESIFEST 2025 Returns to Sankofa Square with Bold “We Are Canadian” Vision
                        </h1>
                    </div>
                </div>

                {/* Meta Info */}
                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-[#d6cfea] md:text-base">
                    <span>May 2025</span>
                    <span className="text-neon-yellow">|</span>
                    <span>Toronto, ON</span>
                    <span className="text-neon-yellow">|</span>
                    <span>Press Release</span>
                </div>

                <div className="mt-6 h-[2px] w-full bg-white/20" />

                {/* CONTENT */}
                <div className="dm-sans-400 mt-10 space-y-8 text-base leading-8 text-[#f5f1fb] md:text-lg">

                    <p className="text-xl font-medium text-white">
                        Canada’s largest South Asian music festival returns for its 19th year — stronger, louder, and more proudly Canadian than ever.
                    </p>

                    <p>
                        DESIFEST returns to Sankofa Square on Saturday, June 14, 2025, continuing its mission of empowering homegrown South Asian artists and reshaping Canada’s cultural narrative. After its historic all-Canadian lineup in 2024, this year’s edition doubles down on investing in local talent.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        A National Cultural Moment
                    </h2>

                    <p>
                        Presented by TD Bank Group, the festival runs from 11 AM to 11 PM under the powerful theme “We Are Canadian.” In a milestone year where South Asian music earned formal recognition at the JUNO Awards, DESIFEST continues to lead — not just reflecting representation, but actively building the platform.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        19 Years of Impact
                    </h2>

                    <p>
                        Since 2006, DESIFEST has supported over 1,000 artists, invested more than $3 million into cultural development, and hosted over 60,000 attendees annually. In 2024 alone, the festival reached over 45 million people digitally.
                    </p>

                    <h2 className="oswald-500 mt-10 text-2xl uppercase text-neon-yellow">
                        More Than Music
                    </h2>

                    <p>
                        With curated stages spanning Bollywood, Punjabi, Bangla, Carnatic Fusion, Hip Hop, and R&B, DESIFEST is more than a music festival — it’s a movement. The event features 20+ food vendors, interactive exhibits, kids’ zones, and inclusive spaces for all ages.
                    </p>

                    {/* MEDIA CONTACT CARD */}
                    <div className="mt-14 rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                        <h3 className="oswald-500 mb-4 text-xl uppercase text-neon-yellow">
                            Media Contact
                        </h3>
                        <p className="text-white">
                            <strong>Sathish Bala</strong><br />
                            Founder & CEO, DESIFEST<br />
                            sbala@desifest.ca<br />
                            416-302-9321<br />
                            www.desifest.ca<br />
                            Sankofa Square, Toronto
                        </p>
                    </div>
                </div>

                {/* SOCIAL SHARE */}
                <div className="mt-12 flex items-center gap-4">
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

export default DesifestPressRelease
