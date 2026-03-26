import SEO from '@/Components/SEO'
import SecondSection from '@/Components/SofaSession/SecondSection'
import bgFallback from '../../Assets/sofa_session/sofasessionbg.png'
import whiteFallback from '../../Assets/sofa_session/whitecircles.png'
import ThirdSection from '@/Components/SofaSession/ThirdSection'
import ImageCarousel from '@/Components/SofaSession/ImageCarousel'
import desktopImageFallback from '@/Assets/sofa_session/sofacontactdesktop.svg'
import mobileImageFallback from '@/Assets/sofa_session/sofacontactmobile.svg'
import SofaContact from '@/Components/SofaSession/SofaContact'
import YoutubePlaylist from '@/Components/Media/YoutubePlaylist'
import usePageContent from '@/hooks/usePageContent'

const SOFA_VIDEOS = [
    'Y02aT2YSD00',
    'aoIZiCU3iyQ',
    'CYXx5Pyb-F8',
    'hssAWMrijLs',
    'k4rrQpqIZ9k',
    'OoGnVPpL0xk',
    'x_BONm1s9QY',
    'ZMfUVmefpXo',
]

const SofaSession = () => {
    const { content, loaded } = usePageContent('sofa-sessions')
    return (
        <div className="relative flex flex-col bg-[#AC48FF]">
            <SEO title="Sofa Session" description="DESIFEST Sofa Sessions — intimate music performances featuring South Asian artists. Experience music up close and personal." />
            <section
                className="flex h-screen w-full items-center bg-cover bg-center pl-4 md:pl-80"
                style={{ backgroundImage: `url(${content.hero_bg || bgFallback})` }}
            >
                <div className="flex flex-col items-start justify-center leading-none">
                    <h1 className="jersey leading-none text-[#D9FF00]">
                        <span className="-mb-4 block text-[112px] md:-mb-10 md:text-[230px]">SOFA</span>
                        <span className="block text-[112px] md:text-[230px]">SESSIONS</span>
                    </h1>

                    <div className="dm-sans-400 text-[20px] leading-none tracking-widest text-white md:text-[32px]">
                        MUSIC, UP CLOSE AND PERSONAL
                    </div>
                </div>
                <img src={content.hero_circles || whiteFallback} className="absolute left-0" alt="" />
            </section>

            <SecondSection pageContent={content} />
            <div className='flex justify-center sm:ml-24'>
            <section className="sm:h-160 sm:w-340 h-70 w-95 ">
                <iframe
                    className="h-full w-full"
                    src={content.youtube_url || "https://www.youtube.com/embed/Y02aT2YSD00?autoplay=1&mute=1&controls=1&rel=0"}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </section>
            </div>
            <div className="w-full sm:pl-25">
                <YoutubePlaylist videos={SOFA_VIDEOS} />
            </div>
            <ThirdSection />
            <ImageCarousel pageContent={content} loaded={loaded} />
            <SofaContact desktopImage={content.contact_desktop || desktopImageFallback} mobileImage={content.contact_mobile || mobileImageFallback} />
        </div>
    )
}

export default SofaSession
