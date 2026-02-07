"use client";

import MotionSection from "@/app/_components/animations/MotionSection";
import { testimonial } from "@/app/_data/home";
import styles from "./HomeTestimonial.module.css";

export default function HomeTestimonial() {
  return (
    <MotionSection className={styles.section}>
      <div className={styles.quoteIcon}>
        <div className={styles.quarterCircle} />
        <div className={styles.quarterCircle} />
      </div>
      <h3 className={styles.quote}>{testimonial.quote}</h3>
      <div className={styles.author}>
        <div>
          <p className={styles.authorName}>{testimonial.author}</p>
          <p className={styles.authorRole}>{testimonial.role}</p>
        </div>
      </div>
    </MotionSection>
  );
}
