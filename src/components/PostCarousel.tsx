"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconSun } from "@/components/icons";

export type FeedPost = {
  id: string;
  // Pre-formatted on the server (via formatDate) so the client never
  // re-runs Intl.DateTimeFormat with a possibly different locale/ICU
  // data than the server, which was causing hydration mismatches.
  postedAtLabel: string;
  message: string | null;
  albumName?: string | null;
  photos: { id: string; url: string; width: number | null; height: number | null }[];
};

const AUTOPLAY_MS = 7000;
const EASE = [0.16, 1, 0.3, 1] as const;

function wrap(i: number, length: number) {
  return ((i % length) + length) % length;
}

export function PostCarousel({
  posts,
  initialIndex = 0,
  onClose,
}: {
  posts: FeedPost[];
  initialIndex?: number;
  onClose?: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const reduce = useReducedMotion();
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      setDir(delta);
      setPhotoIndex(0);
      setIndex((i) => wrap(i + delta, posts.length));
    },
    [posts.length]
  );

  useEffect(() => {
    if (paused || reduce || posts.length < 2) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, reduce, posts.length, go]);

  if (posts.length === 0) return null;
  const post = posts[index];
  const photo = post.photos[photoIndex] ?? post.photos[0];
  const hasMultiplePhotos = post.photos.length > 1;

  return (
    <div
      className="group relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (dx > 40) go(-1);
        else if (dx < -40) go(1);
        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -inset-y-4 -z-10 rounded-[3rem] bg-linear-to-br from-terracotta/25 via-sun/15 to-sage/20 blur-3xl"
      />

      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-30 rounded-full bg-ink p-2.5 text-white shadow-lift transition-colors hover:bg-ink/80"
          aria-label="Mbyll"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
      )}

      <div className="overflow-hidden rounded-4xl bg-white shadow-lift">
        {/* Photo stage — swaps together with the post */}
        <div className="relative h-[46vh] max-h-110 min-h-65 w-full bg-ink sm:h-[52vh]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={post.id}
              custom={dir}
              initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src={photo.url}
                alt="Foto nga postimi"
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-contain"
                priority={index === 0}
              />
              <div className="pointer-events-none absolute inset-0 from-ink/70 via-ink/0 to-ink/5" />
            </motion.div>
          </AnimatePresence>

          {/* mini-dots for photos within the current post */}
          {hasMultiplePhotos && (
            <div className="absolute inset-x-0 top-3 flex justify-center gap-1.5 px-4">
              {post.photos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPhotoIndex(i)}
                  className={`h-1 flex-1 max-w-10 rounded-full transition-colors ${
                    i === photoIndex ? "bg-white" : "bg-white/35"
                  }`}
                  aria-label={`Foto ${i + 1} e postimit`}
                  aria-current={i === photoIndex}
                />
              ))}
            </div>
          )}

          {hasMultiplePhotos && (
            <>
              <button
                onClick={() => setPhotoIndex((i) => wrap(i - 1, post.photos.length))}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                aria-label="Foto e mëparshme e postimit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setPhotoIndex((i) => wrap(i + 1, post.photos.length))}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                aria-label="Foto tjetër e postimit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Caption + meta — changes together with the post */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="p-5 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush">
                <IconSun className="h-5.5 w-5.5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink">
                  Mësimi Kreativ
                </p>
                <p className="text-xs text-ink-soft">{post.postedAtLabel}</p>
              </div>
              {post.albumName && (
                <span className="ml-auto shrink-0 rounded-full bg-blush px-2.5 py-0.5 text-[11px] font-bold text-terracotta-deep">
                  {post.albumName}
                </span>
              )}
            </div>
            {post.message && (
              <p className="mt-3 line-clamp-4 whitespace-pre-line leading-relaxed text-ink sm:line-clamp-none">
                {post.message}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Post-to-post nav (below card, always visible) */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          className="rounded-full bg-white p-2.5 text-ink shadow-soft transition-colors hover:text-terracotta"
          aria-label="Postimi i mëparshëm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-ink/15">
          {!paused && !reduce && (
            <motion.span
              key={`${post.id}-progress`}
              className="absolute inset-y-0 left-0 bg-terracotta"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
            />
          )}
          {(paused || reduce) && (
            <span
              className="absolute inset-y-0 left-0 bg-terracotta"
              style={{ width: `${((index + 1) / posts.length) * 100}%` }}
            />
          )}
        </div>
        <p className="w-14 shrink-0 text-center text-xs font-bold text-ink-soft">
          {index + 1} / {posts.length}
        </p>

        <button
          onClick={() => go(1)}
          className="rounded-full bg-white p-2.5 text-ink shadow-soft transition-colors hover:text-terracotta"
          aria-label="Postimi tjetër"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
