import SEO from "@/Components/SEO";
import ArtistSignUp from "@/Components/Concerts/ArtistSignUp";
import Hero from "@/Components/Concerts/Hero";
import Volunteer2026 from "@/Components/Concerts/Volunteer2026";
import backgroung1Fallback from "@/Assets/home/background_1.png";
import React from "react";
import FoodFestival from "@/Components/Concerts/FoodFestival";
import ContactForm from "@/Components/Home/ContactForm";
import ArtistLineup from "@/Components/Concerts/ArtistLineup";
import VerticalNavbar from "@/Components/Layout/VerticalNavbar";
import { useOutletContext } from "react-router-dom";
import Video from "@/Components/Concerts/video";
import usePageContent from '@/hooks/usePageContent';
const ConcertPage = () => {
        const { scrollRef, scrollY } = useOutletContext();
        const { content } = usePageContent('concerts');
        const backgroung1 = content.hero_bg || backgroung1Fallback;
        return (
                <div className="relative min-h-screen h-full overflow-clip w-full">
                        <SEO title="The 2026 Concert" description="Join DESIFEST 2026, June 18-20 at Sankofa Square, Toronto. Experience live South Asian music, food, art, and culture at Canada's largest South Asian festival." />
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

                        <div className="z-20 mx-auto px-2 flex flex-col w-full sm:pl-22">
                                <Hero />
                                <Video pageContent={content} />
                                <ArtistLineup scrollY={scrollY} scrollRef={scrollRef} />
                                <FoodFestival  />
                                {/* <ArtistSignUp />
                                <Volunteer2026 /> */}
                                <ContactForm />
                        </div>
                </div>
        );
};

export default ConcertPage;
