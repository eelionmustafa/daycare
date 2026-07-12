import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Reveal } from "@/components/Reveal";
import { MagicalGallery, GalleryIntroDecor, type MagicChapter } from "@/components/MagicalGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeria — Mësimi Kreativ",
  description: "Galeria e fotove të Mësimit Kreativ.",
};

const CHAPTER_ICON: Record<string, string> = {
  festa: "balloon",
  "projekte-kreative": "palette",
  "momente-klase": "book",
  "aktivitete-jashte": "kite",
  aktivitete: "star",
  evente: "pennant",
  "kujtime-te-vecanta": "heart",
};

const MAX_PER_CHAPTER = 24;

export default async function GalleryPage() {
  const [albums, noAlbumPhotos] = await Promise.all([
    db.album.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        photos: {
          // Only real synced Facebook photos — no placeholders, no manual demo shots.
          where: { visible: true, source: "FACEBOOK" },
          orderBy: [{ post: { postedAt: "desc" } }, { postOrder: "asc" }],
          take: MAX_PER_CHAPTER,
          select: { id: true, url: true, width: true, height: true, featured: true },
        },
      },
    }),
    db.photo.findMany({
      where: { visible: true, source: "FACEBOOK", albumId: null },
      orderBy: [{ post: { postedAt: "desc" } }, { postOrder: "asc" }],
      take: MAX_PER_CHAPTER,
      select: { id: true, url: true, width: true, height: true, featured: true },
    }),
  ]);

  const chapters: MagicChapter[] = albums
    .filter((a) => a.photos.length > 0)
    .map((a) => ({
      id: a.id,
      title: a.name,
      icon: CHAPTER_ICON[a.slug] ?? "star",
      photos: a.photos,
    }));

  if (noAlbumPhotos.length > 0) {
    chapters.push({
      id: "pa-album",
      title: "Kujtime të tjera",
      icon: "teddy",
      photos: noAlbumPhotos,
    });
  }

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
