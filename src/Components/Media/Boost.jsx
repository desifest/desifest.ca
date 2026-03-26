import BoostCard from './boostcard'
import blog456 from '@/Assets/media/BWBG.png'
import image1Fallback from '@/Assets/media/Boost/image1.png'
import image2Fallback from '@/Assets/media/Boost/image2.png'
import image3Fallback from '@/Assets/media/Boost/image3.png'
import image4Fallback from '@/Assets/media/Boost/image4.png'
import usePageContent from '@/hooks/usePageContent'

const Boost = () => {
    const { content } = usePageContent('media')

    const boostData = [
        {
            image: content.boost_img1 || image1Fallback,
            title: 'Digital',
            description:
                'We use paid media across Facebook, YouTube, Instagram, TikTok, and display advertising to reach and attract our fans.',
        },
        {
            image: content.boost_img2 || image2Fallback,
            title: 'Artists',
            description:
                'Our combined social media reach has increased drastically, growing at a year-over-year pace of nearly 47% from 2022.',
        },
        {
            image: content.boost_img3 || image3Fallback,
            title: 'Traditional',
            description:
                'The PR team works to get coverage in mainstream media in conjunction with TV partners and local newspapers and radio.',
        },
        {
            image: content.boost_img4 || image4Fallback,
            title: 'Influencers',
            description:
                'There is a growing influencer roster at DESIFEST, and their collective reach exceeds 1 billion followers.',
        },
    ]

    return (
        <>
            <div className="oswald-500 mb-10 px-4 flex w-full items-center gap-3 text-4xl text-white uppercase sm:gap-4 sm:text-5xl mt-16">
                <span className="whitespace-nowrap">Boost Outreach</span>
                <div className="h-[2px] flex-1 rounded-full bg-white sm:h-[3px]" />
            </div>

            <div className="grid grid-cols-2 px-3 md:gap-6 gap-1 sm:grid-cols-4">
                {boostData.map((item, index) => (
                    <BoostCard key={index} {...item} />
                ))}
            </div>
        </>
    )
}

export default Boost
