"use client";

import { motion } from "framer-motion";
import { stories } from "@/app/_data/home";
import { fadeUp } from "@/app/_lib/motion";

const wrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
  height: 504,
  justifyContent: "center",
};

const headingStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 500,
  lineHeight: "40px",
  marginBottom: 8,
};

const storyStyle: React.CSSProperties = {
  display: "flex",
  gap: 16,
  alignItems: "flex-start",
};

const thumbStyle: React.CSSProperties = {
  width: 60,
  height: 60,
  borderRadius: 60,
  background: "var(--border)",
  flexShrink: 0,
};

const textStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  lineHeight: "20px",
  color: "var(--muted)",
};

const dateStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--muted)",
  marginTop: 4,
};

export default function StudioStories() {
  return (
    <motion.div
      style={wrapStyle}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
    >
      <h3 style={headingStyle}>Studio stories</h3>
      {stories.map((s) => (
        <div key={s.title} style={storyStyle}>
          <div style={thumbStyle} />
          <div>
            <p style={textStyle}>{s.title}</p>
            <p style={dateStyle}>{s.date}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
