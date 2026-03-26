import React from 'react'
import usePageContent from '@/hooks/usePageContent'
import ontariologo from '../../Assets/COMPANIES/ontariologo.svg'
import mississaugalogo from '../../Assets/COMPANIES/mississaugalogo.svg'
import factorlogo from '../../Assets/COMPANIES/factorlogo.svg'
import ontariowhitelogo from '../../Assets/COMPANIES/ontariowhitelogo.svg'
import ontarioartslogo from '../../Assets/COMPANIES/ontarioartslogo.svg'
import canadalogo from '../../Assets/COMPANIES/canadalogo.svg'
import canadianheritagelogo from '../../Assets/COMPANIES/canadianheritagelogo.svg'

const logos = [
    ontariologo,
    mississaugalogo,
    factorlogo,
    ontariowhitelogo,
    ontarioartslogo,
    canadalogo,
    canadianheritagelogo,
]

const OfficialLogos = () => {
    const { content } = usePageContent('media')
    return (
        <section className="w-full py-24">
            <div className="mx-auto max-w-7xl px-6">
                <h2 className="oswaldd mb-20 text-center text-3xl tracking-widest text-white md:text-4xl">
                    {content.logos_title || 'OUR OFFICIAL LOGOS'}
                </h2>

                {/* MOBILE LAYOUT */}
                <div className="grid grid-cols-2 gap-x-10 gap-y-16 md:hidden">
                    {logos.map((logo, index) => (
                        <div
                            key={index}
                            className={`flex justify-center ${index >= 4 ? 'col-span-2' : ''}`}
                        >
                            <img
                                src={logo}
                                alt="Official logo"
                                className="h-24 w-auto object-contain opacity-90"
                            />
                        </div>
                    ))}
                </div>

                {/* DESKTOP LAYOUT */}
                <div className="hidden md:block">
                    {/* Top row */}
                    <div className="mb-24 flex items-center justify-between">
                        {logos.slice(0, 4).map((logo, index) => (
                            <img
                                key={index}
                                src={logo}
                                alt="Official logo"
                                className="h-30 w-auto object-contain opacity-90"
                            />
                        ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-center gap-x-24">
                        {logos.slice(4).map((logo, index) => (
                            <img
                                key={index}
                                src={logo}
                                alt="Official logo"
                                className="h-26 w-auto object-contain opacity-90"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default OfficialLogos
