"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  IconBalloonSm,
  IconPalette,
  IconBook,
  IconKiteSm,
  IconStarSm,
  IconPennant,
  IconHeart,
  IconTeddySm,
  IconSparkle,
} from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

export type MagicPhoto = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  featured: boolean;
};

export type MagicChapter = {
  id: string;
  title: string;
  icon: string; // key into CHAPTER_ICONS
  photos: MagicPhoto[];
};

const CHAPTER_ICONS: Record<string, React.ReactNode> = {
  balloon: <IconBalloonSm />,
  palette: <IconPalette />,
  book: <IconBook />,
  kite: <IconKiteSm />,
  star: <IconStarSm />,
  pennant: <IconPennant />,
  heart: <IconHeart />,
  teddy: <IconTeddySm />,
};

/* Dreamy pastels — page-scoped, softer than the site's main palette */
const PASTEL = {
  sky: "#a8d8f0",
  lavender: "#cbb6e8",
  mint: "#b9e6c9",
  peach: "#ffd3b3",
  pink: "#f9c9d8",
  sun: "#ffe39b",
  inkSoft: "#6b6293",
};

/* Deterministic pseudo-random from an index — keeps SSR and client HTML
   identical (Math.random during render would cause hydration mismatches). */
const jitterY = (i: number) => (i * 37) % 56;
const jitterRot = (i: number) => (((i * 53) % 7) - 3) * 0.8;

/* ------------------------------------------------------------------ */
/* Hand-drawn decorations — pure SVG, no image files                    */
/* ------------------------------------------------------------------ */

function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden>
      <g fill="#ffffff" opacity="0.9">
        <ellipse cx="38" cy="40" rx="26" ry="16" />
        <ellipse cx="66" cy="30" rx="24" ry="18" />
        <ellipse cx="90" cy="42" rx="22" ry="13" />
      </g>
    </svg>
  );
}

function Balloon({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 40 78" className={className} aria-hidden>
      <path d="M20 52 q -2 10 0 24" stroke={PASTEL.inkSoft} strokeWidth="1.4" fill="none" opacity="0.5" />
      <ellipse cx="20" cy="26" rx="16" ry="22" fill={color} />
      <ellipse cx="14" cy="18" rx="5" ry="8" fill="#ffffff" opacity="0.45" />
      <path d="M17 49 l3 6 3 -6 z" fill={color} />
    </svg>
  );
}

function Star4({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 L14.5 9.5 24 12 14.5 14.5 12 24 9.5 14.5 0 12 9.5 9.5 Z" fill={color} />
    </svg>
  );
}

function Butterfly({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 48" className={className} aria-hidden>
      <path d="M30 24 C 12 2, 0 12, 8 26 C 12 33, 22 32, 30 24" fill={PASTEL.lavender} opacity="0.9" />
      <path d="M30 24 C 48 2, 60 12, 52 26 C 48 33, 38 32, 30 24" fill={PASTEL.pink} opacity="0.9" />
      <path d="M30 24 C 16 40, 20 46, 28 40 C 30 38, 30 30, 30 24" fill={PASTEL.pink} opacity="0.75" />
      <path d="M30 24 C 44 40, 40 46, 32 40 C 30 38, 30 30, 30 24" fill={PASTEL.lavender} opacity="0.75" />
      <ellipse cx="30" cy="26" rx="2.4" ry="9" fill={PASTEL.inkSoft} />
    </svg>
  );
}

function PaperPlane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden>
      <path d="M2 20 L62 2 L38 42 L28 28 Z" fill="#ffffff" stroke={PASTEL.sky} strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 28 L62 2 L30 36 Z" fill={PASTEL.sky} opacity="0.55" />
    </svg>
  );
}

function Rainbow({ className = "" }: { className?: string }) {
  const arcs = [PASTEL.pink, PASTEL.peach, PASTEL.sun, PASTEL.mint, PASTEL.sky];
  return (
    <svg viewBox="0 0 120 62" className={className} aria-hidden>
      {arcs.map((c, i) => (
        <path
          key={c}
          d={`M ${8 + i * 9} 60 A ${52 - i * 9} ${52 - i * 9} 0 0 1 ${112 - i * 9} 60`}
          stroke={c}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <ellipse cx="12" cy="58" rx="10" ry="6" fill="#fff" opacity="0.95" />
      <ellipse cx="108" cy="58" rx="10" ry="6" fill="#fff" opacity="0.95" />
    </svg>
  );
}

function Kite({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 84" className={className} aria-hidden>
      <path d="M28 2 L52 28 L28 54 L4 28 Z" fill={PASTEL.peach} />
      <path d="M28 2 L52 28 L28 28 Z" fill={PASTEL.sun} />
      <path d="M28 54 q -6 10 2 14 q 8 4 2 14" stroke={PASTEL.inkSoft} strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M24 62 l8 4 M22 74 l8 4" stroke={PASTEL.pink} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PaperBoat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 44" className={className} aria-hidden>
      <path d="M8 26 h56 l-12 14 h-32 z" fill="#ffffff" stroke={PASTEL.sky} strokeWidth="2" strokeLinejoin="round" />
      <path d="M36 4 L36 26 L18 26 Z" fill={PASTEL.sky} opacity="0.5" />
      <path d="M36 4 L36 26 L54 26 Z" fill="#ffffff" stroke={PASTEL.sky} strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 40 q 8 -5 16 0 t 16 0 t 16 0 t 16 0" stroke={PASTEL.sky} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function Teddy({ className = "" }: { className?: string }) {
  const fur = "#d9b38c";
  return (
    <svg viewBox="0 0 72 80" className={className} aria-hidden>
      <circle cx="18" cy="14" r="10" fill={fur} />
      <circle cx="54" cy="14" r="10" fill={fur} />
      <circle cx="18" cy="14" r="5" fill={PASTEL.peach} />
      <circle cx="54" cy="14" r="5" fill={PASTEL.peach} />
      <circle cx="36" cy="28" r="20" fill={fur} />
      <ellipse cx="36" cy="34" rx="9" ry="7" fill="#f3e0c8" />
      <circle cx="29" cy="24" r="2.4" fill="#4a3826" />
      <circle cx="43" cy="24" r="2.4" fill="#4a3826" />
      <ellipse cx="36" cy="32" rx="3" ry="2.2" fill="#4a3826" />
      <ellipse cx="36" cy="62" rx="17" ry="16" fill={fur} />
      <ellipse cx="36" cy="64" rx="9" ry="10" fill="#f3e0c8" />
      <ellipse cx="16" cy="56" rx="6" ry="10" fill={fur} transform="rotate(20 16 56)" />
      <ellipse cx="56" cy="56" rx="6" ry="10" fill={fur} transform="rotate(-20 56 56)" />
    </svg>
  );
}

function ToyBlock({ letter, color, className = "" }: { letter: string; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <path d="M8 18 L30 8 L52 18 L30 28 Z" fill="#ffffff" opacity="0.9" />
      <path d="M8 18 L30 28 L30 54 L8 44 Z" fill={color} />
      <path d="M52 18 L30 28 L30 54 L52 44 Z" fill={color} opacity="0.65" />
      <text x="19" y="44" fontSize="15" fontFamily="Georgia, serif" fontWeight="bold" fill="#ffffff">
        {letter}
      </text>
    </svg>
  );
}

function ToyTrain({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 60" className={className} aria-hidden>
      <rect x="4" y="26" width="42" height="22" rx="5" fill={PASTEL.sky} />
      <rect x="10" y="12" width="14" height="16" rx="3" fill={PASTEL.sky} />
      <rect x="30" y="18" width="8" height="10" rx="2" fill={PASTEL.sun} />
      <rect x="54" y="30" width="24" height="18" rx="4" fill={PASTEL.pink} />
      <rect x="84" y="30" width="22" height="18" rx="4" fill={PASTEL.mint} />
      <circle cx="16" cy="52" r="6" fill={PASTEL.inkSoft} />
      <circle cx="36" cy="52" r="6" fill={PASTEL.inkSoft} />
      <circle cx="62" cy="52" r="5" fill={PASTEL.inkSoft} />
      <circle cx="94" cy="52" r="5" fill={PASTEL.inkSoft} />
      <circle cx="14" cy="8" r="4" fill="#ffffff" opacity="0.85" />
      <circle cx="20" cy="4" r="3" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

function Flower({ color, className = "" }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="24" cy="12" rx="7" ry="11" fill={color} transform={`rotate(${a} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="7" fill={PASTEL.sun} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkles around featured photos                                      */
/* ------------------------------------------------------------------ */

const SPARKLE_SPOTS = [
  { top: "-8px", left: "12%", size: 12, delay: "0s" },
  { top: "18%", right: "-10px", size: 9, delay: "0.7s" },
  { bottom: "10%", left: "-9px", size: 10, delay: "1.3s" },
  { bottom: "-8px", right: "20%", size: 13, delay: "1.9s" },
] as const;

function Sparkles() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {SPARKLE_SPOTS.map((s, i) => (
        <span
          key={i}
          className="anim-twinkle absolute"
          style={{ ...s, width: s.size, height: s.size, animationDelay: s.delay }}
        >
          <Star4 color={PASTEL.sun} className="h-full w-full drop-shadow-[0_0_6px_rgba(255,227,155,0.9)]" />
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Floating, mouse-tilting photo card                                   */
/* ------------------------------------------------------------------ */

function FloatingPhoto({
  photo,
  index,
  onOpen,
}: {
  photo: MagicPhoto;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 160, damping: 14 });
  const ry = useSpring(0, { stiffness: 160, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div
      style={{
        perspective: 900,
        marginTop: `${jitterY(index)}px`,
      }}
      className="anim-bob-slow"
    >
      <motion.button
        onClick={onOpen}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        whileHover={reduce ? undefined : { scale: 1.06, zIndex: 20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX: rx, rotateY: ry, rotate: jitterRot(index) }}
        className="group relative block w-full cursor-zoom-in rounded-2xl bg-white/70 p-2 shadow-[0_18px_45px_-14px_rgba(120,110,180,0.4)] ring-1 ring-white/70 backdrop-blur-sm transition-shadow duration-500 hover:shadow-[0_30px_70px_-12px_rgba(140,120,220,0.55)]"
        aria-label="Hap foton"
      >
        <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-white/70">
          <Image
            src={photo.url}
            alt="Moment nga Mësimi Kreativ"
            fill
            sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
            className="object-contain p-1"
          />
        </span>
        {/* soft glow highlight sweeping the glass frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {photo.featured && <Sparkles />}
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll parallax wrapper for decorations                              */
/* ------------------------------------------------------------------ */

function Parallax({
  speed,
  className,
  children,
}: {
  speed: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -70, speed * 70]);
  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className} aria-hidden>
      {children}
    </motion.div>
  );
}

/* Curved dashed path between chapters — the "walk" through the story */
function PathDivider({ flip }: { flip: boolean }) {
  return (
    <div className="relative mx-auto h-36 max-w-lg" aria-hidden>
      <svg viewBox="0 0 400 140" className={`h-full w-full ${flip ? "-scale-x-100" : ""}`}>
        <path
          d="M 60 8 C 220 40, 160 100, 340 132"
          fill="none"
          stroke={PASTEL.lavender}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 14"
          opacity="0.8"
        />
      </svg>
      <PaperPlane className={`anim-flutter absolute top-0 h-8 w-12 ${flip ? "right-10" : "left-10"}`} />
    </div>
  );
}

/* Decorations scattered around each chapter, varied by index */
function ChapterDecor({ index }: { index: number }) {
  const variant = index % 4;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {variant === 0 && (
        <>
          <Parallax speed={0.5} className="absolute -top-8 -left-2 w-28 opacity-90 sm:-left-10 sm:w-36">
            <Cloud className="anim-bob-slow w-full" />
          </Parallax>
          <Parallax speed={1} className="absolute top-10 -right-1 w-9 sm:right-2 sm:w-11">
            <Balloon color={PASTEL.pink} className="anim-bob w-full" />
          </Parallax>
          <Parallax speed={0.7} className="absolute bottom-6 -left-1 w-12 sm:left-4 sm:w-14">
            <Flower color={PASTEL.pink} className="anim-bob-rot w-full" />
          </Parallax>
        </>
      )}
      {variant === 1 && (
        <>
          <Parallax speed={0.8} className="absolute -top-10 right-4 w-24 sm:w-32">
            <Rainbow className="anim-bob-slow w-full" />
          </Parallax>
          <Parallax speed={1.1} className="absolute top-1/3 -left-2 w-12 sm:left-0 sm:w-14">
            <Butterfly className="anim-flutter w-full" />
          </Parallax>
          <Parallax speed={0.6} className="absolute -bottom-4 right-8 w-16 sm:w-20">
            <Teddy className="anim-bob w-full" />
          </Parallax>
        </>
      )}
      {variant === 2 && (
        <>
          <Parallax speed={0.6} className="absolute -top-6 left-6 w-11 sm:w-14">
            <Kite className="anim-bob-rot w-full" />
          </Parallax>
          <Parallax speed={0.9} className="absolute top-1/2 -right-2 w-24 opacity-90 sm:right-0 sm:w-32">
            <Cloud className="anim-bob-slow w-full" />
          </Parallax>
          <Parallax speed={0.7} className="absolute -bottom-6 left-2 w-20 sm:w-28">
            <ToyTrain className="anim-bob w-full" />
          </Parallax>
        </>
      )}
      {variant === 3 && (
        <>
          <Parallax speed={0.9} className="absolute -top-8 left-1/4 w-9 sm:w-11">
            <Balloon color={PASTEL.sky} className="anim-bob w-full" />
          </Parallax>
          <Parallax speed={0.5} className="absolute top-16 -right-2 w-14 sm:right-2 sm:w-16">
            <PaperBoat className="anim-bob-rot w-full" />
          </Parallax>
          <Parallax speed={0.8} className="absolute -bottom-5 right-1/4 flex w-24 gap-1 sm:w-28">
            <ToyBlock letter="M" color={PASTEL.sky} className="anim-bob w-1/2" />
            <ToyBlock letter="K" color={PASTEL.pink} className="anim-bob-slow w-1/2" />
          </Parallax>
        </>
      )}
      {/* a few ambient twinkles for every chapter */}
      <Star4 color={PASTEL.sun} className="anim-twinkle absolute top-8 left-1/3 h-3 w-3" />
      <Star4
        color={PASTEL.lavender}
        className="anim-twinkle absolute bottom-16 right-1/3 h-4 w-4"
      />
    </div>
  );
}

/**
 * A small decorative cluster for the page-level intro, above the first
 * chapter — reuses the same hand-drawn pieces as the chapters so the
 * entrance doesn't feel flatter than the story that follows.
 */
export function GalleryIntroDecor() {
  return (
    <div aria-hidden className="pointer-events-none relative mx-auto h-16 max-w-xs sm:h-20">
      <Rainbow className="anim-bob-slow absolute left-1/2 top-0 w-28 -translate-x-1/2 sm:w-36" />
      <Cloud className="anim-bob absolute -left-6 top-6 w-14 opacity-80 sm:-left-10 sm:w-16" />
      <Cloud className="anim-bob-slow absolute -right-4 top-8 w-12 opacity-80 sm:-right-6 sm:w-14" />
      <Star4 color={PASTEL.sun} className="anim-twinkle absolute right-2 top-0 h-3 w-3" />
      <Star4 color={PASTEL.pink} className="anim-twinkle absolute left-4 top-2 h-2.5 w-2.5" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The gallery itself                                                   */
/* ------------------------------------------------------------------ */

const PAGE_STEP = 8;

export function MagicalGallery({ chapters }: { chapters: MagicChapter[] }) {
  const [shownPerChapter, setShownPerChapter] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<number | null>(null);

  /* Flat list across chapters so the lightbox can walk everything */
  const flat = useMemo(() => chapters.flatMap((c) => c.photos), [chapters]);
  const offsets = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    for (const c of chapters) {
      map[c.id] = acc;
      acc += c.photos.length;
    }
    return map;
  }, [chapters]);

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

  return (
    <div>
      {chapters.map((chapter, ci) => {
        const shown = shownPerChapter[chapter.id] ?? PAGE_STEP;
        const visible = chapter.photos.slice(0, shown);
        return (
          <div key={chapter.id}>
            {ci > 0 && <PathDivider flip={ci % 2 === 0} />}

            <section className="relative mx-auto max-w-5xl px-4 sm:px-6">
              <ChapterDecor index={ci} />

              {/* Chapter heading — a floating glass island */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto max-w-md rounded-3xl bg-white/50 px-7 py-5 text-center shadow-[0_16px_40px_-16px_rgba(120,110,180,0.35)] ring-1 ring-white/70 backdrop-blur-md"
              >
                <span
                  aria-hidden
                  className="anim-bob-rot inline-block text-[#6b6293] [&>svg]:h-9 [&>svg]:w-9"
                >
                  {CHAPTER_ICONS[chapter.icon] ?? CHAPTER_ICONS.star}
                </span>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#4b4470]">
                  {chapter.title}
                </h2>
              </motion.div>

              {/* Floating photo island */}
              <div className="relative mt-10 grid grid-cols-2 gap-5 pb-16 sm:grid-cols-3 sm:gap-7 lg:grid-cols-4">
                {visible.map((p, i) => (
                  <FloatingPhoto
                    key={p.id}
                    photo={p}
                    index={i + ci}
                    onOpen={() => setLightbox(offsets[chapter.id] + i)}
                  />
                ))}
              </div>

              {shown < chapter.photos.length && (
                <div className="-mt-8 pb-12 text-center">
                  <button
                    onClick={() =>
                      setShownPerChapter((s) => ({ ...s, [chapter.id]: shown + PAGE_STEP }))
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-white/70 px-6 py-2.5 text-sm font-bold text-[#6b6293] shadow-soft ring-1 ring-white/80 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <IconSparkle className="h-4 w-4" aria-hidden />
                    Zbulo më shumë kujtime ({chapter.photos.length - shown})
                  </button>
                </div>
              )}
            </section>
          </div>
        );
      })}

      {/* Closing flourish — the gallery's last page, not an abrupt stop */}
      <div className="relative">
        <PathDivider flip={chapters.length % 2 === 0} />
        <div className="relative mx-auto -mt-6 mb-8 flex max-w-xs items-center justify-center gap-2 text-center">
          <Star4 color={PASTEL.sun} className="anim-twinkle h-3 w-3" />
          <p className="font-display text-sm text-[#8b84ad]">Fund i kujtimeve — për tani</p>
          <Star4 color={PASTEL.lavender} className="anim-twinkle h-3 w-3" />
        </div>
      </div>

      {/* Fullscreen dream viewer */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex flex-col bg-[#2b2447]/85 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Fotoja në ekran të plotë"
          >
            {/* dreamy backdrop stars */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <Star4 color={PASTEL.sun} className="anim-twinkle absolute left-[12%] top-[18%] h-4 w-4" />
              <Star4 color={PASTEL.pink} className="anim-twinkle absolute right-[15%] top-[30%] h-3 w-3" />
              <Star4 color={PASTEL.sky} className="anim-twinkle absolute bottom-[20%] left-[20%] h-3 w-3" />
              <Star4 color={PASTEL.mint} className="anim-twinkle absolute bottom-[28%] right-[22%] h-4 w-4" />
            </div>

            <div className="flex items-center justify-between px-5 py-4 text-white/85">
              <p className="text-sm font-semibold">
                {lightbox! + 1} / {flat.length}
              </p>
              <button
                onClick={close}
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/25"
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
                className="absolute left-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
                aria-label="Fotoja e mëparshme"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl bg-white/10 p-2 shadow-[0_0_80px_-10px_rgba(203,182,232,0.65)] ring-1 ring-white/25"
              >
                <Image
                  src={current.url}
                  alt="Foto nga Mësimi Kreativ"
                  width={current.width ?? 1200}
                  height={current.height ?? 900}
                  className="max-h-[76vh] w-auto rounded-xl object-contain"
                />
              </motion.div>

              <button
                onClick={() => step(1)}
                className="absolute right-3 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
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
