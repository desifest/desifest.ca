import React from "react";
import rowoneone from "../../Assets/about/rowoneone.svg"
import rowonetwo from "../../Assets/about/rowonetwo.svg"
import rowtwoone from "../../Assets/about/rowtwoone.svg"
import rowtwotwo from "../../Assets/about/rowtwotwo.svg"
import rowtwothree from "../../Assets/about/rowtwothree.svg"
import rowtwofour from "../../Assets/about/rowtwofour.svg"
import rowthreeone from "../../Assets/about/rowthreeone.svg"
import rowthreetwo from "../../Assets/about/rowthreetwo.svg"
import rowthreethree from "../../Assets/about/rowthreethree.svg"
import rowthreefour from "../../Assets/about/rowthreefour.svg"


const OurTeam = () => {
    const row1Images = [
rowoneone,rowonetwo
];

const row2Images = [
  rowtwoone,rowtwotwo,rowtwothree,rowtwofour
];

const row3Images = [
 rowthreeone,rowthreetwo,rowthreethree,rowthreefour
];

  return (
    <div className="pb-10 px-5 flex flex-col justify-center items-center gap-5">
      <div className="flex gap-5 font-[OSWALD]">
        <div className="text-soft-lavender text-[80px] md:text-[100px] font-medium">Our</div>
        <div className="text-neon-yellow text-[80px] md:text-[100px] font-medium">Team</div>
      </div>
      <div className="flex flex-col gap-10">
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          {row1Images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="rounded-2xl w-full object-cover"
            />
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {row2Images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="rounded-2xl w-full object-cover"
            />
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {row3Images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="rounded-2xl w-full object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
