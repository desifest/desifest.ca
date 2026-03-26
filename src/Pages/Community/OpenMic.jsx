import { useOutletContext } from 'react-router-dom'

import SEO from '@/Components/SEO'
import Herosec from '@/Components/OpenMic/Herosec'
import Popularart from '@/Components/OpenMic/Popularart'
import Featuredartist from '@/Components/OpenMic/Featuredartist'
import Customcontact from '@/Components/Layout/Custom/customcontact'
import desktopImageFallback from '@/Assets/openmic/image copy.png'
import mobileImageFallback from '@/Assets/openmic/image copy 2.png'
import bgimgvFallback from '@/Assets/openmic/framew/Frame.png'
import bgimghFallback from '@/Assets/openmic/framew/Framel.png'
import usePageContent from '@/hooks/usePageContent'

const OpenMic = () => {
    const { content } = usePageContent('openmic')
    const desktopImage = content.contact_desktop || desktopImageFallback
    const mobileImage = content.contact_mobile || mobileImageFallback
    const bgimgv = content.frame_bg_v || bgimgvFallback
    const bgimgh = content.frame_bg_h || bgimghFallback
    return (
        <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0136FE]">
            <SEO title="Open Mic" description="DESIFEST Open Mic — a platform for emerging South Asian artists to perform, connect, and grow. Join our open mic nights and showcase your talent." />
            <Herosec />
            <div className="z-20 mx-auto flex h-full w-full flex-col sm:pl-24">
                <div className='w-full h-full relative'>
                    <img src={bgimgh} alt="" className='absolute w-full h-full'/>
                    <img src={bgimgv} alt="" className='absolute w-full h-full'/>
                    <Popularart />
                    <Featuredartist />
                </div>
                <Customcontact desktopImage={desktopImage} mobileImage={mobileImage} />
            </div>
        </section>
    )
}

export default OpenMic
