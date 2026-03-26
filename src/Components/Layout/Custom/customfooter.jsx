import React from 'react'

import logo from '../../../Assets/COMMON/logon.png'
import logoinvert from '@/Assets/COMMON/logoinvert.png'
import tiktok from '@/Assets/COMMON/image.png'

import insta from '../../../Assets/COMMON/insta.svg'
import facebook from '../../../Assets/COMMON/facebook.svg'
import youtube from '../../../Assets/COMMON/youtube.svg'

import ontariologo from '../../../Assets/COMPANIES/ontariologo.svg'
import ontariologoinvert from '../../../Assets/COMPANIES/ontariologoinvert.svg'

import mississaugalogo from '../../../Assets/COMPANIES/mississaugalogo.svg'
import mississaugalogoinvert from '../../../Assets/COMPANIES/mississaugalogoinvert.svg'

import factorlogo from '../../../Assets/COMPANIES/factorlogo.svg'
import factorlogoinvert from '../../../Assets/COMPANIES/factorlogoinvert.svg'

import ontariowhitelogo from '../../../Assets/COMPANIES/ontariowhitelogo.svg'
import ontariowhitelogoinvert from '../../../Assets/COMPANIES/ontariowhitelogoinvert.svg'

import ontarioartslogo from '../../../Assets/COMPANIES/ontarioartslogo.svg'
import ontarioartslogoinvert from '../../../Assets/COMPANIES/ontarioartslogoinvert.svg'

import canadalogo from '../../../Assets/COMPANIES/canadalogo.svg'
import canadalogoinvert from '../../../Assets/COMPANIES/canadalogoinvert.svg'
import { Link } from 'react-router-dom'
import canadianheritagelogo from '../../../Assets/COMPANIES/canadianheritagelogo.svg'
import canadianheritagelogoinvert from '../../../Assets/COMPANIES/canadianheritagelogoinvert.svg'
import OmnisendNewsletter from '../OmnisendNewsletter'
const Footer = ({ footerColor, textcolour }) => {
    const finalColor = textcolour || 'white'
    const useInvert = !!textcolour

    const socials = [
        { name: 'instagram', icon: insta },
        { name: 'facebook', icon: facebook },
        { name: 'youtube', icon: youtube },
    ]

    const sponsors = [
        { normal: ontariologo, invert: ontariologoinvert },
        { normal: mississaugalogo, invert: mississaugalogoinvert },
        { normal: factorlogo, invert: factorlogoinvert },
        { normal: ontariowhitelogo, invert: ontariowhitelogoinvert },
        { normal: ontarioartslogo, invert: ontarioartslogoinvert },
        { normal: canadalogo, invert: canadalogoinvert },
        { normal: canadianheritagelogo, invert: canadianheritagelogoinvert },
    ]

    return (
        <footer
            className="z-0 flex w-full flex-col p-8 md:py-10 md:pl-28"
            style={{
                backgroundColor: footerColor,
                color: finalColor,
            }}
        >
            {/* TOP */}
            <div className="flex items-center justify-between gap-4">
                <img src={useInvert ? logoinvert : logo} alt="DesiFest" className="h-14" />

                <div className="flex gap-3">
                    {socials.map(({ name, icon }) => (
                        <a key={name} href="#">
                            <img
                                src={icon}
                                alt={name}
                                style={{
                                    filter: useInvert ? 'invert(1)' : 'none',
                                    transition: '0.3s ease',
                                }}
                            />
                        </a>
                    ))}
                    <a
                        href="https://www.tiktok.com/@desifest"
                        className="opacity-80 transition hover:opacity-100"
                    >
                        <img src={tiktok} alt="TikTok" className="h-12 rounded-full border-2 border-black p-2 invert" />
                    </a>
                </div>
            </div>

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
                    { label: 'MEDIA', path: '/media' },
                    { label: 'SHOP', path: 'https://store.desifest.ca', external: true },
                    { label: 'CONTACT US', path: '/' },
                ].map((item) =>
                    item.external ? (
                        <a
                            key={item.label}
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tracking-wide dm-sans-400 text-xl text-white uppercase hover:opacity-80"
                        >
                            {item.label}
                        </a>
                    ) : (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="tracking-wide dm-sans-400 text-xl text-white uppercase hover:opacity-80"
                        >
                            {item.label}
                        </Link>
                    )
                )}
            </div>
            {/* SPONSORS */}
            <div className="flex flex-wrap items-center justify-between py-10">
                {sponsors.map((item, index) => (
                    <img
                        key={index}
                        src={useInvert ? item.invert : item.normal}
                        alt="Sponsor"
                        className="object-contain py-2 "
                    />
                ))}
            </div>

            {/* BOTTOM */}
            <div
                className="mt-12 flex flex-col justify-between pt-6 text-xs text-gray-300 md:flex-row"
                style={{
                    borderTop: `1px solid ${finalColor}`,
                }}
            >
                <p>Copyright DESIFEST 2026. All rights reserved to the copyright owner.</p>

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
