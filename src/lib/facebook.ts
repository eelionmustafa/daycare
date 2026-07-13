import { getSettings } from "@/lib/settings";
import { categorizeCaption } from "@/lib/categorize";

export const ALBUM_DEFS: { slug: string; name: string; icon: string }[] = [
  { slug: "festa", name: "Festa", icon: "balloon" },
  { slug: "projekte-kreative", name: "Projekte kreative", icon: "palette" },
  { slug: "momente-klase", name: "Momente nga klasa", icon: "book" },
  { slug: "aktivitete-jashte", name: "Aktivitete jashtë", icon: "kite" },
  { slug: "aktivitete", name: "Aktivitete", icon: "star" },
  { slug: "evente", name: "Evente", icon: "pennant" },
  { slug: "kujtime-te-vecanta", name: "Kujtime të veçanta", icon: "heart" },
];

type FbSubattachment = {
  type?: string;
  media?: { image?: { src: string; width: number; height: number } };
  target?: { id?: string };
};
type FbAttachment = {
  type?: string;
  media?: { image?: { src: string; width: number; height: number } };
  target?: { id?: string };
  subattachments?: { data: FbSubattachment[] };
};
type FbPost = {
  id: string;
  message?: string;
  created_time: string;
  attachments?: { data: FbAttachment[] };
};

export type LivePhoto = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  featured: boolean;
};

export type LiveChapter = {
  id: string;
  title: string;
  icon: string;
  photos: LivePhoto[];
};

type ParsedImage = { fbId: string; src: string; width: number; height: number };
type ParsedPost = { id: string; message: string | null; postedAt: Date; images: ParsedImage[] };

/**
 * Fetches recent Facebook posts directly from the Graph API and flattens
 * each post's photo attachments, entirely in memory — no database writes,
 * no re-hosting on Blob storage. Shared by the live gallery and generations
 * wall so both read from the same single Graph API call shape.
 *
 * Requires fb_page_id + fb_access_token in Cilësimet, or the
 * FACEBOOK_PAGE_ID / FACEBOOK_ACCESS_TOKEN env vars.
 */
async function fetchLivePosts(limit: number): Promise<ParsedPost[]> {
  const s = await getSettings();
  const pageId = s.fb_page_id || process.env.FACEBOOK_PAGE_ID;
  const token = s.fb_access_token || process.env.FACEBOOK_ACCESS_TOKEN;
  if (!pageId || !token) return [];

  const fields =
    "id,message,created_time,attachments{type,media,subattachments{media,target}}";
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    pageId
  )}/posts?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  const data = await res.json();
  if (!res.ok || data.error) return [];

  const posts: ParsedPost[] = [];
  for (const post of (data.data ?? []) as FbPost[]) {
    const images: ParsedImage[] = [];
    for (const att of post.attachments?.data ?? []) {
      if (att.subattachments?.data?.length) {
        for (const sub of att.subattachments.data) {
          if (sub.media?.image && sub.target?.id) {
            images.push({
              fbId: sub.target.id,
              src: sub.media.image.src,
              width: sub.media.image.width,
              height: sub.media.image.height,
            });
          }
        }
      } else if (att.media?.image && att.type === "photo" && att.target?.id) {
        images.push({
          fbId: att.target.id,
          src: att.media.image.src,
          width: att.media.image.width,
          height: att.media.image.height,
        });
      }
    }
    posts.push({
      id: post.id,
      message: post.message?.slice(0, 500) ?? null,
      postedAt: new Date(post.created_time),
      images,
    });
  }
  return posts;
}

/**
 * Groups live Facebook posts into gallery chapters by caption keywords.
 * See `fetchLivePosts` for why this reads live rather than from the DB
 * (avoids Cloudflare Workers' per-invocation subrequest limit, at the
 * cost of no manual curation and Facebook's own CDN links, which expire
 * and rotate — so this refetches on every request rather than persisting).
 */
export async function getLiveFacebookPhotos(limit = 25): Promise<LiveChapter[]> {
  const posts = await fetchLivePosts(limit);

  const chaptersBySlug = new Map<string, LiveChapter>();
  const misc: LivePhoto[] = [];
  let seq = 0;

  for (const post of posts) {
    if (post.images.length === 0) continue;
    const albumSlug = categorizeCaption(post.message);
    const bucket = post.images.map((img) => ({
      id: img.fbId,
      url: img.src,
      width: img.width,
      height: img.height,
      featured: seq++ < 6,
    }));

    if (albumSlug) {
      const def = ALBUM_DEFS.find((a) => a.slug === albumSlug)!;
      const existing = chaptersBySlug.get(albumSlug);
      if (existing) {
        existing.photos.push(...bucket);
      } else {
        chaptersBySlug.set(albumSlug, {
          id: albumSlug,
          title: def.name,
          icon: def.icon,
          photos: bucket,
        });
      }
    } else {
      misc.push(...bucket);
    }
  }

  const chapters = ALBUM_DEFS.map((a) => chaptersBySlug.get(a.slug)).filter(
    (c): c is LiveChapter => Boolean(c)
  );
  if (misc.length > 0) {
    chapters.push({ id: "pa-album", title: "Kujtime të tjera", icon: "teddy", photos: misc });
  }
  return chapters;
}

/** Diacritic-insensitive lowercase, so "klasës së pestë" matches "klases se peste". */
function normalizeText(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * A graduation post talks about the 5th-grade cohort or a "generation"
 * finishing — the yearly June farewell posts with certificates and cake.
 * Kept keyword-based so each future June's post appears here automatically.
 */
function isGraduationPost(message: string | null): boolean {
  if (!message) return false;
  const t = normalizeText(message);
  const cohort =
    t.includes("klasen e pest") ||
    t.includes("klases se pest") ||
    t.includes("klasa e pest") ||
    t.includes("gjenerat");
  const finished = t.includes("perfund") || t.includes("mbarim") || t.includes("diplom");
  return cohort && finished;
}

export type LiveGenerationPhoto = { id: string; url: string; width: number | null; height: number | null };
export type LiveGeneration = {
  id: string;
  label: string;
  endYear: number;
  dateLabel: string;
  letter: string;
  photos: LiveGenerationPhoto[];
};

/**
 * Groups live Facebook posts into one "generation" per graduation year,
 * for the /gjeneratat wall. Same live-fetch tradeoffs as
 * `getLiveFacebookPhotos` — see that function's doc comment.
 */
export async function getLiveGenerations(
  formatDate: (d: Date) => string,
  limit = 25
): Promise<LiveGeneration[]> {
  const posts = await fetchLivePosts(limit);

  const byYear = new Map<number, LiveGeneration>();
  for (const post of posts) {
    if (post.images.length === 0 || !isGraduationPost(post.message)) continue;
    const endYear = post.postedAt.getFullYear();
    const photos = post.images.map((img) => ({
      id: img.fbId,
      url: img.src,
      width: img.width,
      height: img.height,
    }));
    const existing = byYear.get(endYear);
    if (existing) {
      existing.photos.push(...photos);
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
        photos,
      });
    }
  }
  return Array.from(byYear.values()).sort((a, b) => b.endYear - a.endYear);
}
