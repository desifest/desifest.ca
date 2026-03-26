import arrow from '../../Assets/media/yellowarrow.svg'

const EventCard = ({ image, title, date, description, readMoreLink }) => {
    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#2A1B3D] p-3 text-white shadow-lg">
            
            <div className="relative h-48 flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="flex flex-1 flex-col p-5 space-y-3">
                
                <h3 className="dm-sans-500 text-xl sm:text-[28px] leading-snug">
                    {title}
                </h3>

                <p className="dm-sans-400 sm:text-[16px] font-medium text-[#8D8D8D]">
                    {date}
                </p>

                <p className="dm-sans-300 flex-1 tracking-wide text-[16px] text-white">
                    {description && description.length > 200
                        ? description.slice(0, 200) + "..."
                        : description}
                </p>

                <div className="flex items-center gap-2 pt-2">
                    <a
                        href={readMoreLink}
                        className="oswaldd text-neon-yellow flex gap-2 text-[24px] underline transition-all hover:gap-3"
                    >
                        Read More
                    </a>
                    <img src={arrow} alt="arrow" />
                </div>
            </div>
        </div>
    )
}

export default EventCard
