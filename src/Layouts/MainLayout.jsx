import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/Components/Layout/Navbar";
import Footer from "@/Components/Layout/Footer";
import VerticalNavbar from "@/Components/Layout/VerticalNavbar";
import ScrollToTop from "./ScrollToTop";

export default function MainLayout() {
        const scrollRef = useRef(null);
        const [scrollY, setScrollY] = useState(0);

        useEffect(() => {
                const el = scrollRef.current;
                if (!el) return;

                const onScroll = () => setScrollY(el.scrollTop);
                el.addEventListener("scroll", onScroll, { passive: true });
                onScroll();

                return () => el.removeEventListener("scroll", onScroll);
        }, []);

        return (
                <div
                        ref={scrollRef}
                        className="w-full h-screen bg-[#100422] overflow-y-auto overscroll-none scrollbar-hide"
                >
                        <ScrollToTop scrollRef={scrollRef} />

                        <div className="flex min-h-full flex-col">
                                <Navbar />

                                <div className="relative flex-1 w-full overflow-hidden">
                                        <VerticalNavbar />
                                        <main className="w-full">
                                                <Outlet context={{ scrollRef, scrollY }} />
                                        </main>
                                </div>

                                <Footer />
                        </div>
                </div>
        );
}
