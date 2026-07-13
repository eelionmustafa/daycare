import type { Metadata } from "next";
import { getLiveFacebookPhotos } from "@/lib/facebook";
import { Reveal } from "@/components/Reveal";
import { MagicalGallery, GalleryIntroDecor } from "@/components/MagicalGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeria — Mësimi Kreativ",
  description: "Galeria e fotove të Mësimit Kreativ.",
};

export default async function GalleryPage() {
  // Fetched live from Facebook on every request (cached ~5 min) rather
  // than imported into the database — see getLiveFacebookPhotos for why.
  const chapters = await getLiveFacebookPhotos();

  return (
    <div
      className="overflow-hidden pb-24 pt-24"
      style={{
        background:
          "linear-gradient(175deg, #eaf4fd 0%, #f3eefb 24%, #fdf1f5 46%, #fff6e8 68%, #ecf8f0 88%, #eaf4fd 100%)",
      }}
    >
      <section className="relative mx-auto max-w-3xl px-4 pb-6 pt-8 text-center sm:px-6">
        <Reveal>
          <GalleryIntroDecor />
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-[#4b4470] sm:text-5xl">
            Galeria
          </h1>
        </Reveal>
      </section>

      {chapters.length === 0 ? (
        <p className="pt-10 text-center text-[#6b6293]">
          Fotot do të shfaqen këtu shumë shpejt.
        </p>
      ) : (
        <MagicalGallery chapters={chapters} />
      )}
    </div>
  );
}
