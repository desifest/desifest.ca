import SEO from '@/Components/SEO'
import Customcontact from '@/Components/Layout/Custom/customcontact'
import desktopImageFallback from '@/Assets/artist/image.png'
import mobileImageFallback from '@/Assets/artist/image copy 2.png'
import ArtHero from '@/Components/Artist/ArtHero'
import SouthAsianCharts from '@/Components/Artist/SouthAsianCharts'
import FeaturedArt from '@/Components/Artist/FeaturedArt'
import Communityart from '@/Components/Artist/Communityart'
import usePageContent from '@/hooks/usePageContent'

const OurArtists = () => {
    const { content } = usePageContent('artists')
    const desktopImage = content.contact_desktop || desktopImageFallback
    const mobileImage = content.contact_mobile || mobileImageFallback
    return (
        <section className="relative flex w-full flex-col items-center justify-center bg-white">
            <SEO title="Our Artists" description="Meet the talented artists performing at DESIFEST 2026. From Bollywood and Bhangra to Hip-Hop and Classical fusion — discover the lineup." />
           <ArtHero />
            <div className="relative mx-auto flex w-full flex-col sm:pl-24">
              <FeaturedArt />
              <Communityart />
              <SouthAsianCharts />
                <Customcontact desktopImage={desktopImage} mobileImage={mobileImage} textcolour={"#100422"} />
            </div>
        </section>
    )
}

export default OurArtists
