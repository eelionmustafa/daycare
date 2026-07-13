import type { Metadata } from "next";
import { getLiveGenerations } from "@/lib/facebook";
import { Reveal } from "@/components/Reveal";
import { GenerationsWall } from "@/components/GenerationsWall";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gjeneratat — Mësimi Kreativ",
  description:
    "Gjeneratat që u rritën te Mësimi Kreativ: fotot dhe letrat e vërteta të diplomimit të çdo gjenerate, nga klasa e parë deri në të pestën.",
};

export default async function GenerationsPage() {
  // Fetched live from Facebook on every request (cached ~5 min) rather
  // than imported into the database — see getLiveGenerations for why.
  const generations = await getLiveGenerations(formatDate);

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
