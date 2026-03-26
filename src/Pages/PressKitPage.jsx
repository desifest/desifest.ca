import SEO from '@/Components/SEO'
import TestimonialCarousel from '@/Components/About/Testimonial'
import MissionStatement from '@/Components/Media/MissionStatement'
import OfficialLogos from '@/Components/Media/OfficialLogos'
import PeopleOfContact from '@/Components/Media/PeopleOfContact'
import PopularCaseStudies from '@/Components/Media/PopularCaseStudies'
import backgroung1Fallback from '@/Assets/media/BACKGROUND.png'
import PressKitLp from '@/Components/Media/PressKitLp'
import { useOutletContext } from 'react-router-dom'
import Video from '@/Components/Concerts/video'
import ContactForm from '@/Components/Home/ContactForm'
import usePageContent from '@/hooks/usePageContent'

const PressKitPage = () => {
    const { scrollRef, scrollY } = useOutletContext()
    const { content } = usePageContent('press-kit')
    const bgImage = content.hero_bg || backgroung1Fallback

    return (
        <div className="relative">
            <SEO title="Press Kit" description="Access the DESIFEST press kit with official logos, mission statement, case studies, and media contacts for Canada's largest South Asian music festival." />
            <div className="absolute inset-0 h-120 overflow-hidden">
                <img
                    src={bgImage}
                    alt="background"
                    className="absolute inset-0 w-full object-top"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#100422] to-transparent"></div>
            </div>
            <div className="relative mt-10 w-full overflow-hidden px-6 py-16 md:h-120">
                <div className="relative z-10 mx-auto max-w-6xl text-center">
                    {/* Top Small Heading */}
                    <p className="oswald-500 mb-4 text-[24px] text-neon-yellow uppercase sm:text-7xl">
                        {content.hero_top_heading || '2026 DESIFEST'}
                    </p>

                    {/* Main Heading */}
                    <h1 className="text-[64px] special-gothic-one-regular font-extrabold tracking-tight text-[#C6B7DD] md:text-9xl">
                        {content.hero_title || 'MEDIA KIT'}
                    </h1>

                    {/* Subtext */}
                    <p className="dm-sans-400 mt-12 text-[18px] tracking-[0.15em] text-white uppercase md:text-[20px]">
                        {content.hero_subtext || 'Download the full 2026 media kit'}
                    </p>

                    {/* Button */}
                    <div className="mt-8">
                        <button className="bg-neon-yellow p-4  text-2xl font-bold tracking-wider oswald-500 text-black uppercase ">
                            {content.download_btn || 'Download Kit'}
                        </button>
                    </div>
                </div>
            </div>
            <Video pageContent={content} />

            <MissionStatement />
            
            <OfficialLogos />
            <TestimonialCarousel />
            <ContactForm />
        </div>
    )
}
export default PressKitPage
