"use client";

import type { ReactNode } from "react";
import { Hash } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Props = {
  id: string;
  title?: string;
  kicker?: string;
  description?: string;
  center?: boolean;
  children: ReactNode;
};

export default function Section({
  id,
  title,
  kicker,
  description,
  center = false,
  children,
}: Props) {
  const rm = useReducedMotion();

  const container: Variants = {
    hidden: { opacity: 0, y: rm ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: EASE,
        when: "beforeChildren",
        staggerChildren: 0.06,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: rm ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  };

  return (
    <section id={id} className="scroll-mt-28">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {title && (
          <motion.header
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={container}
            className={`${center ? "text-center" : ""} pb-8 md:pb-10 lg:pb-12`}
          >
            {kicker && (
              <motion.p
                variants={item}
                className="text-[11px] uppercase tracking-[0.22em] text-stone-500"
              >
                {kicker}
              </motion.p>
            )}

            <div className="group relative inline-block pb-2">
              {/* anchor ikona */}
              <a
                href={`#${id}`}
                aria-label={`Odkaz na sekciu ${title}`}
                className="absolute -left-6 top-1 hidden opacity-0 transition-opacity group-hover:opacity-100 md:block"
              >
                <Hash className="h-4 w-4 text-stone-400 hover:text-stone-600" />
              </a>

              <motion.h2
                variants={item}
                className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl"
              >
                {title}
              </motion.h2>

              {/* accent podčiarka – používa utilitu .accent-underline z globals.css */}
              <span
                className={[
                  "pointer-events-none absolute bottom-0 h-[3px] w-24 rounded-full",
                  "accent-underline",
                  center ? "left-1/2 -translate-x-1/2" : "left-0",
                ].join(" ")}
              />
            </div>

            {description && (
              <motion.p
                variants={item}
                className={[
                  "mt-3 text-stone-600",
                  center ? "mx-auto max-w-2xl" : "max-w-3xl",
                ].join(" ")}
              >
                {description}
              </motion.p>
            )}
          </motion.header>
        )}

        {/* obsah sekcie */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
          className="mt-2 md:mt-4"
        >
          <motion.div variants={item}>{children}</motion.div>
        </motion.div>
      </div>
    </section>
  );
}
