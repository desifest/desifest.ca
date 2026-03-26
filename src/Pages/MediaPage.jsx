import SEO from '@/Components/SEO'
import backgroung1Fallback from '@/Assets/media/BACKGROUND.png'
import ContactForm from '@/Components/Home/ContactForm'
import Animate from '@/Components/Media/animate.jsx'
import Media from '@/Components/Media/Media.jsx'
import Boost from '@/Components/Media/Boost.jsx'
import { useOutletContext } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import YoutubePlaylist from '@/Components/Media/YoutubePlaylist'
import usePageContent from '@/hooks/usePageContent'

const MediaPage = () => {
    const navigate = useNavigate()
    const { scrollRef, scrollY } = useOutletContext()
    const { content } = usePageContent('media')
    const bgImage = content.hero_bg || backgroung1Fallback

    return (
        <>
            <SEO title="Media" description="Explore DESIFEST media coverage, blog posts, press releases, and photo galleries from Canada's largest South Asian music and arts festival." />
            <div className="relative min-h-screen w-full overflow-clip">
                <div className="absolute inset-0 h-120 overflow-hidden">
                    <img
                        src={bgImage}
                        alt="background"
                        className="absolute inset-0 w-full object-top"
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#100422] to-transparent"></div>
                </div>
                <div className="relative md:h-120 w-full overflow-hidden px-6 py-16 mt-10">
                    {/* Background subtle glow */}
                    <div className="relative z-10 mx-auto max-w-6xl text-center">
                        {/* Small Top Text */}
                        <p className="dm-sans-500 mb-4 text-[20px] tracking-[0.3em] text-white uppercase md:text-[20px]">
                            The Story Behind The Stage
                        </p>

                        {/* Main Heading */}
                        <h1 className="text-[64px] font-extrabold tracking-tight md:text-9xl">
                            <span className="special-gothic-one-regular bg-gradient-to-r from-yellow-300 to-lime-400 bg-clip-text text-transparent">
                                MEDIA
                            </span>{' '}
                            <span className="oswald-500 text-lime-400">&</span>{' '}
                            <span className="oswald-500 bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                                PRESS
                            </span>
                        </h1>
                    </div>
                </div>
                <div className="w-full sm:pl-25 my-4">
                    <Animate scrollY={scrollY} scrollRef={scrollRef} />
                </div>
                <div className="oswald-500 flex-col flex items-center justify-center gap-4 sm:flex sm:flex-row">
                    {/* Left Text */}
                    <div className="text-[24px] md:text-[32px] font-medium tracking-wide text-white uppercase oswaldd">
                        Get Our Press Details Here!
                    </div>

                    {/* Button */}
                    <button
                        onClick={() => navigate('/press-kit')}
                        className="bg-neon-yellow hover:bg-lime-300 px-6 py-3 font-medium text-[24px] md:text-[32px] oswaldd text-black uppercase transition-all duration-300"
                    >
                        View Press Kit
                    </button>
                </div>
                <div className="w-full sm:pl-25 mt-20  ">
                    <YoutubePlaylist />
                    <Media />
                    <Boost />
                </div>
                <div className="relative">
                    <div className="absolute inset-0 z-10 h-24 bg-linear-to-b from-[#100422] to-transparent"></div>
                    <ContactForm />
                </div>
            </div>
        </>
    )
}

export default MediaPage
