import { Link } from 'react-router-dom'
import arrow from '@/Assets/home/Community/ARROW.png'

const CommunityCard = ({ image, title, description, link }) => {
    const Wrapper = link ? Link : 'div'
    const wrapperProps = link ? { to: link } : {}

    return (
        <>
            {/* DESKTOP CARD */}
            <Wrapper {...wrapperProps} className="hidden md:block">
                <div className="group relative w-full max-w-[4000px] cursor-pointer bg-midnight-purple p-4 transition-all duration-500 ease-out md:h-115 md:w-[400px] md:origin-top md:p-6 md:hover:scale-[1.3] md:hover:bg-[#3A2B51]">
                    {/* Image */}
                    <div className="relative   border-4 border-white">
                        <img src={image} alt={title} className=" h-60 w-full object-cover " />
                    </div>

                    {/* Content */}
                    <div className="mt-6 text-white">
                        <h3 className="dm-sans-400 text-4xl leading-tight uppercase">{title}</h3>

                        {description && (
                            <p className="mt-4 w-50 translate-y-2 text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="absolute right-6 bottom-0 transition-all duration-300 group-hover:translate-x-3">
                        <img
                            src={arrow}
                            alt=""
                            className="mb-6 h-16 rotate-45 transition-all duration-300 ease-out group-hover:rotate-0"
                        />
                    </div>
                </div>
            </Wrapper>
            {/* MOBILE CARD */}
            <Wrapper {...wrapperProps} className="w-full md:hidden">
                <div className="relative flex h-45 items-start gap-2 border bg-midnight-purple p-4">
                    {/* Image */}
                    <div className=" w-1/2 h-full overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className=" h-full object-cover "
                        />
                    </div>

                    {/* Content */}
                    <div className="h-full flex-1 text-white">
                        <h3 className="dm-sans-400 text-3xl leading-tight uppercase">{title}</h3>
                        <div className="flex w-full justify-end transition-all duration-300 group-hover:translate-x-3">
                            <img
                                src={arrow}
                                alt=""
                                className="h-10 rotate-45 transition-all duration-300 ease-out group-hover:rotate-0"
                            />
                        </div>
                    </div>

                    {/* Arrow */}
                </div>
            </Wrapper>
        </>
    )
}

export default CommunityCard
