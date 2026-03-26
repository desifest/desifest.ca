import partner1 from '@/Assets/home/partnersupp/image6.png'

const Presentingsp = ({ pageContent = {} }) => {
    const logo = pageContent.presenting_logo1 || partner1

    return (
        <section className="w-full bg-transparent py-10 md:px-4">
            {/* Title */}
            <div className="mb-10 flex items-center justify-center gap-1 md:mb-16">
                <div className="h-[3px] flex-1 rounded-full bg-white" />

                <h2 className="text-center font-[Oswald] text-[24px] leading-[36px] font-medium whitespace-nowrap text-white uppercase sm:text-5xl sm:leading-[50px] md:leading-[80px]">
                {pageContent.presenting_sponsor_title || 'presenting sponsor'}
                </h2>

                <div className="h-[3px] flex-1 rounded-full bg-white" />
            </div>

            {/* Cards */}
            <div className="mx-auto sm:w-5xl   ">
                <div
                    className="flex items-center justify-center rounded-2xl bg-[#FFFFFF1F] px-6 transition-[border-radius] delay-0 duration-500 sm:py-20 py-10 ease-in-out hover:rounded-[80px] sm:min-h-[140px] sm:rounded-3xl sm:px-10"
                >
                    <img src={logo} alt="Partner Logo" className="max-h-40 object-contain" />
                </div>
            </div>
        </section>
    )
}

export default Presentingsp
