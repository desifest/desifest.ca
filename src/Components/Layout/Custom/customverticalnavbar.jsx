import { NavLink } from 'react-router-dom'
import insta from '../../../Assets/COMMON/insta.svg'
import facebook from '../../../Assets/COMMON/facebook.svg'
import youtube from '../../../Assets/COMMON/youtube.svg'
import tiktok from '@/Assets/COMMON/image.png'
const navItems = [
    { label: 'The 2026 Concert', path: '/concerts' },
    { label: 'About', path: '/about' },
    { label: 'Artists', path: '/artists' },
    { label: 'Community', path: '/community' },
    { label: 'Booking', path: '/booking' },
    { label: 'Media', path: '/media' },
    { label: 'UMA', path: '/umafoundation' },
]

export default function VerticalNavbar({ bgColor = '#10042233', textcolour }) {
    const finalColor = textcolour || 'white'

    return (
        <aside
            className="absolute top-0 left-0 z-50 hidden h-24 w-[99999px] origin-top-left md:flex"
            style={{
                transform: 'rotate(-90deg) translateX(-100%)',
                backgroundColor: bgColor,
            }}
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
                                    className="text-[13px] dm-sans-400 rounded-full border px-4 py-1.5 text-center tracking-wide transition whitespace-nowrap"
                                    style={{
                                        color: finalColor,
                                        borderColor: `${finalColor}66`,
                                        backgroundColor: 'transparent',
                                    }}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className="text-[13px] dm-sans-400 rounded-full border px-4 py-1.5 text-center tracking-wide transition whitespace-nowrap"
                                    style={({ isActive }) => ({
                                        color: finalColor,
                                        borderColor: isActive ? finalColor : `${finalColor}66`,
                                        backgroundColor: isActive ? `${finalColor}1A` : 'transparent',
                                    })}
                                >
                                    {item.label}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </div>

                {/* Social Icons */}
                <div className="flex flex-row-reverse items-center gap-4 ml-4">
                    {[facebook, insta, youtube].map((icon, index) => (
                        <a
                            key={index}
                            href="#"
                            className="rotate-90 opacity-70 transition hover:opacity-100"
                        >
                            <img
                                src={icon}
                                alt="social"
                                className="h-10"
                                style={{
                                    filter: textcolour ? 'invert(1)' : 'none',
                                }}
                            />
                        </a>
                    ))}
                    <a
                        href="https://www.tiktok.com/@desifest"
                        className="rotate-90 opacity-70 transition hover:opacity-100"
                    >
                        <img src={tiktok} alt="TikTok" className="h-10 rounded-full border-2 border-black p-2 invert" />
                    </a>
                </div>
            </div>
        </aside>
    )
}
