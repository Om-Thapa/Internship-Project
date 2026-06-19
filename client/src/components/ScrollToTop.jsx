import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";

// Pages that should show the reading progress bar
const PROGRESS_PAGES = ["/products/", "/contact", "/my-orders", "/orders/"];

function shouldShowProgress(pathname) {
  return PROGRESS_PAGES.some((p) => pathname.startsWith(p));
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [showBar, setShowBar] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setShowBar(shouldShowProgress(pathname));
  }, [pathname]);

  return (
    <>
      {/* Reading progress bar */}
      {showBar && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 origin-left"
          style={{ scaleX }}
        />
      )}
    </>
  );
}
