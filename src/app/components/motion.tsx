"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import React from "react";

const EASE = [0.22, 1, 0.36, 1] as const; // easeOut

/** Jednoduché fade-up pre blok */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: rm ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Kontajner so *stagger* animáciou pre priame deti */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  const rm = useReducedMotion();

  const container: Variants = {
    hidden: { opacity: 0, y: rm ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, staggerChildren: 0.08 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: rm ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
