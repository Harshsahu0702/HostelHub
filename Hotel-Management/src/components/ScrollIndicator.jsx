import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * ScrollIndicator Component
 * Sirf animation aur logic, bina kisi extra background ke.
 */
const ScrollIndicator = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // 150px scroll hone ke baad hide ho jayega
      setVisible(window.scrollY < 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          onClick={scrollToNext}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.15 }}
          style={{
            position: "fixed",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            cursor: "pointer",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px"
          }}
        >
          {/* Animated Vertical Line */}
          <div 
            style={{
              position: "relative",
              width: "2px",
              height: "24px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "9999px",
              overflow: "hidden",
              boxShadow: "0 0 8px rgba(255, 255, 255, 0.2)"
            }}
          >
            <motion.div
              animate={{ 
                y: ["-100%", "100%"],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "100%",
                background: "linear-gradient(to bottom, transparent, #fff, transparent)"
              }}
            />
          </div>

          {/* Bouncing Chevron */}
          <motion.div
            animate={{ 
              y: [0, 8, 0],
              filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 4px #fff)", "drop-shadow(0 0 0px #fff)"]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <ChevronDown color="white" size={24} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;