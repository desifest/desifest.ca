import SEO from '@/Components/SEO'
import VerticalNavbar from '@/Components/Layout/VerticalNavbar'
import backgroung1Fallback from '@/Assets/community/image.png'
import Hero from '@/Components/Community/Hero'
import ContactForm from '@/Components/Home/ContactForm'
import YearRoundProgram from '@/Components/Community/YearRoundProgram'
import bgimg from '@/Assets/about/background.png'
import usePageContent from '@/hooks/usePageContent'

const CommunityPage = () => {
    const { content } = usePageContent('community')
    const backgroung1 = content.hero_bg || backgroung1Fallback
    return (
        <div className="relative h-full min-h-screen w-full overflow-clip">
            <SEO title="Community" description="Discover DESIFEST community programs including Open Mic, Sofa Sessions, and year-round cultural initiatives celebrating South Asian arts in Toronto." />
            {/* BACKGROUND */}
            <div className="absolute inset-0 h-220">
                <img
                    src={backgroung1}
                    alt="background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>

            <div className="z-20 mx-auto flex w-full flex-col items-center px-2">
                <div className="w-full sm:pl-22">
                    <Hero />
                    <YearRoundProgram />
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
                                            Canada’s #1 South Asian music festival · Toronto’s
                                            iconic Sankofa Square ·
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
                                            Toronto’s iconic Sankofa Square · Canada’s #1 South
                                            Asian music festival ·
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <img src={bgimg} alt="" className="my-12 w-full" />

                    <ContactForm />
                </div>
            </div>
        </div>
    )
}

export default CommunityPage
