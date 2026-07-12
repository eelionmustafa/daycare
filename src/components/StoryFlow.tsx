"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* The vertical thread — a single line that fills as you scroll,        */
/* replacing the old chapter headers as the thing that ties the page   */
/* together.                                                            */
/* ------------------------------------------------------------------ */

export function StoryThread({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 15%", "end 75%"],
  });
  const height = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute inset-y-0 left-6 hidden w-px bg-ink/8 sm:left-1/2 sm:block"
      />
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute left-6 top-0 hidden w-px origin-top bg-gradient-to-b from-terracotta via-sage to-sky sm:left-1/2 sm:block"
          style={{ scaleY: height, height: "100%" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A single beat in the story — text on one side, an optional photo on */
/* the other, alternating naturally as you scroll instead of sitting   */
/* in a boxed grid.                                                     */
/* ------------------------------------------------------------------ */

export function StoryBeat({
  eyebrow,
  title,
  text,
  photo,
  align = "left",
  accent = "terracotta",
}: {
  eyebrow?: string;
  title: string;
  text: string;
  photo?: { url: string; width: number | null; height: number | null; alt: string } | null;
  align?: "left" | "right";
  accent?: "terracotta" | "sage" | "sky" | "sun";
}) {
  const reduce = useReducedMotion();
  const flip = align === "right";
  const accentClass = {
    terracotta: "text-terracotta bg-terracotta",
    sage: "text-sage-deep bg-sage",
    sky: "text-sky bg-sky",
    sun: "text-[#96700f] bg-sun",
  }[accent];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: EASE }}
      className="relative py-10 sm:py-14"
    >
      {/* node on the thread */}
      <span
        aria-hidden
        className={`absolute left-6 top-12 hidden h-2.5 w-2.5 -translate-x-1/2 rounded-full sm:left-1/2 sm:block ${accentClass.split(" ")[1]}`}
      />

      <div
        className={`grid items-center gap-8 pl-14 sm:gap-14 sm:pl-0 ${
          photo ? "sm:grid-cols-2" : ""
        }`}
      >
        <div className={flip && photo ? "sm:order-2" : ""}>
          {eyebrow && (
            <p className={`text-xs font-bold uppercase tracking-[0.22em] ${accentClass.split(" ")[0]}`}>
              {eyebrow}
            </p>
          )}
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            {title}
          </h3>
          <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">{text}</p>
        </div>

        {photo && (
          <div className={flip ? "sm:order-1" : ""}>
            <motion.figure
              initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: flip ? 2 : -2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="polaroid mx-auto max-w-sm"
              style={{ rotate: flip ? "1.5deg" : "-1.5deg" }}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                width={photo.width ?? 800}
                height={photo.height ?? 600}
                className="h-56 w-full rounded-sm object-cover sm:h-64"
              />
            </motion.figure>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* A loose cluster of small "floating" value cards — for the           */
/* philosophy section, so it doesn't read as a boxed grid.              */
/* ------------------------------------------------------------------ */

export function ValueCloud({
  items,
}: {
  items: { icon: ReactNode; title: string; text: string }[];
}) {
  const reduce = useReducedMotion();
  const drift = ["-1.2deg", "0.8deg", "-0.6deg", "1.4deg", "-1.6deg", "0.5deg"];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
          whileHover={reduce ? undefined : { y: -6, rotate: 0 }}
          style={{ rotate: drift[i % drift.length] }}
          className="rounded-3xl bg-white/70 p-6 shadow-soft backdrop-blur-sm transition-shadow hover:shadow-lift"
        >
          <span aria-hidden className="inline-block text-terracotta [&>svg]:h-8 [&>svg]:w-8">
            {it.icon}
          </span>
          <h4 className="mt-3 font-display text-lg font-semibold text-ink">{it.title}</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{it.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A scattered photo constellation — replaces the old grid of          */
/* community photos with something looser and more alive.               */
/* ------------------------------------------------------------------ */

export function PhotoConstellation({
  photos,
}: {
  photos: { id: string; url: string; width: number | null; height: number | null; alt: string }[];
}) {
  const reduce = useReducedMotion();
  const sizes = ["h-40 sm:h-48", "h-32 sm:h-40", "h-44 sm:h-52", "h-36 sm:h-44"];
  const shift = ["mt-0", "mt-8", "mt-4", "mt-12", "mt-2", "mt-10"];
  const rot = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.6deg", "0.8deg"];

  return (
    <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-6">
      {photos.map((p, i) => (
        <motion.figure
          key={p.id}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: (i % 6) * 0.07, ease: EASE }}
          whileHover={reduce ? undefined : { scale: 1.04, rotate: 0, zIndex: 10 }}
          className={`polaroid w-40 sm:w-48 ${shift[i % shift.length]}`}
          style={{ rotate: rot[i % rot.length] }}
        >
          <Image
            src={p.url}
            alt={p.alt}
            width={p.width ?? 600}
            height={p.height ?? 450}
            className={`w-full rounded-sm object-cover ${sizes[i % sizes.length]}`}
          />
        </motion.figure>
      ))}
    </div>
  );
}
