"use client";

import { motion } from "framer-motion";
import { heroHeadline } from "@/app/_data/home";
import styles from "./Hero.module.css";

import type { Variants } from "framer-motion";

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const mediaVariants: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.3 },
  },
};

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.headingWrap}>
        <motion.h1
          className={styles.heading}
          initial="hidden"
          animate="visible"
          variants={headingVariants}
        >
          {heroHeadline.line1}{" "}
          <span className={styles.italic}>{heroHeadline.italic}</span>
          <br />
          {heroHeadline.line2}
        </motion.h1>
      </div>
      <motion.div
        className={styles.media}
        initial="hidden"
        animate="visible"
        variants={mediaVariants}
      >
        <div
          className={styles.mediaImage}
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #2a2a4e 50%, #111 100%)",
          }}
        />
      </motion.div>
    </section>
  );
}
