"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { introEasing } from "@/config/intro-motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  ...props
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: introEasing }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
