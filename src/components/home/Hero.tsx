"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { IconPin, IconSun } from "@/components/icons";

export type HeroPhoto = {
  id: string;
  url: string;
  caption: string | null;
  width: number | null;
  height: number | null;
};

const rotations = ["-3deg", "2.2deg", "-1.6deg", "3deg"];

export function Hero({
  headline,
  subline,
  photos,
  showPromoCard = false,
}: {
  headline: string;
  subline: string;
  photos: HeroPhoto[];
  // When there's been no fresh Facebook activity recently, the last
  // collage slot becomes a promo/info card instead of a stale photo.
  showPromoCard?: boolean;
}) {
  const reduce = useReducedMotion();
  const ease = [0.21, 0.65, 0.36, 1] as const;

  return (
    <section className="texture-paper relative overflow-hidden bg-cream pt-28 pb-16 sm:pt-32 lg:min-h-[92vh] lg:pb-24">
      {/* soft background washes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sun/15 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-112 w-md rounded-full bg-sage/15 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-terracotta/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            {headline.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="underline-hand whitespace-nowrap">
              {headline.split(" ").slice(-2).join(" ")}
            </span>
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {subline}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/regjistrohu"
              className="rounded-full bg-terracotta px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-lift"
            >
              Regjistro fëmijën
            </Link>
            <Link
              href="/kontakti"
              className="rounded-full border-2 border-ink/10 bg-white/70 px-7 py-3.5 font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-sage hover:text-sage-deep"
            >
              Na kontaktoni
            </Link>
          </motion.div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6 text-sm text-ink-soft"
          >
            <IconPin className="mr-1 inline h-4 w-4 align-[-2px]" aria-hidden />
            Ejani për një vizitë — dyert tona janë gjithmonë të hapura për prindërit.
          </motion.p>
        </div>

        {/* photo collage — real memories, lightly scattered like on a fridge door */}
        <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-4 lg:max-w-none">
          {photos.slice(0, showPromoCard ? 3 : 4).map((p, i) => (
            <motion.figure
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 34, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: undefined }}
              transition={{ duration: 0.9, delay: 0.25 + i * 0.14, ease }}
              style={{ rotate: rotations[i % rotations.length] }}
              className={`polaroid ${i % 2 === 1 ? "mt-8" : ""}`}
            >
              <div className="overflow-hidden rounded-sm">
                <Image
                  src={p.url}
                  alt="Moment nga Mësimi Kreativ"
                  width={p.width ?? 800}
                  height={p.height ?? 600}
                  className="h-40 w-full object-cover sm:h-48"
                  priority={i < 2}
                />
              </div>
            </motion.figure>
          ))}
          {showPromoCard && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 34, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: undefined }}
              transition={{ duration: 0.9, delay: 0.25 + 3 * 0.14, ease }}
              style={{ rotate: rotations[3] }}
              className="polaroid mt-8 flex h-40 flex-col justify-center bg-terracotta px-4 text-center sm:h-48"
            >
              <p className="font-display text-base font-semibold text-white sm:text-lg">
                Ejani të njihemi!
              </p>
              <Link
                href="/regjistrohu"
                className="mt-2 inline-block rounded-full bg-white px-4 py-2 text-xs font-bold text-terracotta-deep transition-transform hover:scale-105"
              >
                Regjistro fëmijën
              </Link>
            </motion.div>
          )}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            className="float-slow absolute -top-6 -right-2 hidden rounded-full bg-sun px-4 py-2 font-display text-sm font-semibold text-ink shadow-soft lg:block"
            style={{ rotate: "6deg" }}
          >
            Kujtime të vërteta <IconSun className="ml-0.5 inline h-4.5 w-4.5 align-[-3px]" aria-hidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
