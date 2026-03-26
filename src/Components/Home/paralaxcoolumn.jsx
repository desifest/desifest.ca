import { useEffect, useRef } from "react";

const ParallaxColumns = ({ scrollY, pageContent = {} }) => {
        const columns = [
                { height: 600, speed: 0.26, text: pageContent.stat1_value || "150K+", text2: pageContent.stat1_label || "ANNUAL ATTENDEES" },
                { height: 600, speed: 0.21, text: pageContent.stat2_value || "1200+", text2: pageContent.stat2_label || "COMMUNITY ARTISTS" },
                { height: 600, speed: 0.16, text: pageContent.stat3_value || "3M", text2: pageContent.stat3_label || "FUNDING GENERATED" },
                { height: 600, speed: 0.23, text: pageContent.stat4_value || "1000HR+", text2: pageContent.stat4_label || "CONTENT" },
        ];
        const refs = useRef([]);

        useEffect(() => {
                const y = scrollY ?? 0;

                refs.current.forEach((el, i) => {
                        if (!el) return;

                        const startOffset = columns[i].height;
                        const translate = startOffset - y * columns[i].speed;

                        el.style.transform = `translateY(${translate}px)`;
                });
        }, [scrollY]); // 👈 react to parent scroll

        return (
                <div className="relative w-full h-full ">
                        <div className="absolute bottom-0 left-0 flex items-end w-full">
                                {columns.map((col, i) => (
                                        <div
                                                key={i}
                                                ref={(el) => (refs.current[i] = el)}
                                                className="flex-1 w-1/4 will-change-transform"
                                                style={{
                                                        height: col.height,
                                                        background: "#453361",
                                                }}
                                        >
                                                <div className="h-full flex flex-col justify-start pt-4 items-center">
                                                        <h2 className="text-white text-3xl md:text-5xl lg:text-7xl font-bold oswaldd">
                                                                {col.text}
                                                        </h2>
                                                        <p className="text-white text-sm md:text-xl lg:text-3xl mt-2 dm-sans-400">
                                                                {col.text2}
                                                        </p>
                                                </div>
                                        </div>
                                ))}
                        </div>
                </div>
        );
};

export default ParallaxColumns;
