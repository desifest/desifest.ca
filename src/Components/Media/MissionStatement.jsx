import React from 'react'
import usePageContent from '@/hooks/usePageContent'

export default function MissionSection() {
    const { content } = usePageContent('media')
    return (
        <section className="w-full px-4 py-20 text-white">
            <div className="mx-auto max-w-6xl text-center">
                {/* MISSION LABEL */}
                <p className="mb-6 text-[18px] tracking-wide uppercase">{content.mission_label || 'Mission Statement'}</p>

                {/* HEADING */}
                <h2 className="oswaldd mb-6 text-5xl leading-tight md:text-[80px]">
                    {/* Mobile layout */}
                    <span className="block md:hidden">
                        Where South
                        <br />
                        <span className="text-light-lavender">Asian</span> Artists
                        <br />
                        Meet the <span className="text-light-lavender">World</span>
                    </span>

                    {/* Desktop layout */}
                    <span className="hidden md:block">
                        Where <span className="text-light-lavender">South Asian</span>
                        <br />
                        Artists Meet the <span className="text-light-lavender">World</span>
                    </span>
                </h2>

                {/* DESCRIPTION */}
                <p className="dm-sans-400 mx-auto mb-16 max-w-3xl text-[18px] text-gray-300 md:text-base">
                    {content.mission_description || 'To become the leading global platform for South Asian Arts & Culture. We aim to connect artists, creators and audiences from the diverse South Asian diaspora, fostering a profound sense of belonging and mutual appreciation.'}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
                    <div className="flex flex-col items-start border-l-2 border-white pl-4 text-left">
                        <div className="dm-sans-400 text-[24px] text-white">{content.mission_stat1_label || 'FACEBOOK FANS'}</div>
                        <div className="text-neon-yellow special-gothic-one-regular text-[48px] leading-none">
                            {content.mission_stat1_value || '13K+'}
                        </div>
                    </div>

                    <div className="flex flex-col items-start border-l-2 border-white pl-4 text-left">
                        <div className="dm-sans-400 text-[24px] text-white">{content.mission_stat2_label || 'INSTAGRAM FANS'}</div>
                        <div className="text-neon-yellow special-gothic-one-regular text-[48px] leading-none">
                            {content.mission_stat2_value || '28K+'}
                        </div>
                    </div>

                    <div className="flex flex-col items-start border-l-2 border-white pl-4 text-left">
                        <div className="dm-sans-400 text-[24px] text-white">{content.mission_stat3_label || 'TOTAL IMPRESSIONS'}</div>
                        <div className="text-neon-yellow special-gothic-one-regular text-[48px] leading-none">
                            {content.mission_stat3_value || '45M+'}
                        </div>
                    </div>

                    <div className="flex flex-col items-start border-l-2 border-white pl-4">
                        <div className="dm-sans-400 text-[24px] text-white">
                            {content.mission_stat4_label || 'FESTIVAL ATTENDANCE'}
                        </div>
                        <div className="text-neon-yellow special-gothic-one-regular text-[48px] leading-none">
                            {content.mission_stat4_value || '65K+'}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
