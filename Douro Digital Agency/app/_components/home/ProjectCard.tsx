"use client";

import { motion } from "framer-motion";
import type { CaseStudy } from "@/app/_data/case-studies";
import { scaleIn } from "@/app/_lib/motion";

interface Props {
  project: CaseStudy;
  height: number;
}

const cardStyle: React.CSSProperties = {
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  width: "100%",
};

const bgStyle = (color: string): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  background: color,
});

const infoStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: 24,
  height: 94,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
};

const titleStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  lineHeight: "22px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 500,
  lineHeight: "20px",
  color: "var(--muted)",
  marginTop: 4,
};

export default function ProjectCard({ project, height }: Props) {
  return (
    <motion.div
      style={{ ...cardStyle, height }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={scaleIn}
    >
      <div style={bgStyle(project.color)} />
      <div style={infoStyle}>
        <span style={titleStyle}>{project.title}</span>
        <span style={subtitleStyle}>{project.subtitle}</span>
      </div>
    </motion.div>
  );
}
