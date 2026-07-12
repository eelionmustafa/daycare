"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { IconPhone, IconMail, IconWave } from "@/components/icons";

/* ------------------------------------------------------------------ */
/* Small decorative shapes — hand-drawn-feeling, matching the site's    */
/* warm palette. Scattered loosely around each card, never on top of    */
/* the photo/text itself.                                               */
/* ------------------------------------------------------------------ */

function ShapeStar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 0 14.5 9.5 24 12 14.5 14.5 12 24 9.5 14.5 0 12 9.5 9.5Z" />
    </svg>
  );
}

function ShapeBlob({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden fill="currentColor">
      <path d="M8 20c0-9 7-16 16-16s16 5 16 12-6 10-14 10S8 27 8 20Z" />
    </svg>
  );
}

function ShapeSquare({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="currentColor">
      <rect x="4" y="4" width="32" height="32" rx="8" />
    </svg>
  );
}

function ShapePentagon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="currentColor">
      <path d="M20 2 37 15 30 36 10 36 3 15Z" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* One 448:1024 "story" card                                            */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const;

function StoryCard({ index, children }: { index: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      className="relative aspect-[448/1024] w-full overflow-hidden rounded-[1.75rem] bg-white shadow-soft ring-1 ring-ink/5"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The four cards                                                       */
/* ------------------------------------------------------------------ */

export function StoryCards({
  photos,
  phone,
  email,
  siteUrl,
}: {
  photos: { id: string; url: string; width: number | null; height: number | null }[];
  phone: string;
  email: string;
  siteUrl: string;
}) {
  const p1 = photos[0];
  const p2 = photos[1];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* Card 1 — Çka ofrojmë ne */}
      <StoryCard index={0}>
        <div className="texture-paper absolute inset-0 bg-cream" />
        <ShapeSquare className="absolute left-6 top-8 h-9 w-9 text-sun" />
        <ShapeBlob className="absolute left-16 top-6 h-6 w-9 text-sage" />
        <ShapePentagon className="absolute left-24 top-14 h-7 w-7 text-sky/70" />
        <ShapeStar className="absolute left-7 top-24 h-5 w-5 text-terracotta anim-twinkle" />
        <div className="relative flex h-full flex-col justify-end p-5">
          <h3 className="underline-hand inline-block w-fit font-display text-xl font-bold text-sage-deep">
            Çka ofrojmë ne?
          </h3>
          <div className="mt-4 space-y-3 text-sm text-ink">
            <div>
              <p className="font-bold text-sage-deep">Qëndrim ditor</p>
              <p className="mt-0.5 leading-snug text-ink-soft">
                Ofrojmë qëndrim ditor për fëmijët e klasës së parë deri në klasën e pestë.
              </p>
            </div>
            <p className="font-bold text-sage-deep">Mësim shtesë</p>
            <p className="font-bold text-sage-deep">Asistencë në detyra të shtëpisë</p>
          </div>
        </div>
      </StoryCard>

      {/* Card 2 — Na kontaktoni + mini photo cluster */}
      <StoryCard index={1}>
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 to-white" />
        <ShapeBlob className="absolute -right-2 top-0 h-24 w-36 text-sage/40" />
        <ShapeStar className="absolute left-4 top-16 h-5 w-5 text-sky anim-twinkle" />
        <div className="relative flex h-full flex-col p-5">
          <h3 className="font-display text-lg font-bold text-sage-deep">Na kontaktoni tani!</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-ink">
            <li className="flex items-center gap-2">
              <IconPhone className="h-4 w-4 shrink-0 text-terracotta" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="font-semibold hover:text-terracotta">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IconMail className="h-4 w-4 shrink-0 text-terracotta" />
              <a href={`mailto:${email}`} className="font-semibold hover:text-terracotta break-all">
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <IconWave className="h-4 w-4 shrink-0 text-terracotta" />
              <span className="font-semibold">{siteUrl}</span>
            </li>
          </ul>

          {(p1 || p2) && (
            <div className="relative mt-auto flex flex-1 items-end pb-2">
              {p1 && (
                <div className="absolute bottom-8 left-0 h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-soft">
                  <Image
                    src={p1.url}
                    alt="Moment nga Mësimi Kreativ"
                    width={p1.width ?? 300}
                    height={p1.height ?? 300}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {p2 && (
                <div
                  className="absolute bottom-0 right-1 h-28 w-24 overflow-hidden bg-white shadow-soft"
                  style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                >
                  <Image
                    src={p2.url}
                    alt="Moment nga Mësimi Kreativ"
                    width={p2.width ?? 300}
                    height={p2.height ?? 300}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </StoryCard>

      {/* Card 3 — big photo + emotional line */}
      <StoryCard index={2}>
        {photos[2] ? (
          <Image
            src={photos[2].url}
            alt="Moment nga Mësimi Kreativ"
            fill
            sizes="(min-width: 640px) 25vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-sage/15" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/10" />
        <ShapeStar className="absolute right-5 top-6 h-5 w-5 text-sun anim-twinkle" />
        <ShapeBlob className="absolute right-3 top-16 h-6 w-9 text-sky/70" />
        <div className="relative flex h-full flex-col justify-end p-5">
          <p className="font-display text-lg font-bold leading-snug text-white sm:text-xl">
            Një botë e veçantë, plot dashuri dhe kujdes
          </p>
        </div>
      </StoryCard>

      {/* Card 4 — big photo + closing line */}
      <StoryCard index={3}>
        {photos[3] ? (
          <Image
            src={photos[3].url}
            alt="Moment nga Mësimi Kreativ"
            fill
            sizes="(min-width: 640px) 25vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-terracotta/15" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/5" />
        <ShapeStar className="absolute right-4 top-5 h-5 w-5 text-sage anim-twinkle" />
        <div className="relative flex h-full flex-col justify-end p-5">
          <h3 className="underline-hand inline-block w-fit font-display text-lg font-bold text-white">
            Argëtim, mësim dhe miqësi
          </h3>
          <p className="mt-2 text-sm leading-snug text-white/90">
            Fëmijët mësojnë më shumë kur ndihen të lumtur dhe të sigurt.
          </p>
          <Link
            href="/regjistrohu"
            className="mt-4 inline-block w-fit rounded-full bg-white px-4 py-2 text-xs font-bold text-terracotta-deep shadow-soft transition-transform hover:scale-105"
          >
            Regjistro fëmijën
          </Link>
        </div>
      </StoryCard>
    </div>
  );
}
