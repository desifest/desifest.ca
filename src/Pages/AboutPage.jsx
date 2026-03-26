import { useOutletContext } from "react-router-dom";
import SEO from "@/Components/SEO";

import Hero from "@/Components/About/Hero";
import Jobs from "@/Components/About/Jobs";
import OurTeam from "@/Components/About/OurTeam";
import Testimonial from "@/Components/About/Testimonial";
import ContactForm from "@/Components/Home/ContactForm";
import VerticalNavbar from "@/Components/Layout/VerticalNavbar";
import backgroung1Fallback from "@/Assets/home/background_1.png";
import Pannel from "@/Components/About/Pannel";
import usePageContent from '@/hooks/usePageContent';
const AbooutPage = () => {
  const { scrollRef, scrollY } = useOutletContext();
  const { content } = usePageContent('about');
  const backgroung1 = content.hero_bg || backgroung1Fallback;
        return (
                <div className="relative min-h-screen h-full overflow-clip w-full">
                        <SEO title="About Us" description="Learn about DESIFEST, Canada's largest South Asian music and arts festival. 20 years of celebrating culture, diversity, and community in Toronto." />
                        <div className="absolute inset-0 h-220">
                                <img
                                        src={backgroung1}
                                        alt="background"
                                        className="absolute inset-0 w-full h-full object-cover opacity-[0.16]"
                                />

                                <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                                background: `
              linear-gradient(
                to left,
                rgba(16, 4, 34, 0.8) 0%,
                rgba(16, 4, 34, 0) 55%
              ),
              linear-gradient(
                to top,
                rgba(16, 4, 34, 0.9) 0%,
                rgba(16, 4, 34, 0) 60%
              )
            `,
                                        }}
                                />
                        </div>
                        
                        <div className=" sm:pl-22 ">
                        <Hero />
                        <Pannel scrollY={scrollY} scrollRef={scrollRef}/>
                        <OurTeam />
                        <Testimonial />
                        <Jobs />
                        <ContactForm />
                        </div>
                </div>
        );
};

export default AbooutPage;
