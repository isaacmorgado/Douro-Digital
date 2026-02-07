"use client";

import Image from "next/image";
import MotionSection from "@/app/_components/animations/MotionSection";
import { clients } from "@/app/_data/clients";
import styles from "./ClientLogos.module.css";

export default function ClientLogos() {
  return (
    <MotionSection className={styles.section}>
      <h4 className={styles.heading}>Trusted by innovative companies</h4>
      <div className={styles.grid}>
        {clients.map((c) => (
          <div key={c.name} className={styles.cell}>
            <Image
              src={c.logo}
              alt={c.name}
              width={120}
              height={48}
              className={styles.logo}
            />
          </div>
        ))}
      </div>
    </MotionSection>
  );
}
