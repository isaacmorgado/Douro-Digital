"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { fadeUp } from "@/app/_lib/motion";

interface Props {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  as?: "section" | "div" | "footer";
}

export default function MotionSection({
  children,
  variants = fadeUp,
  className,
  style,
  id,
  as = "section",
}: Props) {
  const Tag = motion[as] as typeof motion.section;
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      className={className}
      style={style}
      id={id}
    >
      {children}
    </Tag>
  );
}
