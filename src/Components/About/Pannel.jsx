import AnimatedCols from "./Animatedcols";

const pannel = ({ scrollY }) => {
  return (
    <div className=" relative  flex flex-col items-start justify-start  py-4  bg-transparent text-black text-center">

        <AnimatedCols scrollY={scrollY} />
    </div>
  );
};

export default pannel;