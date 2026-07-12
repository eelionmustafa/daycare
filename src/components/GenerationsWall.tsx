"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconGradCapSm, IconSprout } from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export type GenerationPhoto = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
};

export type Generation = {
  id: string;
  label: string; // "2021 – 2026"
  endYear: number;
  dateLabel: string; // pre-formatted on the server (hydration-safe)
  letter: string; // the teacher's real farewell message from Facebook
  photos: GenerationPhoto[];
};

const GOLD = "#d4a94e";
const GOLD_SOFT = "#f0d48a";
const INK = "#3b322a";

/* Deterministic jitter — SSR-safe (no Math.random in render) */
const rot = (i: number) => (((i * 47) % 9) - 4) * 0.9;

/* ------------------------------------------------------------------ */
/* Hand-drawn ceremonial decorations (pure SVG)                         */
/* ------------------------------------------------------------------ */

function GradCap({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden>
      <path d="M40 4 L76 20 L40 36 L4 20 Z" fill={INK} />
      <path d="M40 10 L62 20 L40 30 L18 20 Z" fill="#544737" />
      <path d="M24 28 v10 q 16 10 32 0 v-10 L40 36 Z" fill={INK} />
      <path d="M76 20 v14" stroke={GOLD} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="76" cy="37" r="3.5" fill={GOLD} />
    </svg>
  );
}

function Laurel({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 40 90" className={`${className} ${flip ? "-scale-x-100" : ""}`} aria-hidden>
      <path d="M32 6 C 12 24, 8 56, 26 84" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" />
      {[
        [26, 14, -40], [20, 26, -30], [16, 38, -18], [14, 50, -6], [16, 62, 8], [20, 73, 20],
      ].map(([x, y, a], i) => (
        <ellipse key={i} cx={x} cy={y} rx="4" ry="9" fill={GOLD_SOFT} transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </svg>
  );
}

function Diploma({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 44" className={className} aria-hidden>
      <rect x="6" y="10" width="60" height="24" rx="12" fill="#fdf6e6" stroke={GOLD} strokeWidth="2" />
      <circle cx="12" cy="22" r="9" fill="#fdf6e6" stroke={GOLD} strokeWidth="2" />
      <circle cx="60" cy="22" r="9" fill="#fdf6e6" stroke={GOLD} strokeWidth="2" />
      <path d="M30 18 h16 M30 24 h12" stroke={GOLD} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M36 32 l-4 8 4 -3 4 3 z" fill="#c66" />
    </svg>
  );
}

const CONFETTI = [
  { left: "6%", top: "12%", c: GOLD, d: "0s" },
  { left: "14%", top: "58%", c: "#e8a0b4", d: "0.6s" },
  { left: "22%", top: "30%", c: "#8fb8d8", d: "1.1s" },
  { right: "8%", top: "18%", c: "#a3cbaa", d: "0.3s" },
  { right: "16%", top: "52%", c: GOLD, d: "1.5s" },
  { right: "24%", top: "8%", c: "#e8a0b4", d: "0.9s" },
] as const;

function Confetti() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
      {CONFETTI.map((s, i) => (
        <span
          key={i}
          className="anim-twinkle absolute h-2.5 w-2.5 rounded-sm"
          style={{ ...s, background: s.c, animationDelay: s.d, transform: `rotate(${i * 31}deg)` }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* One generation chapter                                               */
/* ------------------------------------------------------------------ */

function GenerationChapter({
  gen,
  index,
  onOpen,
}: {
  gen: Generation;
  index: number;
  onOpen: (photoIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // Which photo sits in the big golden frame — thumbnails below swap it.
  const [heroIndex, setHeroIndex] = useState(0);
  const reduce = useReducedMotion();
  const hero = gen.photos[heroIndex] ?? gen.photos[0];
  const longLetter = gen.letter.length > 260;

  return (
    <section id={gen.id} className="relative scroll-mt-28">
      <Confetti />

      {/* Medallion header */}
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-xs flex-col items-center text-center"
      >
        <div className="relative flex items-center gap-1">
          <Laurel className="h-24 w-10" />
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gradient-to-b from-[#f7e7bd] to-[#e9c96f] shadow-[0_14px_35px_-10px_rgba(212,169,78,0.55)] ring-4 ring-white">
            <GradCap className="h-9 w-12" />
            <p className="mt-1 font-display text-sm font-bold leading-tight text-[#5c4a1e]">
              {gen.label}
            </p>
          </div>
          <Laurel className="h-24 w-10" flip />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Gjenerata {gen.label}
        </h2>
        <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-[#b08a34]">
          {gen.dateLabel}
        </p>
      </motion.div>

      {/* The teacher's real farewell letter, presented as a diploma */}
      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto mt-10 max-w-2xl"
      >
        <div className="rounded-lg border-2 border-[#e5cf96] bg-[#fffdf6] p-1.5 shadow-[0_20px_50px_-18px_rgba(120,95,40,0.35)]">
          <blockquote className="relative rounded-md border border-[#eddfb9] px-6 py-7 sm:px-10 sm:py-9">
            <Diploma className="absolute -top-5 left-1/2 h-10 w-16 -translate-x-1/2 bg-[#fffdf6] px-1" />
            <p
              className={`whitespace-pre-line text-center font-display text-base italic leading-relaxed text-[#5a4c33] sm:text-lg ${
                longLetter && !expanded ? "line-clamp-5" : ""
              }`}
            >
              {gen.letter}
            </p>
            {longLetter && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="text-sm font-bold text-[#b08a34] hover:underline"
                  aria-expanded={expanded}
                >
                  {expanded ? "Mbylle letrën" : "Lexo letrën e plotë"}
                </button>
              </div>
            )}
            <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#c9b078]">
              — Mësimi Kreativ —
            </p>
          </blockquote>
        </div>
      </motion.figure>

      {/* Graduation photos — big golden frame; thumbnails below swap it */}
      {hero && (
        <div className="mx-auto mt-12 max-w-4xl">
          <motion.button
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            whileHover={reduce ? undefined : { scale: 1.02 }}
            onClick={() => onOpen(heroIndex)}
            className="group relative mx-auto block w-full max-w-xl cursor-zoom-in rounded-xl bg-gradient-to-b from-[#f2ddab] to-[#dfbe74] p-2 shadow-[0_26px_60px_-16px_rgba(150,115,40,0.45)] sm:p-2.5"
            aria-label="Hap foton e diplomimit në ekran të plotë"
          >
            <span className="block overflow-hidden rounded-lg bg-white p-1.5">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={hero.id}
                  initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  <Image
                    src={hero.url}
                    alt={`Diplomimi i gjeneratës ${gen.label}`}
                    width={hero.width ?? 1000}
                    height={hero.height ?? 750}
                    className="max-h-[420px] w-full rounded-md object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.button>

          {gen.photos.length > 1 && (
            <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
              {gen.photos.map((p, i) => {
                const active = i === heroIndex;
                return (
                  <motion.button
                    key={p.id}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4) }}
                    whileHover={reduce ? undefined : { scale: 1.07, zIndex: 10 }}
                    onClick={() => setHeroIndex(i)}
                    style={{ rotate: active ? 0 : rot(i + index) }}
                    className={`rounded-md bg-white p-1 transition-shadow ${
                      active
                        ? "shadow-[0_10px_28px_-8px_rgba(212,169,78,0.65)] ring-2 ring-[#d4a94e]"
                        : "shadow-soft hover:shadow-lift"
                    }`}
                    aria-label={active ? "Fotoja e zgjedhur" : "Vendose në kornizën e madhe"}
                    aria-pressed={active}
                  >
                    <Image
                      src={p.url}
                      alt={`Kujtim nga gjenerata ${gen.label}`}
                      width={p.width ?? 400}
                      height={p.height ?? 400}
                      className={`aspect-square w-full rounded-sm object-cover transition-opacity ${
                        active ? "" : "opacity-90"
                      }`}
                    />
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The wall                                                             */
/* ------------------------------------------------------------------ */

export function GenerationsWall({ generations }: { generations: Generation[] }) {
  // One generation shown at a time — a yearbook, not an endless scroll.
  const [activeId, setActiveId] = useState(generations[0]?.id ?? "");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const active = useMemo(
    () => generations.find((g) => g.id === activeId) ?? generations[0],
    [generations, activeId]
  );
  const flat = active?.photos ?? [];

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) => (i === null ? null : (i + dir + flat.length) % flat.length)),
    [flat.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const current = lightbox !== null ? flat[lightbox] : null;
  if (!active) return null;

  return (
    <div>
      {/* Yearbook tabs — pick a generation, its story appears in place */}
      <nav className="flex flex-wrap items-center justify-center gap-3 px-4" aria-label="Gjeneratat">
        {generations.map((g) => {
          const isActive = g.id === active.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveId(g.id);
                setLightbox(null);
              }}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-bold transition-all hover:-translate-y-0.5 ${
                isActive
                  ? "bg-gradient-to-b from-[#f7e7bd] to-[#ecd08b] text-[#5c4a1e] shadow-[0_12px_30px_-10px_rgba(212,169,78,0.6)] ring-2 ring-[#d4a94e]"
                  : "bg-white text-ink-soft shadow-soft ring-1 ring-white/80 hover:text-[#5c4a1e]"
              }`}
            >
              <IconGradCapSm className="h-4.5 w-4.5" aria-hidden />
              {g.label}
            </button>
          );
        })}
      </nav>

      {/* A small laurel divider, echoing the medallion below */}
      <div className="mx-auto mt-10 flex max-w-[220px] items-center justify-center gap-2" aria-hidden>
        <Laurel className="h-10 w-5 opacity-70" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#d4a94e]" />
        <Laurel className="h-10 w-5 opacity-70" flip />
      </div>

      {/* Active generation, swapped in place with a soft page-turn */}
      <div className="mt-6 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <GenerationChapter gen={active} index={0} onOpen={(pi) => setLightbox(pi)} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The next generation, growing right now */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto mt-8 max-w-xl px-4 text-center"
      >
        <div className="mx-auto flex max-w-[180px] items-center justify-center gap-2" aria-hidden>
          <Laurel className="h-9 w-4.5 opacity-60" />
          <Laurel className="h-9 w-4.5 opacity-60" flip />
        </div>
        <p className="mt-2 flex items-center justify-center gap-2 font-display text-2xl font-semibold text-ink">
          Gjenerata e radhës po rritet tani.
          <IconSprout className="h-6 w-6" aria-hidden />
        </p>
        <p className="mt-2 text-ink-soft">
          Një ditë edhe fëmija juaj do të jetë në këtë mur — me certifikatë në dorë dhe
          plot kujtime të bukura.
        </p>
        <Link
          href="/regjistrohu"
          className="mt-6 inline-block rounded-full bg-terracotta px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
        >
          Regjistro fëmijën
        </Link>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex flex-col bg-[#2e2618]/90 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Fotoja në ekran të plotë"
          >
            <div className="flex items-center justify-between px-5 py-4 text-[#f0d48a]">
              <p className="text-sm font-semibold">
                {lightbox! + 1} / {flat.length}
              </p>
              <button
                onClick={close}
                className="rounded-full bg-[#f0d48a]/15 p-2 text-[#f0d48a] transition-colors hover:bg-[#f0d48a]/30"
                aria-label="Mbyll"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
            <div
              className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => step(-1)}
                className="absolute left-3 z-10 rounded-full bg-[#f0d48a]/15 p-3 text-[#f0d48a] transition-colors hover:bg-[#f0d48a]/30"
                aria-label="Fotoja e mëparshme"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.92, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-xl bg-gradient-to-b from-[#f2ddab]/40 to-[#dfbe74]/40 p-2 shadow-[0_0_80px_-8px_rgba(240,212,138,0.5)]"
              >
                <Image
                  src={current.url}
                  alt="Foto diplomimi nga Mësimi Kreativ"
                  width={current.width ?? 1200}
                  height={current.height ?? 900}
                  className="max-h-[76vh] w-auto rounded-lg object-contain"
                />
              </motion.div>
              <button
                onClick={() => step(1)}
                className="absolute right-3 z-10 rounded-full bg-[#f0d48a]/15 p-3 text-[#f0d48a] transition-colors hover:bg-[#f0d48a]/30"
                aria-label="Fotoja tjetër"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
