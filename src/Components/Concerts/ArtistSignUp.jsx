import React from "react";
import ArtistSignupForm from "./ArtistSignupForm";
import VerticalNavbar from "../Layout/VerticalNavbar";
import bgFallback from "@/Assets/concerts/artistform.png";
import usePageContent from '@/hooks/usePageContent';

const ArtistSignUp = () => {
  const { content } = usePageContent('concerts');
  const bg = content.artist_form_bg || bgFallback;

  return (
    <div className="relative min-h-screen h-full overflow-clip w-full ">
                        <VerticalNavbar />
      <div className=" bg-off-white-lavender md:pl-32  pl-4 sm:py-16  py-18">
      {/* Top row: title + line */}
      <div className=" flex items-center gap-6 w-full mt-6">
        <h1 className="text-3xl md:text-9xl font-medium tracking-normal text-blue-black whitespace-nowrap">
          ARTIST SIGN UP 2026
        </h1>

        <div className="flex-1 md:h-2 h-1 bg-blue-black" />
      </div>

      {/* Subtitle */}
      <p className="mt-4 md:text-2xl uppercase -tracking-normal text-blue-black bg-off-white-lavender">
        Please find here the artists submissions signup for 2026 Desifest
      </p>
      <img src={bg} alt="" className="my-4 w-full" />

      <ArtistSignupForm />
    </div>
    </div>
  );
};

export default ArtistSignUp;
