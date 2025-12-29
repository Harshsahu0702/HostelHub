import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero-section-wrapper");
      if (!hero) return;

      setVisible(window.scrollY < hero.offsetHeight * 0.5);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () => {
    const next = document.querySelector(".why-choose-section");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          onClick={scrollDown}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
            zIndex: 10,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <motion.svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
