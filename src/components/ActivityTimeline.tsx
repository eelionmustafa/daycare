"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PostCarousel, type FeedPost } from "@/components/PostCarousel";

export type TimelineMonth = {
  key: string; // e.g. "2026-06"
  label: string; // e.g. "Qershor 2026", pre-formatted on the server
  posts: FeedPost[];
};

/**
 * Groups the activity feed by month so visitors can scan and jump instead
 * of paging through dozens of posts one at a time. Each card is a compact
 * preview (full photo + first line + date); tapping one opens the
 * cinematic single-post PostCarousel as a lightbox, scoped to that month
 * and starting on the tapped post.
 */
export function ActivityTimeline({ months }: { months: TimelineMonth[] }) {
  const [open, setOpen] = useState<{ monthIndex: number; postIndex: number } | null>(null);
  const [expandedCaptions, setExpandedCaptions] = useState<Record<string, boolean>>({});

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div>
      {months.map((month, mi) => (
        <section key={month.key} className="mb-14">
          <div className="sticky top-16 z-10 -mx-4 mb-5 bg-cream/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              {month.label}
              <span className="ml-2 text-sm font-normal text-ink-soft">
                · {month.posts.length} postime
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {month.posts.map((post, pi) => (
              <div key={post.id} className="group text-left">
                <figure className="polaroid">
                  <button
                    type="button"
                    onClick={() => setOpen({ monthIndex: mi, postIndex: pi })}
                    className="relative block aspect-square w-full overflow-hidden rounded-sm bg-paper"
                    aria-label="Hap postimin"
                  >
                    {post.photos[0] && (
                      <Image
                        src={post.photos[0].url}
                        alt="Foto nga postimi"
                        fill
                        sizes="(min-width: 1024px) 260px, 45vw"
                        className="object-contain p-1 transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    )}
                    {post.photos.length > 1 && (
                      <span className="absolute right-1.5 top-1.5 rounded-full bg-ink/60 px-2 py-0.5 text-[10px] font-bold text-white">
                        1/{post.photos.length}
                      </span>
                    )}
                  </button>
                  <figcaption className="px-1 pt-2 pb-0.5">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-sage-deep">
                      {post.postedAtLabel}
                    </p>
                    {post.message && (
                      <>
                        <p
                          className={`mt-0.5 text-xs leading-snug text-ink-soft ${
                            expandedCaptions[post.id] ? "" : "line-clamp-2"
                          }`}
                        >
                          {post.message}
                        </p>
                        {post.message.length > 90 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedCaptions((current) => ({
                                ...current,
                                [post.id]: !current[post.id],
                              }))
                            }
                            className="mt-1 text-xs font-bold text-terracotta hover:underline"
                            aria-expanded={Boolean(expandedCaptions[post.id])}
                          >
                            {expandedCaptions[post.id] ? "Më pak" : "Më shumë"}
                          </button>
                        )}
                      </>
                    )}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>
      ))}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-ink/90 px-4 py-10 backdrop-blur-sm"
            onClick={close}
          >
            <div
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PostCarousel
                posts={months[open.monthIndex].posts}
                initialIndex={open.postIndex}
                onClose={close}
                
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
