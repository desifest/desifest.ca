import React from "react";
import group from "../../Assets/community/circlegroup.svg";
import { useNavigate } from "react-router-dom";
import usePageContent from '@/hooks/usePageContent'

const Hero = () => {
  const navigate = useNavigate();
  const { content } = usePageContent('community')
  return (
    <div className="h-screen relative justify-center items-center flex flex-col gap-5 text-white leading-none">
      <img src={group} className="absolute top-0 right-0 " alt="" />
      <div className="relative z-10 max-w-4xl px-6">
        {/* TITLE */}
        <div className="font-[Oswald] uppercase leading-none flex flex-col items-center">
          <h1 className="font-[Oswald] uppercase leading-none flex flex-col items-center">
            <span className="block font-medium text-[#C8B7F2] text-[48px] md:text-[100px]">
              {content.hero_line1 || 'Our'}
            </span>
            <span className="block font-medium text-neon-yellow text-[72px] md:text-[110px] tracking-wide">
              {content.hero_line2 || 'Community'}
            </span>
          </h1>
          <div className="mt-6 text-sm md:text-[20px] text-white leading-relaxed dm-sans-400 font-medium uppercase flex flex-col items-center">
            <div>{content.hero_subtitle || 'More than a festival. A year-round movement.'}</div>

            <div>{content.hero_subtitle2 || 'But also go through our...'}</div>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6">
            <button onClick={() => navigate('/open-mic')} className="bg-neon-yellow text-black px-8 py-3 font-[Oswald] uppercase tracking-wide text-sm md:text-2xl hover:opacity-90 transition font-medium hover:bg-lime-300">
              {content.open_mic_btn || 'Open Mic'}
            </button>
            
            <button onClick={() => navigate('/sofa-session')} className="border border-neon-yellow hover:bg-midnight-purple text-neon-yellow px-8 py-3 font-[Oswald] uppercase tracking-wide text-sm md:text-2xl font-medium transition">
              {content.sofa_btn || 'Sofa Sessions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
