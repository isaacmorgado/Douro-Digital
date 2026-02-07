"use client";

import MotionSection from "@/app/_components/animations/MotionSection";
import ServiceAccordion from "./ServiceAccordion";
import { missionText } from "@/app/_data/home";
import styles from "./MissionServices.module.css";

export default function MissionServices() {
  return (
    <MotionSection className={styles.section} id="services">
      <div className={styles.left}>
        <p className={styles.sectionLabel}>About us</p>
        <h2 className={styles.mission}>{missionText}</h2>
      </div>
      <div className={styles.right}>
        <p className={styles.sectionLabel}>Services</p>
        <ServiceAccordion />
      </div>
    </MotionSection>
  );
}
