"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ctaTexts } from "@/app/_data/home";

export default function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ctaTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        height: "1.2em",
        verticalAlign: "bottom",
      }}
    >
      {/* Invisible longest text to reserve width */}
      <span style={{ visibility: "hidden", whiteSpace: "nowrap" }}>
        {ctaTexts.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={ctaTexts[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{
            color: "var(--accent)",
            position: "absolute",
            left: 0,
            top: 0,
            whiteSpace: "nowrap",
          }}
        >
          {ctaTexts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
