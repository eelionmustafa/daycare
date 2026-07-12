import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Reveal } from "@/components/Reveal";
import { GenerationsWall, type Generation } from "@/components/GenerationsWall";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gjeneratat — Mësimi Kreativ",
  description:
    "Gjeneratat që u rritën te Mësimi Kreativ: fotot dhe letrat e vërteta të diplomimit të çdo gjenerate, nga klasa e parë deri në të pestën.",
};

/** Diacritic-insensitive lowercase, so "klasës së pestë" matches "klases se peste". */
function norm(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * A graduation post talks about the 5th-grade cohort or a "generation"
 * finishing — the yearly June farewell posts with certificates and cake.
 * Kept keyword-based so each future June's post appears here automatically.
 */
function isGraduationPost(message: string | null) {
  if (!message) return false;
  const t = norm(message);
  const cohort =
    t.includes("klasen e pest") ||
    t.includes("klases se pest") ||
    t.includes("klasa e pest") ||
    t.includes("gjenerat");
  const finished =
    t.includes("perfund") || t.includes("mbarim") || t.includes("diplom");
  return cohort && finished;
}

export default async function GenerationsPage() {
  const posts = await db.post.findMany({
    where: {
      visible: true,
      source: "FACEBOOK",
      message: { not: null },
      photos: { some: { visible: true } },
    },
    orderBy: { postedAt: "desc" },
    include: {
      photos: {
        where: { visible: true },
        orderBy: { postOrder: "asc" },
        select: { id: true, url: true, width: true, height: true },
      },
    },
  });

  // One generation per graduation year; merge if multiple posts that June.
  const byYear = new Map<number, Generation>();
  for (const post of posts) {
    if (!isGraduationPost(post.message)) continue;
    const endYear = post.postedAt.getFullYear();
    const existing = byYear.get(endYear);
    if (existing) {
      existing.photos.push(...post.photos);
      if ((post.message ?? "").length > existing.letter.length) {
        existing.letter = post.message ?? existing.letter;
      }
    } else {
      byYear.set(endYear, {
        id: `gjenerata-${endYear}`,
        label: `${endYear - 5} – ${endYear}`,
        endYear,
        dateLabel: formatDate(post.postedAt),
        letter: post.message ?? "",
        photos: [...post.photos],
      });
    }
  }
  const generations = Array.from(byYear.values()).sort((a, b) => b.endYear - a.endYear);

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Gjeneratat tona
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Fëmijët që <span className="underline-hand">u rritën me ne</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="texture-paper mx-auto max-w-6xl pt-14">
        {generations.length === 0 ? (
          <p className="px-4 text-center text-ink-soft">
            Diplomimi i gjeneratës së parë do të shfaqet këtu.
          </p>
        ) : (
          <GenerationsWall generations={generations} />
        )}
      </div>
    </div>
  );
}
