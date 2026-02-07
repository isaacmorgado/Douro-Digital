"use client";

import MotionSection from "@/app/_components/animations/MotionSection";
import { footerDescription, footerContact, footerNav } from "@/app/_data/home";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <MotionSection as="footer" className={styles.footer}>
      <div className={styles.top}>
        <p className={styles.desc}>{footerDescription}</p>
        <div className={styles.columns}>
          <div className={styles.column}>
            <span className={styles.colLabel}>Navigate</span>
            {footerNav.map((l) => (
              <a key={l.href} href={l.href} className={styles.colLink}>
                {l.label}
              </a>
            ))}
          </div>
          <div className={styles.column}>
            <span className={styles.colLabel}>Contact</span>
            <a href={`mailto:${footerContact.email}`} className={styles.colLink}>
              {footerContact.email}
            </a>
            <span className={styles.colLink}>{footerContact.phone}</span>
            <span className={styles.colLink}>{footerContact.address}</span>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className={styles.wordmark}>
        <svg
          className={styles.wordmarkSvg}
          viewBox="0 0 1440 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fill="rgba(255,255,255,0.05)"
            fontSize="200"
            fontWeight="600"
            fontFamily="var(--font-inter), sans-serif"
          >
            DOURO DIGITAL
          </text>
        </svg>
      </div>

      <div className={styles.bottom}>
        <span>&copy; {new Date().getFullYear()} Douro Digital. All rights reserved.</span>
        <span>Porto, Portugal</span>
      </div>
    </MotionSection>
  );
}
