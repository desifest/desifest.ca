import { NavLink } from 'react-router-dom'
import insta from '../../Assets/COMMON/insta.svg'
import facebook from '../../Assets/COMMON/facebook.svg'
import youtube from '../../Assets/COMMON/youtube.svg'
import tiktok from '../../Assets/COMMON/image.png'

const navItems = [
    { label: 'The 2026 Concert', path: '/concerts' },
    { label: 'About', path: '/about' },
    { label: 'Community', path: '/community' },
    { label: 'Booking', path: '/booking' },
    { label: 'Media', path: '/media' },
    { label: 'UMA', path: '/umafoundation' },
]

export default function VerticalNavbar() {
    return (
        <aside
            className="absolute top-0 left-0 z-90 hidden h-24 w-[99999px] origin-top-left bg-[#2C223C] md:flex"
            style={{ transform: 'rotate(-90deg) translateX(-100%)' }}
        >
            <div className="flex h-full w-full flex-row-reverse items-center gap-4 px-8">
                {/* Navigation */}
                <div className="flex flex-row-reverse items-center gap-4">
                    {navItems.map((item) => (
                        <div
                            key={item.label}
                            className="flex shrink-0 items-center justify-center"
                        >
                            {item.external ? (
                                <a
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] dm-sans-400 rounded-full border px-4 py-1.5 text-center tracking-wide transition whitespace-nowrap border-white/40 text-white hover:border-white hover:bg-white/5"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `text-[13px] dm-sans-400 rounded-full border px-4 py-1.5 text-center tracking-wide transition whitespace-nowrap ${
                                            isActive
                                                ? 'border-neon-yellow text-neon-yellow bg-neon-yellow/10'
                                                : 'border-white/40 text-white hover:border-white hover:bg-white/5'
                                        } `
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>

                {/* Social Icons (below nav) */}
                <div className="text-soft-lavender flex flex-row-reverse items-center gap-4 ml-4">
                    <a
                        href="https://www.facebook.com/desiFEST"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rotate-90 opacity-70 transition hover:opacity-100"
                    >
                        <img src={facebook} alt="Facebook" className="h-10" />
                    </a>

                    <a
                        href="https://www.instagram.com/desifestmusic/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rotate-90 opacity-70 transition hover:opacity-100"
                    >
                        <img src={insta} alt="Instagram" className="h-10" />
                    </a>

                    <a
                        href="https://www.youtube.com/@desifestmusic/videos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rotate-90 opacity-70 transition hover:opacity-100"
                    >
                        <img src={youtube} alt="YouTube" className="h-10" />
                    </a>
                    <a
                        href="https://www.tiktok.com/@desifest"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rotate-90 opacity-70 transition hover:opacity-100"
                    >
                        <img src={tiktok} alt="TikTok" className="h-10 rounded-full border-2 border-black p-2 invert" />
                    </a>
                </div>
            </div>
        </aside>
    )
}
