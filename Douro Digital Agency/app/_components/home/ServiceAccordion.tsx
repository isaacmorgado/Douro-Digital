"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services, type Service } from "@/app/_data/services";

const itemStyle: React.CSSProperties = {
  borderBottom: "1px solid var(--border)",
  cursor: "pointer",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 0",
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 500,
  lineHeight: "30px",
};

const descStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 500,
  lineHeight: "30px",
  color: "var(--muted)",
  paddingBottom: 20,
};

const arrowStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  transition: "transform 0.3s",
};

export default function ServiceAccordion() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div>
      {services.map((s: Service, i: number) => (
        <div key={s.title} style={itemStyle} onClick={() => setOpen(open === i ? -1 : i)}>
          <div style={headerStyle}>
            <span style={titleStyle}>{s.title}</span>
            <svg
              style={{ ...arrowStyle, transform: open === i ? "rotate(180deg)" : "rotate(0)" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <p style={descStyle}>{s.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
