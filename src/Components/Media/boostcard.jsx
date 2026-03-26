import arrow from '@/Assets/home/Community/ARROW.png'

const BoostCard = ({ image, title, description }) => {
    return (
        <div className="group relative flex h-full pb-16 flex-col bg-[#2a1b3f] p-6 transition-all duration-300 hover:bg-[#31204a]">
            
            {image && (
            <div className="mb-6 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full object-cover  transition duration-500 "
                />
            </div>
            )}

            <h3 className="mb-4 text-2xl sm:text-3xl dm-sans-400 text-neon-yellow uppercase">
                {title}
            </h3>

            <p className="text-base sm:text-lg dm-sans-400 leading-relaxed text-gray-300">
                {description}
            </p>

            <div className="absolute right-6 bottom-6 transition-all duration-300 group-hover:translate-x-3">
                <img
                    src={arrow}
                    alt=""
                    className="h-10 rotate-45 transition-all duration-300 ease-out group-hover:rotate-0"
                />
            </div>
        </div>
    )
}

export default BoostCard