import React from "react";

import first from "../../Assets/community/first.svg";
import second from "../../Assets/community/second.svg";
import third from "../../Assets/community/third.svg";
import fourth from "../../Assets/community/fourth.svg";
import fifth from "../../Assets/community/fifth.svg";
import group from "../../Assets/community/circlegroup.svg";
import bottombg from "../../Assets/community/bottombg.svg";

const programs = [
  {
    tag: "WHY US",
    title: "MORE THAN A FESTIVAL",
    desc: "DESIFEST is not a one-day event. It is a platform.\n\nFor 20 years, we've built a space where emerging artists meet real industry, where talent is not just showcased but developed. From open mics to mentorship to main stage performances, we create pathways, not moments.\n\nThis is where culture is nurtured, careers are accelerated, and community becomes opportunity.",
    image: first,
  },
  {
    tag: "AUDIENCE BREAKDOWN",
    title: "A REAL MELTING POT OF CULTURES",
    desc: "DESIFEST brings together more than just South Asian audiences. It brings together Toronto.\n\nOur flagship festival at Sankofa Square draws a cross-section of the city \u2014 Gen Z creators, families, newcomers, long-time Torontonians, industry professionals, and culture seekers.\n\nIt is a rare space where multiple generations, languages, and identities share the same stage and the same crowd. Not segmented. Not siloed. Together.",
    image: second,
  },
  {
    tag: "ONE EVENT",
    title: "CELEBRATE OUR DIFFERENCES",
    desc: "DESIFEST is dedicated to supporting new ideas in arts and music. Since 2006, we have distributed over two million dollars to support key roles in the industry, including performance fees, production crews, volunteers, creatives, DJs, dancers, and more.",
    image: third,
  },
  {
    tag: "MONETARY WORTH",
    title: "INVESTING IN MUSIC COMMUNITY",
    desc: "DESIFEST generates economic and cultural return.\n\nWe activate one of Toronto's most diverse audiences, create paid opportunities for artists, and drive measurable engagement for brand partners. Our programming extends beyond festival weekend through workshops, showcases, and community events that sustain momentum year-round.\n\nThis is not sponsorship. It is strategic cultural investment.",
    image: fourth,
  },
  {
    tag: "MAKING AN IMPACT",
    title: "SUPPORT OUR COMMUNITY DREAMS",
    desc: "Every partnership helps scale opportunity.\n\nWe bridge emerging artists with industry leaders, connect brands with high-growth multicultural audiences, and create inclusive spaces that reflect the future of Canada.\n\nTogether, we are not funding a stage.\nWe are building a platform.",
    image: fifth,
  },
];

const YearRoundProgram = () => {
  return (
    <section className="relative py-20">
      <div className=" pl-4">
        {/* Section Title */}
        <div className=" flex items-center relative gap-6 w-full mt-6">
          <div className="text-3xl md:text-7xl font-medium tracking-wide font-[OSWALD] text-white whitespace-nowrap">
            YEAR-ROUND PROGRAM
          </div>

          <div className="flex-1 md:h-2 h-1 bg-white" />
        </div>
        <img src={group} className="absolute top-0 left-0 w-125 h-125" alt="" />

        <div className="space-y-24 mt-20 relative">
          {programs.map((item, index) => {
            const isReverse = index % 2 !== 0;
            const isYellowFirst = index % 2 === 0; // Even index = first word yellow, Odd index = last word yellow
            const titleWords = item.title.split(" ");

            return (
              <div
                key={index}
                className={`flex flex-col ${
                  isReverse ? "lg:flex-row-reverse" : "lg:flex-row"
                } items-center gap-8 lg:gap-12 justify-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                  <div className="rounded-3xl overflow-hidden shadow-lg max-w-sm lg:max-w-xs border-2 rounded-[80px] border-white/30 p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-[80px]"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="text-white max-w-2xl lg:max-w-md flex flex-col">
                  <span className="text-md w-fit p-2 uppercase dm-sans-400 tracking-widest text-neon-yellow bg-[#2C223C] mb-3">
                    {item.tag}
                  </span>
                  <h3 className="text-2xl md:text-5xl lg:text-4xl dm-sans-400  mb-4">
                    {isYellowFirst ? (
                      <>
                        <span className="text-neon-yellow special-gothic-one-regular">
                          {titleWords[0]}
                        </span>{" "}
                        {titleWords.slice(1).join(" ")}
                      </>
                    ) : (
                      <>
                        {titleWords.slice(0, -1).join(" ")}{" "}
                        <span className="text-neon-yellow  special-gothic-one-regular ">
                          {titleWords[titleWords.length - 1]}
                        </span>
                      </>
                    )}
                  </h3>
                  <div className="text-gray-300 dm-sans-400 leading-relaxed space-y-3">
                    {item.desc.split('\n\n').map((para, i) => (
                      <p key={i}>
                        {para.split('\n').map((line, j, arr) => (
                          <React.Fragment key={j}>
                            {line}
                            {j < arr.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <img
        src={bottombg}
        alt="Bottom Background"
        className="absolute top-0 w-full pointer-events-none"
      />
        </div>
      </div>
      
    </section>
  );
};

export default YearRoundProgram;
