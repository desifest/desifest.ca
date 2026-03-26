import { Link } from 'react-router-dom'
import CommunityCard from './CommunityCard'

import img1 from '@/Assets/home/Community/image1.png'
import img2 from '@/Assets/home/Community/image2.png'
import img3 from '@/Assets/home/Community/image3.png'

const Community = ({ pageContent = {} }) => {
    const communityImages = [
        pageContent.community_img1 || img1,
        pageContent.community_img2 || img2,
        pageContent.community_img3 || img3,
    ]

    return (
        <section className="w-full bg-transparent  pl-6">
            <div className="w-full">
                <div className="oswald mb-4 flex w-full items-center gap-3 text-3xl text-white uppercase sm:gap-4 sm:text-[64px]">
                    <Link to="/community" className="whitespace-nowrap hover:text-neon-yellow transition-colors">Community</Link>

                    <div className="h-[2px] flex-1 rounded-full bg-white sm:h-[3px]" />
                </div>

                <div className="flex  flex-col items-center justify-center sm:gap-16 gap-8 overflow-x-auto sm:p-4 sm:pl-8 sm:flex-row sm:overflow-visible">
                    <CommunityCard image={communityImages[0]} title={pageContent.community_card1_title || "Year Round Program"} link="/community" />

                    <CommunityCard image={communityImages[1]} title={pageContent.community_card2_title || "Open Mic"} link="/community/open-mic" />

                    <CommunityCard image={communityImages[2]} title={pageContent.community_card3_title || "Sofa Sessions"} link="/community/sofa-sessions" />
                </div>
            </div>
        </section>
    )
}

export default Community
