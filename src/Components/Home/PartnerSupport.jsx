import partner1 from '@/Assets/home/partnersupp/image.png'
import partner2 from '@/Assets/home/partnersupp/image copy.png'
import partner5 from '@/Assets/home/partnersupp/image copy 2.png'
import partner3 from '@/Assets/home/partnersupp/image copy 4.png'
import partner6 from '@/Assets/home/partnersupp/image copy 5.png'

const fallbacks = [partner1, partner2, partner3, partner5, partner6]

const PartnerSupport = ({ pageContent = {} }) => {
    const partners = [
        pageContent.partner_logo1 || fallbacks[0],
        pageContent.partner_logo2 || fallbacks[1],
        pageContent.partner_logo3 || fallbacks[2],
        pageContent.partner_logo4 || fallbacks[3],
        pageContent.partner_logo5 || fallbacks[4],
    ]

    return (
        <section className="w-full bg-transparent py-20 md:px-4">
            {/* Title */}
            <div className="mb-10 flex items-center justify-center gap-1 md:mb-16">
                <div className="h-[3px] flex-1 rounded-full bg-white" />

                <h2 className="text-center font-[Oswald] text-[24px] leading-[36px] font-medium whitespace-nowrap text-white uppercase sm:text-5xl sm:leading-[50px] md:leading-[80px]">
                    {pageContent.partner_support_title || 'Partners & Sponsors'}
                </h2>

                <div className="h-[3px] flex-1 rounded-full bg-white" />
            </div>

            {/* MOBILE LAYOUT */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
                {partners.map((logo, index) => (
                    <div
                        key={index}
                        className={`flex min-h-[110px] items-center justify-center rounded-2xl bg-[#FFFFFF1F] px-6 py-10 transition-all duration-500 hover:rounded-[60px] ${index === 0 ? 'col-span-2' : 'col-span-1'} `}
                    >
                        <img src={logo} alt="Partner Logo" className="max-h-20 object-contain" />
                    </div>
                ))}
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden gap-6 md:grid md:grid-cols-6 lg:gap-10">
                {partners.map((logo, index) => (
                    <div
                        key={index}
                        className={`flex min-h-[140px] items-center justify-center rounded-3xl bg-[#FFFFFF1F] px-10 py-16 transition-all duration-500 hover:rounded-[80px] ${index < 2 ? 'col-span-3' : 'col-span-2'} `}
                    >
                        <img src={logo} alt="Partner Logo" className="max-h-20 object-contain" />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PartnerSupport
