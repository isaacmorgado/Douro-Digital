"use client";

import { caseStudies } from "@/app/_data/case-studies";
import ProjectCard from "./ProjectCard";
import StudioStories from "./StudioStories";
import styles from "./WorkGrid.module.css";

export default function WorkGrid() {
  return (
    <section className={styles.section} id="work">
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Selected work</h2>
        <a href="#" className={styles.viewAll}>
          View all projects →
        </a>
      </div>
      <div className={styles.grid}>
        {/* Row 1: span-4 + span-2 */}
        <div className={styles.span4}>
          <ProjectCard project={caseStudies[0]} height={504} />
        </div>
        <div className={styles.span2}>
          <ProjectCard project={caseStudies[1]} height={504} />
        </div>

        {/* Row 2: span-4 + stories sidebar span-2 */}
        <div className={styles.span4}>
          <ProjectCard project={caseStudies[2]} height={504} />
        </div>
        <div className={styles.span2}>
          <StudioStories />
        </div>

        {/* Row 3: span-3 + span-3 */}
        <div className={styles.span3}>
          <ProjectCard project={caseStudies[3]} height={366} />
        </div>
        <div className={styles.span3}>
          <ProjectCard project={caseStudies[4]} height={366} />
        </div>

        {/* Row 4: span-2 + span-4 */}
        <div className={styles.span2}>
          <ProjectCard project={caseStudies[0]} height={504} />
        </div>
        <div className={styles.span4}>
          <ProjectCard project={caseStudies[1]} height={504} />
        </div>
      </div>
    </section>
  );
}
