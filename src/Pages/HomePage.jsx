import { useOutletContext } from 'react-router-dom'
import SEO from '@/Components/SEO'
import HeroSection from '@/Components/Home/HeroSection'
import GovernmentSupport from '@/Components/Home/GovernmentSupport'
import PartnerSupport from '@/Components/Home/PartnerSupport'
import ContactForm from '@/Components/Home/ContactForm'
import backgroung1Fallback from '@/Assets/home/background_1.png'
import Animation from '@/Components/Home/Animation'
import Shop from '@/Components/Home/Shop.jsx'
import BlogsAndMedia from '@/Components/Home/BlogandMedia'
import Community from '@/Components/Home/Community'
import VerticalNavbar from '@/Components/Layout/VerticalNavbar'
import Presentingsp from '@/Components/Home/presentingsp'
import usePageContent from '@/hooks/usePageContent'

const HomePage = () => {
    const { scrollRef, scrollY } = useOutletContext()
    const { content } = usePageContent('home')
    const backgroung1 = content.home_background_1 || backgroung1Fallback

    return (
        <div className="relative h-full min-h-screen w-full overflow-clip">
            <SEO />
            <div className="absolute inset-0 h-220">
                <img
                    src={backgroung1}
                    alt="background"
                    className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
                />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
              linear-gradient(
                to left,
                rgba(16, 4, 34, 0.8) 0%,
                rgba(16, 4, 34, 0) 55%
              ),
              linear-gradient(
                to top,
                rgba(16, 4, 34, 0.9) 0%,
                rgba(16, 4, 34, 0) 60%
              )
            `,
                    }}
                />
            </div>

            <div className="z-20 mx-auto flex w-full flex-col items-center px-1">
                <div className="w-full sm:pl-22">
                    <HeroSection pageContent={content} />

                    <Animation scrollY={scrollY} scrollRef={scrollRef} pageContent={content} />

                    <Community pageContent={content} />
                    <GovernmentSupport pageContent={content} />
                    <Presentingsp pageContent={content} />
                    <PartnerSupport pageContent={content} />
                    <div className="krona-one-regular relative w-full py-20">
                        <div className="krona-one-regular relative w-full py-20">
                            <style>
                                {`
@keyframes marquee-ltr {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-rtl {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
`}
                            </style>

                            {/* FRONT RIBBON — LEFT ➜ RIGHT */}
                            <div className="absolute z-10 flex h-12 w-full -rotate-3 items-center overflow-hidden bg-[#C6B7DD]">
                                <div
                                    className="flex w-max"
                                    style={{
                                        animation: 'marquee-ltr 300s linear infinite', // ⬅ slower (35s instead of 18s)
                                    }}
                                >
                                    {[
                                        ...Array.from({ length: 18 }),
                                        ...Array.from({ length: 18 }),
                                    ].map((_, i) => (
                                        <span
                                            key={i}
                                            className="px-6 text-xl whitespace-nowrap text-[#1A102A]"
                                        >
                                            {content.marquee_text1 || "Canada’s #1 South Asian music festival · Toronto’s iconic Sankofa Square ·"}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* BACK RIBBON — RIGHT ➜ LEFT */}
                            <div className="absolute z-0 flex h-12 w-full rotate-3 items-center overflow-hidden bg-[#453361]">
                                <div
                                    className="flex w-max"
                                    style={{
                                        animation: 'marquee-rtl 300s linear infinite',
                                    }}
                                >
                                    {[
                                        ...Array.from({ length: 18 }),
                                        ...Array.from({ length: 18 }),
                                    ].map((_, i) => (
                                        <span
                                            key={i}
                                            className="px-6 text-xl whitespace-nowrap text-white"
                                        >
                                            {content.marquee_text2 || "Toronto’s iconic Sankofa Square · Canada’s #1 South Asian music festival ·"}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <BlogsAndMedia scrollY={scrollY} scrollRef={scrollRef} pageContent={content} />
                    {content.shop_visible === 'true' && <Shop pageContent={content} />}
                    <ContactForm pageContent={content} />
                </div>
            </div>
        </div>
    )
}

export default HomePage
