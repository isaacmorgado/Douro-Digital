"use client";

import MotionSection from "@/app/_components/animations/MotionSection";
import RotatingText from "./RotatingText";
import styles from "./HomeCTA.module.css";

export default function HomeCTA() {
  return (
    <MotionSection className={styles.section} id="contact">
      <h2 className={styles.heading}>
        Let&apos;s work on <RotatingText />
      </h2>
      <a href="mailto:hello@dourodigital.com" className={styles.emailBtn}>
        <span className={styles.emailIcon}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4l6 4 6-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="1"
              y="3"
              width="14"
              height="10"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </span>
        hello@dourodigital.com
      </a>
    </MotionSection>
  );
}
