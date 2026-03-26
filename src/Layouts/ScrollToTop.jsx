import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = ({ scrollRef }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!scrollRef?.current) return;

    // Wait for layout & images
    requestAnimationFrame(() => {
      scrollRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }, [pathname, scrollRef]);

  return null;
};

export default ScrollToTop;
