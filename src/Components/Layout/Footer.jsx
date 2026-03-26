import React, { useEffect } from 'react'
// import { useOmnisend } from "react-omnisend";
import OmnisendNewsletter from './OmnisendNewsletter'
import tiktok from '@/Assets/COMMON/image.png'

import logo from '../../Assets/COMMON/logon.png'
import insta from '../../Assets/COMMON/insta.svg'
import facebook from '../../Assets/COMMON/facebook.svg'
import youtube from '../../Assets/COMMON/youtube.svg'
import ontariologo from '../../Assets/COMPANIES/ontariologo.svg'
import mississaugalogo from '../../Assets/COMPANIES/mississaugalogo.svg'
import factorlogo from '../../Assets/COMPANIES/factorlogo.svg'
import ontariowhitelogo from '../../Assets/COMPANIES/ontariowhitelogo.svg'
import ontarioartslogo from '../../Assets/COMPANIES/ontarioartslogo.svg'
import canadalogo from '../../Assets/COMPANIES/canadalogo.svg'
import canadianheritagelogo from '../../Assets/COMPANIES/canadianheritagelogo.svg'
import { Link } from 'react-router-dom'
const Footer = () => {
    const scrollToContact = () => {
        const el = document.getElementById('contact')
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    }
    const socials = [
        {
            name: 'instagram',
            icon: insta,
            href: 'https://www.instagram.com/desifestmusic/',
        },
        {
            name: 'facebook',
            icon: facebook,
            href: 'https://www.facebook.com/desiFEST',
        },
        {
            name: 'youtube',
            icon: youtube,
            href: 'https://www.youtube.com/@desifestmusic/videos',
        },
    ]

    return (
        <footer className="bg-midnight-purple z-50 flex w-full flex-col p-8 text-white md:py-10 md:pl-28">
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <img src={logo} alt="DesiFest" className="h-14" />

                <div className="flex gap-3">
                    {socials.map(({ name, icon, href }) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={name}
                            className="flex items-center justify-center"
                        >
                            <img src={icon} alt={name} />
                        </a>
                    ))}
                    <a
                        href="https://www.tiktok.com/@desifest"
                        className=""
                    >
                        <img
                            src={tiktok}
                            alt="TikTok"
                            className="h-10 rounded-full border-2 border-black p-2 invert"
                        />
                    </a>
                </div>
            </div>

            {/* 🔥 NEWSLETTER SECTION */}
            {/* NEWSLETTER */}
            <div className="flex flex-col gap-6 py-10">
                <OmnisendNewsletter />
            </div>
            {/* 📱 MOBILE NAV LINKS ONLY */}
            <div className="flex flex-col gap-4 py-6 text-sm md:hidden">
                {[
                    { label: 'HOME', path: '/' },
                    { label: 'THE 2026 CONCERT', path: '/concerts' },
                    { label: 'ABOUT', path: '/about' },
                    { label: 'ARTISTS', path: '/artists' },
                    { label: 'COMMUNITY', path: '/community' },
                    { label: 'BOOKING', path: '/booking' },
                    { label: 'MEDIA', path: '/media' },
                    { label: 'SHOP', path: 'https://store.desifest.ca', external: true },
                    { label: 'CONTACT US', action: scrollToContact },
                ].map((item) =>
                    item.external ? (
                        <a
                            key={item.label}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dm-sans-400 text-xl tracking-wide text-white uppercase hover:opacity-80"
                        >
                            {item.label}
                        </a>
                    ) : item.path ? (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="dm-sans-400 text-xl tracking-wide text-white uppercase hover:opacity-80"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <button
                            key={item.label}
                            onClick={item.action}
                            className="dm-sans-400 text-left text-xl tracking-wide text-white uppercase hover:opacity-80"
                        >
                            {item.label}
                        </button>
                    )
                )}
            </div>

            {/* SPONSORS */}
            <div className="flex flex-wrap items-center justify-between py-16">
                {[
                    ontariologo,
                    mississaugalogo,
                    factorlogo,
                    ontariowhitelogo,
                    ontarioartslogo,
                    canadalogo,
                    canadianheritagelogo,
                ].map((logo, index) => (
                    <img key={index} src={logo} alt="Sponsor" className="object-contain py-2" />
                ))}
            </div>

            {/* BOTTOM */}
            <div className="mt-12 flex flex-col justify-between border-t border-[#FEFDFD] pt-6 text-xs opacity-70 md:flex-row">
                <p className="text-[#FEFDFD]">
                    Copyright DESIFEST 2026. All rights reserved to the copyright owner.
                </p>

                <div className="mt-4 flex gap-6 md:mt-0">
                    {[
                        { label: 'Trademark Guidelines', slug: 'trademark-guidelines' },
                        { label: 'Privacy Policy', slug: 'privacy-policy' },
                        { label: 'Copyright Notice', slug: 'copyright-notice' },
                        { label: 'Terms of Use', slug: 'terms-of-use' },
                    ].map((item) => (
                        <Link key={item.slug} to={`/legal/${item.slug}`} className="hover:opacity-100">
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    )
}

export default Footer
